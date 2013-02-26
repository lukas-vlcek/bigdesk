/*
 * Copyright 2011-2013 Lukas Vlcek
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Manager has couple of responsibilities:
 * <ul>
 *     <li>Starts, stops and manages delays between all [typically async] calls.
 *     <li>Collects data from responses and add them to the Store.
 *     <li>Drops old data from Store.
 *     <li>Fires custom events when data in Store changes (i.e. when new data is added or old data dropped).
 * </ul>
 * Execution of async calls is delegated to Service implementation provided by ServiceProvider.
 * @author Lukas Vlcek (lukas.vlcek@gmail.com)
 */

goog.provide('org.bigdesk.store.Manager');

goog.require('org.bigdesk.store.event.ManagerDisposed');
goog.require('org.bigdesk.store.event.StoreWhippedOut');
goog.require('org.bigdesk.store.event.DataAdd');
goog.require('org.bigdesk.store.event.DataRemove');
goog.require('org.bigdesk.store.snapshot.load.event.SnapshotLoadProgress');
goog.require('org.bigdesk.store.snapshot.load.event.SnapshotLoadDone');

goog.require('org.bigdesk.store.Store');

goog.require('org.bigdesk.net.DefaultServiceProvider');

goog.require('goog.async.Delay');
goog.require('goog.object');
goog.require('goog.Uri');

goog.require('goog.events.EventTarget');
goog.require('goog.events');

goog.require('goog.debug.Logger');

/**
 * Creates a new Manager.
 * @param {Object=} opt_config optional configuration
 * @param {org.bigdesk.net.ServiceProvider=} opt_serviceProvider
 * @constructor
 * @extends {goog.events.EventTarget}
 */
org.bigdesk.store.Manager = function(opt_config, opt_serviceProvider) {
    goog.events.EventTarget.call(this);

    /** @private */ this.log = goog.debug.Logger.getLogger('org.bigdesk.store.Manager');

    /** @private */
    this.config = {
        endpoint: 'http://localhost:9200',
        net_service_provider: 'xhr',
        delay: 4000,
        window: 60000
    };

    if (goog.isDef(opt_config)) {
        goog.object.extend(this.config, opt_config);
    }

    this.log.info('Instantiating Manager with configuration: ' + goog.debug.expose(this.config));

    this.serviceProvider = goog.isDef(opt_serviceProvider) ? opt_serviceProvider : new org.bigdesk.net.DefaultServiceProvider();

    /** @type {!goog.Uri} */
    var endpointUri = goog.Uri.parse(this.config.endpoint);

    /**
     * @type {!org.bigdesk.net.Service}
     * @private
     */
    this.netService = this.serviceProvider.getService(this.config.net_service_provider,endpointUri);

    /**
     * @type {boolean}
     * @private
     */
    this.running = false;

    /**
     * @type {!org.bigdesk.store.Store}
     * @private
     */
    this.store = new org.bigdesk.store.Store();

    /** @private */
    this.evnts_ = org.bigdesk.store.event.EventType;

    var thiz_ = this;

    /** @private */
    this.delay_nodesStats_ = new goog.async.Delay(
        function(){
            thiz_.netService.getNodesStats(
                goog.bind(thiz_.processNodesStatsDelay, thiz_),
                goog.bind(thiz_.processNodesStatsDelayError, thiz_)
            )
        },
        this.config.delay);

    /** @private */
    this.delay_nodesInfo_ = new goog.async.Delay(
        function(){
            thiz_.netService.getNodesInfo(
                goog.bind(thiz_.processNodesInfoDelay, thiz_),
                goog.bind(thiz_.processNodesInfoDelayError, thiz_)
            )
        },
        this.config.delay);

    /** @private */
    this.delay_clusterStates_ = new goog.async.Delay(
        function(){
            thiz_.netService.getClusterStates(
                goog.bind(thiz_.processClusterStatesDelay, thiz_),
                goog.bind(thiz_.processClusterStatesDelayError, thiz_)
            )
        },
        this.config.delay);

    /** @private */
    this.delay_clusterHealth_ = new goog.async.Delay(
        function(){
            thiz_.netService.getClusterHealth(
                goog.bind(thiz_.processClusterHealthDelay, thiz_),
                goog.bind(thiz_.processClusterHealthDelayError, thiz_)
            )
        },
        this.config.delay);

    /** @private */
    this.delay_indexSegments_ = new goog.async.Delay(
        function(){
            thiz_.netService.getIndexSegments(
                goog.bind(thiz_.processIndexSegmentsDelay, thiz_),
                goog.bind(thiz_.processIndexSegmentsDelayError, thiz_)
            )
        },
        this.config.delay);

    /** @private */
    this.delay_hotThreads_ = new goog.async.Delay(
        function(){
            thiz_.netService.getHotThreads(
                goog.bind(thiz_.processHotThreadsDelay, thiz_),
                goog.bind(thiz_.processHotThreadsDelayError, thiz_)
            )
        },
        this.config.delay);
};
goog.inherits(org.bigdesk.store.Manager, goog.events.EventTarget);

