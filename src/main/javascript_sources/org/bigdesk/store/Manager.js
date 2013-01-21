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

goog.require('org.bigdesk.store.event.StoreWhippedOut');
goog.require('org.bigdesk.store.event.DataAdd');
goog.require('org.bigdesk.store.event.DataRemove');
goog.require('org.bigdesk.store.share.importing.event.DataImportProgress');
goog.require('org.bigdesk.store.share.importing.event.DataImportDone');

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
        jsonp: false,
        delay: 4000,
        window: 10000
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
//    this.xhrService = new org.bigdesk.net.XhrService(endpointUri);

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

    var thiz_ = this;

    this.delay_nodesStats = new goog.async.Delay(
        function(){
            thiz_.netService.getNodesStats(goog.bind(thiz_.processNodesStatsDelay, thiz_))
        },
        this.config.delay);

    this.delay_nodesInfo = new goog.async.Delay(
        function(){
            thiz_.netService.getNodesInfo(goog.bind(thiz_.processNodesInfoDelay, thiz_))
        },
        this.config.delay);
};
goog.inherits(org.bigdesk.store.Manager, goog.events.EventTarget);

/** @inheritDoc */
org.bigdesk.store.Manager.prototype.disposeInternal = function() {
    // Call the superclass's disposeInternal() method.
    org.bigdesk.store.Manager.superClass_.disposeInternal.call(this);

    // Dispose of all Disposable objects owned by this class.
    this.delay_nodesStats.dispose();
    this.delay_nodesInfo.dispose();

    // Remove listeners added by this class.

    // Remove references to COM objects.

    // Remove references to DOM nodes, which are COM objects in IE.
    delete this.store;
    delete this.netService;
    delete this.running;
    delete this.config;
};

/**
 * Called from nodes stats delay. Once a new data is received from the service point
 * it first drops old data, then adds a new data and resets the delay.
 * @param {!number} timestamp
 * @param {!Object} data
 * @protected
 */
org.bigdesk.store.Manager.prototype.processNodesStatsDelay = function(timestamp, data) {
    this.dropFromNodesStats(timestamp - this.config.window);
    this.addIntoNodesStats(timestamp, data);
    this.delay_nodesStats.start();
};

/**
 * Called when a new nodes stats data is retrieved.
 * @param {!number} timestamp
 * @param {!Object} data
 * @protected
 */
org.bigdesk.store.Manager.prototype.addIntoNodesStats = function(timestamp, data) {
    if (goog.isNumber(timestamp) && goog.isObject(data)) {
        this.store.addNodesStats(timestamp, data);
        var event = new org.bigdesk.store.event.DataAdd(org.bigdesk.store.event.EventType.NODES_STATS_ADD, timestamp, data);
        this.dispatchEvent(event);
    } else {
        this.log.warning('Something went wrong when adding new nodes stats');
        this.log.finer('timestamp: ' + timestamp);
        this.log.finer('data: ' + goog.debug.expose(data));
    }
};

/**
 * Drop data from nodes stats.
 * @param {!number} timestamp
 * @protected
 */
org.bigdesk.store.Manager.prototype.dropFromNodesStats = function(timestamp) {
    if (goog.isNumber(timestamp)) {
        var dropped = this.store.dropFromNodesStats(timestamp);
        var event = new org.bigdesk.store.event.DataRemove(org.bigdesk.store.event.EventType.NODES_STATS_REMOVE, dropped);
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
    this.delay_nodesInfo.start();
};

/**
 * Called when a new nodes info data is retrieved.
 * @param {!number} timestamp
 * @param {!Object} data
 * @protected
 */
org.bigdesk.store.Manager.prototype.addIntoNodesInfo = function(timestamp, data) {
    if (goog.isNumber(timestamp) && goog.isObject(data)) {
        this.store.addNodesInfo(timestamp, data);
        var event = new org.bigdesk.store.event.DataAdd(org.bigdesk.store.event.EventType.NODES_INFO_ADD, timestamp, data);
        this.dispatchEvent(event);
    } else {
        this.log.warning('Something went wrong when adding new nodes info');
        this.log.finer('timestamp: ' + timestamp);
        this.log.finer('data: ' + goog.debug.expose(data));
    }
};

/**
 * Drop data from nodes info.
 * @param {!number} timestamp
 * @protected
 */
org.bigdesk.store.Manager.prototype.dropFromNodesInfo = function(timestamp) {
    if (goog.isNumber(timestamp)) {
        var dropped = this.store.dropFromNodesInfos(timestamp);
        var event = new org.bigdesk.store.event.DataRemove(org.bigdesk.store.event.EventType.NODES_INFO_REMOVE, dropped);
        this.dispatchEvent(event);
    } else {
        this.log.warning('Something went wrong when dropping data from nodes info');
        this.log.finer('timestamp: ' + timestamp);
    }
};

/**
 *
 * @return {org.bigdesk.store.Manager}
 */
org.bigdesk.store.Manager.prototype.stop = function() {
    if (this.running) {
        this.delay_nodesStats.stop();
        this.delay_nodesInfo.stop();
        this.running = false;
    }
    return this;
};

/**
 *
 * @return {org.bigdesk.store.Manager}
 */
org.bigdesk.store.Manager.prototype.start = function() {
    if (!this.running) {
        this.running = true;
        // request data right now (so we do not have to wait for delay to get first data)
        this.delay_nodesStats.fire();
        this.delay_nodesInfo.fire();
    }
    return this;
};

/**
 *
 * @return {!number}
 */
org.bigdesk.store.Manager.prototype.getNodesStatsCount = function() {
    return this.store.nodesStats.length;
};

/**
 *
 * @return {!number}
 */
org.bigdesk.store.Manager.prototype.getNodesInfoCount = function() {
    return this.store.nodesInfos.length;
};

/**
 *
 * @param {boolean} flag
 * @return {org.bigdesk.store.Manager}
 */
org.bigdesk.store.Manager.prototype.setJsonp = function(flag) {
    if (this.running) {
        throw new Error('Manager is running now. Stop the manager first.');
    }
    this.config.jsonp = flag;
    // TODO switch to xhrManager or jsonp
    // ...
    return this;
};

/**
 *
 * @return {boolean}
 */
org.bigdesk.store.Manager.prototype.isJsonp = function() {
    return this.config.jsonp;
};

/**
 * Return copy of Manager configuration.
 * @return {!Object}
 */
org.bigdesk.store.Manager.prototype.getConfiguration = function() {
    return goog.object.clone(this.config);
};

/**
 * Imports data into Store from external source.
 */
org.bigdesk.store.Manager.prototype.importData = function(importHandler) {
//    stop
    this.stop();
//    lock
//    try {
//      delete all data from store
        this.dispatchEvent(new org.bigdesk.store.event.StoreWhippedOut());

//      importData and report progress
        this.dispatchEvent(new org.bigdesk.store.share.importing.event.DataImportProgress(0));
        this.dispatchEvent(new org.bigdesk.store.share.importing.event.DataImportProgress(0.5));
        this.dispatchEvent(new org.bigdesk.store.share.importing.event.DataImportProgress(1));

        this.dispatchEvent(new org.bigdesk.store.share.importing.event.DataImportDone(0));
//    } catch (e) {
//        log
//        fire error event
//    } finally {
//        unlock
//    }
};

/**
 * Exports data from Store.
 */
org.bigdesk.store.Manager.prototype.exportData = function(exportHandler) {
//    stop
    this.stop();
//    lock
//    try {
//        exportData and report progress
//    } catch (e) {
//        log
//        fire error event
//    } finally {
//        unlock
//    }
};
