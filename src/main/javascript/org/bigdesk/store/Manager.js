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
 *     <li>Starts, stops and manages delays between all async calls.
 *     <li>Collects responses from async calls and pushes them to Store.
 *     <li>Drops old data from Store.
 *     <li>Fires custom events when data in Store changes.
 * </ul>
 * Execution of async calls is delegated to Service implementation provided by ServiceProvider.
 * @author Lukas Vlcek (lukas.vlcek@gmail.com)
 */

goog.provide('org.bigdesk.store.Manager');
goog.provide('org.bigdesk.store.Manager.EventType');

goog.require('org.bigdesk.store.event.NodesStatsAdd');
//goog.require('org.bigdesk.store.event.NodesStatsRemove');
goog.require('org.bigdesk.store.event.NodesInfoAdd');
//goog.require('org.bigdesk.store.event.NodesInfoRemove');

goog.require('org.bigdesk.store.Store');

//goog.require('org.bigdesk.net.Service');
//goog.require('org.bigdesk.net.ServiceProvider');
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

    this.serviceProvider_ = goog.isDef(opt_serviceProvider) ? opt_serviceProvider : new org.bigdesk.net.DefaultServiceProvider();

    /** @type {!goog.Uri} */
    var endpointUri = goog.Uri.parse(this.config.endpoint);

    /**
     * @type {!org.bigdesk.net.Service}
     * @private
     */
    this.xhrService = this.serviceProvider_.getService(this.config.net_service_provider,endpointUri);
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
            console.log('delay_nodesStats');
            thiz_.xhrService.getNodesStats(goog.bind(thiz_.processNodesStatsDelay, thiz_))
        },
        this.config.delay);

    this.delay_nodesInfo = new goog.async.Delay(
        function(){
            console.log('delay_nodesInfo');
            thiz_.xhrService.getNodesInfo(goog.bind(thiz_.processNodesInfoDelay, thiz_))
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
    delete this.xhrService;
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
    console.log('>>>', this);
    this.dropOldNodesStats(timestamp - this.config.window);
    this.processNewNodesStats(timestamp, data);
    this.delay_nodesStats.start();
};

/**
 * Called when a new nodes stats data is retrieved.
 * @param {!number} timestamp
 * @param {!Object} data
 * @protected
 */
org.bigdesk.store.Manager.prototype.processNewNodesStats = function(timestamp, data) {
    this.store.addNodesStats(timestamp, data);
    var event = new org.bigdesk.store.event.NodesStatsAdd(timestamp, data);
    this.dispatchEvent(event);
};

/**
 *
 * @param {!number} timestamp
 * @protected
 */
org.bigdesk.store.Manager.prototype.dropOldNodesStats = function(timestamp) {
    // TODO
};

/**
 * Called from nodes info delay. Once a new data is received from the service point
 * it first drops old data, then adds a new data and resets the delay.
 * @param {!number} timestamp
 * @param {!Object} data
 * @protected
 */
org.bigdesk.store.Manager.prototype.processNodesInfoDelay = function(timestamp, data) {
    this.dropOldNodesInfo(timestamp - this.config.window);
    this.processNewNodesInfo(timestamp, data);
    this.delay_nodesInfo.start();
};

/**
 * Called when a new nodes info data is retrieved.
 * @param {!number} timestamp
 * @param {!Object} data
 * @protected
 */
org.bigdesk.store.Manager.prototype.processNewNodesInfo = function(timestamp, data) {
    this.store.addNodesInfo(timestamp, data);
    var event = new org.bigdesk.store.event.NodesInfoAdd(timestamp, data);
    this.dispatchEvent(event);
};

/**
 *
 * @param {!number} timestamp
 * @protected
 */
org.bigdesk.store.Manager.prototype.dropOldNodesInfo = function(timestamp) {
    // TODO
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
 * Events fired by the Manager.
 * @enum {string}
 */
org.bigdesk.store.Manager.EventType = {

    NODES_STATS_ADD    : goog.events.getUniqueId('nodes_stats_add'),
    NODES_STATS_REMOVE : goog.events.getUniqueId('nodes_stats_remove'),

    NODES_INFO_ADD     : goog.events.getUniqueId('nodes_info_add'),
    NODES_INFO_REMOVE  : goog.events.getUniqueId('nodes_info_remove')

};