/** @inheritDoc */
org.bigdesk.store.Manager.prototype.disposeInternal = function() {
    // Call the superclass's disposeInternal() method.
    org.bigdesk.store.Manager.superClass_.disposeInternal.call(this);

    var event =  new org.bigdesk.store.event.ManagerDisposed();
    this.dispatchEvent(event);

    // Dispose of all Disposable objects owned by this class.
    this.delay_nodesStats_.dispose();
    this.delay_nodesInfo_.dispose();
    this.delay_clusterStates_.dispose();
    this.delay_clusterHealth_.dispose();
    this.delay_indexSegments_.dispose();
    this.delay_hotThreads_.dispose();

    // Remove listeners added by this class.
    // Remove references to COM objects.
    // Remove references to DOM nodes, which are COM objects in IE.

    delete this.store;
    delete this.netService;
    delete this.running;
    delete this.config;
    delete this.evnts_;
};

/**
 * If Manager is running return true.
 * @return {boolean}
 */
org.bigdesk.store.Manager.prototype.isRunning = function() {
    return this.running;
};

/**
 * Stop all delays in the manager.
 * @return {org.bigdesk.store.Manager}
 */
org.bigdesk.store.Manager.prototype.stop = function() {
    if (this.running) {
        this.delay_nodesStats_.stop();
        this.delay_nodesInfo_.stop();
        this.delay_clusterStates_.stop();
        this.delay_clusterHealth_.stop();
        this.delay_indexSegments_.stop();
        this.delay_hotThreads_.stop();
        this.running = false;
    }
    return this;
};

/**
 * Start all delays in the manager.
 * @return {org.bigdesk.store.Manager}
 */
org.bigdesk.store.Manager.prototype.start = function() {
    if (!this.running) {
        // request data right now (so we do not have to wait for delay to get first data)
        this.delay_nodesStats_.fire();
        this.delay_nodesInfo_.fire();
        this.delay_clusterStates_.fire();
        this.delay_clusterHealth_.fire();
        this.delay_indexSegments_.fire();
        this.delay_hotThreads_.fire();
        this.running = true;
    }
    return this;
};


/**
 * Called when a new nodes stats data is retrieved.
 * @param {!number} timestamp
 * @param {!Object} data
 * @protected
 */
org.bigdesk.store.Manager.prototype.addIntoNodesStats = function(timestamp, data) {
    this.addData_(goog.bind(this.store.addNodesStats, this.store), this.evnts_.NODES_STATS_ADD, timestamp, data);
};

/**
 * Called when a new nodes info data is retrieved.
 * @param {!number} timestamp
 * @param {!Object} data
 * @protected
 */
org.bigdesk.store.Manager.prototype.addIntoNodesInfo = function(timestamp, data) {
    this.addData_(goog.bind(this.store.addNodesInfo,this.store), this.evnts_.NODES_INFO_ADD, timestamp, data);
};

/**
 * Called when a new cluster state data is retrieved.
 * @param {!number} timestamp
 * @param {!Object} data
 * @protected
 */
org.bigdesk.store.Manager.prototype.addIntoClusterStates = function(timestamp, data) {
    this.addData_(goog.bind(this.store.addClusterState,this.store), this.evnts_.CLUSTER_STATE_ADD, timestamp, data);
};

/**
 * Called when a new cluster health data is retrieved.
 * @param {!number} timestamp
 * @param {!Object} data
 * @protected
 */
org.bigdesk.store.Manager.prototype.addIntoClusterHealths = function(timestamp, data) {
    this.addData_(goog.bind(this.store.addClusterHealth,this.store), this.evnts_.CLUSTER_HEALTH_ADD, timestamp, data);
};

/**
 * Called when a new index segments data is retrieved.
 * @param {!number} timestamp
 * @param {!Object} data
 * @protected
 */
org.bigdesk.store.Manager.prototype.addIntoIndexSegments = function(timestamp, data) {
    this.addData_(goog.bind(this.store.addIndexSegments,this.store), this.evnts_.INDEX_SEGMENTS_ADD, timestamp, data);
};

/**
 * Called when a new hot threads data is retrieved.
 * @param {!number} timestamp
 * @param {!string} data
 * @protected
 */
org.bigdesk.store.Manager.prototype.addIntoHotThreads = function(timestamp, data) {
    this.addData_(goog.bind(this.store.addHotThreads,this.store), this.evnts_.HOT_THREADS_ADD, timestamp, data);
};

/**
 * Called from nodes stats delay. Once a new data is received from the service point
 * it first drops old data, then adds a new data and resets the delay.
 * @param {!number} timestamp
 * @param {!Object} data
 * @protected
 */
org.bigdesk.store.Manager.prototype.processNodesStatsDelay = function(timestamp, data) {
    this.dropNodesStatsStartingFrom(timestamp - this.config.window);
    this.addIntoNodesStats(timestamp, data);
    this.delay_nodesStats_.start(this.config.delay);
};

/**
 * Called from nodes stats delay if service fails getting the response.
 * @param {!number} timestamp
 * @param {!Object} errObject
 * @protected
 */
org.bigdesk.store.Manager.prototype.processNodesStatsDelayError = function(timestamp, errObject) {
    this.log.severe("error getting nodes stats");
    this.log.finer('timestamp: ' + timestamp);
    this.delay_nodesStats_.start(this.config.delay);
};

/**
 * Drop data from nodes stats.
 * @param {!number} timestamp
 * @protected
 */
org.bigdesk.store.Manager.prototype.dropNodesStatsStartingFrom = function(timestamp) {
    if (goog.isNumber(timestamp)) {
        var dropped = this.store.dropNodesStatsStartingFrom(timestamp);
        var event = new org.bigdesk.store.event.DataRemove(this.evnts_.NODES_STATS_REMOVE, dropped);
        this.dispatchEvent(event);
    } else {
        this.log.warning('Something went wrong when dropping data from nodes stats');
        this.log.finer('timestamp: ' + timestamp);
    }
};

/**
 * Called from nodes info delay. Once a new data is received from the service point
 * it first drops old data, then adds a new data and resets the delay.
 * @param {!number} timestamp
 * @param {!Object} data
 * @protected
 */
org.bigdesk.store.Manager.prototype.processNodesInfoDelay = function(timestamp, data) {
    this.dropFromNodesInfo(timestamp - this.config.window);
    this.addIntoNodesInfo(timestamp, data);
    this.delay_nodesInfo_.start(this.config.delay);
};

/**
 * Called from nodes info delay if service fails getting the response.
 * @param {!number} timestamp
 * @param {!Object} errObject
 * @protected
 */
org.bigdesk.store.Manager.prototype.processNodesInfoDelayError = function(timestamp, errObject) {
    this.log.severe("error getting nodes info");
    this.log.finer('timestamp: ' + timestamp);
    this.delay_nodesInfo_.start(this.config.delay);
};


/**
 * Drop data from nodes info.
 * @param {!number} timestamp
 * @protected
 */
org.bigdesk.store.Manager.prototype.dropFromNodesInfo = function(timestamp) {
    if (goog.isNumber(timestamp)) {
        var dropped = this.store.dropNodesInfosStartingFrom(timestamp);
        var event = new org.bigdesk.store.event.DataRemove(this.evnts_.NODES_INFO_REMOVE, dropped);
        this.dispatchEvent(event);
    } else {
        this.log.warning('Something went wrong when dropping data from nodes info');
        this.log.finer('timestamp: ' + timestamp);
    }
};

/**
 * Called from cluster state delay. Once a new data is received from the service point
 * it first drops old data, then adds a new data and resets the delay.
 * @param {!number} timestamp
 * @param {!Object} data
 * @protected
 */
org.bigdesk.store.Manager.prototype.processClusterStatesDelay = function(timestamp, data) {
    this.dropFromClusterStates(timestamp - this.config.window);
    this.addIntoClusterStates(timestamp, data);
    this.delay_clusterStates_.start(this.config.delay);
};

/**
 * Called from cluster stats delay if service fails getting the response.
 * @param {!number} timestamp
 * @param {!Object} errObject
 * @protected
 */
org.bigdesk.store.Manager.prototype.processClusterStatesDelayError = function(timestamp, errObject) {
    this.log.severe("error getting cluster stats");
    this.log.finer('timestamp: ' + timestamp);
    this.delay_clusterStates_.start(this.config.delay);
};

/**
 * Drop data from cluster states.
 * @param {!number} timestamp
 * @protected
 */
org.bigdesk.store.Manager.prototype.dropFromClusterStates = function(timestamp) {
    if (goog.isNumber(timestamp)) {
        var dropped = this.store.dropClusterStatesStaringFrom(timestamp);
        var event = new org.bigdesk.store.event.DataRemove(this.evnts_.CLUSTER_STATE_REMOVE, dropped);
        this.dispatchEvent(event);
    } else {
        this.log.warning('Something went wrong when dropping data from cluster states');
        this.log.finer('timestamp: ' + timestamp);
    }
};

/**
 * Called from cluster health delay. Once a new data is received from the service point
 * it first drops old data, then adds a new data and resets the delay.
 * @param {!number} timestamp
 * @param {!Object} data
 * @protected
 */
org.bigdesk.store.Manager.prototype.processClusterHealthDelay = function(timestamp, data) {
    this.dropFromClusterHealths(timestamp - this.config.window);
    this.addIntoClusterHealths(timestamp, data);
    this.delay_clusterHealth_.start(this.config.delay);
};

/**
 * Called from cluster health delay if service fails getting the response.
 * @param {!number} timestamp
 * @param {!Object} errObject
 * @protected
 */
org.bigdesk.store.Manager.prototype.processClusterHealthDelayError = function(timestamp, errObject) {
    this.log.severe("error getting cluster health");
    this.log.finer('timestamp: ' + timestamp);
    this.delay_clusterHealth_.start(this.config.delay);
};

/**
 * Drop data from cluster healths.
 * @param {!number} timestamp
 * @protected
 */
org.bigdesk.store.Manager.prototype.dropFromClusterHealths = function(timestamp) {
    if (goog.isNumber(timestamp)) {
        var dropped = this.store.dropClusterHealthsStaringFrom(timestamp);
        var event = new org.bigdesk.store.event.DataRemove(this.evnts_.CLUSTER_HEALTH_REMOVE, dropped);
        this.dispatchEvent(event);
    } else {
        this.log.warning('Something went wrong when dropping data from cluster healths');
        this.log.finer('timestamp: ' + timestamp);
    }
};

/**
 * Called from index segments delay. Once a new data is received from the service point
 * it first drops old data, then adds a new data and resets the delay.
 * @param {!number} timestamp
 * @param {!Object} data
 * @protected
 */
org.bigdesk.store.Manager.prototype.processIndexSegmentsDelay = function(timestamp, data) {
    this.dropFromIndexSegments(timestamp - this.config.window);
    this.addIntoIndexSegments(timestamp, data);
    this.delay_indexSegments_.start(this.config.delay);
};

/**
 * Called from index segments delay if service fails getting the response.
 * @param {!number} timestamp
 * @param {!Object} errObject
 * @protected
 */
org.bigdesk.store.Manager.prototype.processIndexSegmentsDelayError = function(timestamp, errObject) {
    this.log.severe("error getting index segments");
    this.log.finer('timestamp: ' + timestamp);
    this.delay_indexSegments_.start(this.config.delay);
};

/**
 * Drop data from index segments.
 * @param {!number} timestamp
 * @protected
 */
org.bigdesk.store.Manager.prototype.dropFromIndexSegments = function(timestamp) {
    if (goog.isNumber(timestamp)) {
        var dropped = this.store.dropIndexSegmentsStaringFrom(timestamp);
        var event = new org.bigdesk.store.event.DataRemove(this.evnts_.INDEX_SEGMENTS_REMOVE, dropped);
        this.dispatchEvent(event);
    } else {
        this.log.warning('Something went wrong when dropping data from index segments');
        this.log.finer('timestamp: ' + timestamp);
    }
};

/**
 * Called from hot threads delay. Once a new data is received from the service point
 * it first drops old data, then adds a new data and resets the delay.
 * @param {!number} timestamp
 * @param {!string} data
 * @protected
 */
org.bigdesk.store.Manager.prototype.processHotThreadsDelay = function(timestamp, data) {
    this.dropFromHotThreads(timestamp - this.config.window);
    this.addIntoHotThreads(timestamp, data);
    this.delay_hotThreads_.start(this.config.delay);
};

/**
 * Called from hot threads delay if service fails getting the response.
 * @param {!number} timestamp
 * @param {!Object} errObject
 * @protected
 */
org.bigdesk.store.Manager.prototype.processHotThreadsDelayError = function(timestamp, errObject) {
    this.log.severe("error getting hot threads");
    this.log.finer('timestamp: ' + timestamp);
    this.delay_hotThreads_.start(this.config.delay);
};

/**
 * Drop data from hot threads.
 * @param {!number} timestamp
 * @protected
 */
org.bigdesk.store.Manager.prototype.dropFromHotThreads = function(timestamp) {
    if (goog.isNumber(timestamp)) {
        var dropped = this.store.dropHotThreadsStaringFrom(timestamp);
        var event = new org.bigdesk.store.event.DataRemove(this.evnts_.HOT_THREADS_REMOVE, dropped);
        this.dispatchEvent(event);
    } else {
        this.log.warning('Something went wrong when dropping data from hot segments');
        this.log.finer('timestamp: ' + timestamp);
    }
};

/**
 * Number of data items in nodes stats.
 * @return {!number}
 */
org.bigdesk.store.Manager.prototype.getNodesStatsCount = function() {
    return this.store.nodesStats.length;
};

/**
 * Number of data items in nodes info.
 * @return {!number}
 */
org.bigdesk.store.Manager.prototype.getNodesInfoCount = function() {
    return this.store.nodesInfos.length;
};

/**
 * Number of data items in cluster states.
 * @return {!number}
 */
org.bigdesk.store.Manager.prototype.getClusterStatesCount = function() {
    return this.store.clusterStates.length;
};

/**
 * Number of data items in cluster health.
 * @return {!number}
 */
org.bigdesk.store.Manager.prototype.getClusterHealthCount = function() {
    return this.store.clusterHealths.length;
};

/**
 * Number of data items in index segments.
 * @return {!number}
 */
org.bigdesk.store.Manager.prototype.getIndexSegmentsCount = function() {
    return this.store.indexSegments.length;
};

/**
 * Number of data items in hot threads.
 * @return {!number}
 */
org.bigdesk.store.Manager.prototype.getHotThreadsCount = function() {
    return this.store.hotThreads.length;
};

/**
 * Update the delay interval.
 * @param {!number} interval (in milliseconds)
 */
org.bigdesk.store.Manager.prototype.updateDelay = function(interval) {
    var r_ = this.running;
    if (r_) {this.stop()}
    this.config.delay = interval;
    if (r_) {this.start()}
};

/**
 * Returns endpoint value.
 * @return {String}
 */
org.bigdesk.store.Manager.prototype.getEndpointUri = function() {
    return this.config.endpoint;
};

/**
 * Return copy of Manager configuration.
 * @return {!Object}
 */
org.bigdesk.store.Manager.prototype.getConfiguration = function() {
    return goog.object.clone(this.config);
};

/**
 * Load data into Store.
 */
org.bigdesk.store.Manager.prototype.importData = function(loadHandler) {
//    stop
    this.stop();
//    lock
//    try {
//      delete all data from store
        this.dispatchEvent(new org.bigdesk.store.event.StoreWhippedOut());

//      loadData and report progress
        this.dispatchEvent(new org.bigdesk.store.snapshot.load.event.SnapshotLoadProgress(0));
        this.dispatchEvent(new org.bigdesk.store.snapshot.load.event.SnapshotLoadProgress(0.5));
        this.dispatchEvent(new org.bigdesk.store.snapshot.load.event.SnapshotLoadProgress(1));

        this.dispatchEvent(new org.bigdesk.store.snapshot.load.event.SnapshotLoadDone(0));
//    } catch (e) {
//        log
//        fire error event
//    } finally {
//        unlock
//    }
};

/**
 * Save Store data.
 */
org.bigdesk.store.Manager.prototype.exportData = function(saveHandler) {
//    stop
    this.stop();
//    lock
//    try {
//        saveData and report progress
//    } catch (e) {
//        log
//        fire error event
//    } finally {
//        unlock
//    }
};

/**
 *
 * @param {!function(!number, !Object): boolean} functionToCall
 * @param {!string} eventId
 * @param {!number} timestamp
 * @param {!Object|!string} data
 * @param {function=} opt_function function to extract timestamp from the data
 * @private
 */
org.bigdesk.store.Manager.prototype.addData_ = function(functionToCall, eventId, timestamp, data, opt_function) {
    if (goog.isNumber(timestamp) && (goog.isObject(data) || goog.isString(data))) {
        var t_ = timestamp;
        if (goog.isFunction(opt_function)) {
            try {
                t_ = opt_function(data);
            } catch(e) {
                // ignore, use timestamp instead
            }
        }
        functionToCall(t_, data);
        this.dispatchEvent(new org.bigdesk.store.event.DataAdd(eventId, t_, data));
    } else {
        this.log.warning('Something went wrong when adding new data');
        this.log.finer('timestamp: ' + timestamp);
        this.log.finer('data: ' + goog.debug.expose(data));
    }
};
