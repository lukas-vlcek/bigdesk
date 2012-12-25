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
 *     <li>Dropping old data from Store.
 *     <li>Firing custom events when data in Store changes.
 * </ul>
 * Execution of async calls is delegated to XhrService or JsonpService (depending on Manager configuration).
 * @author Lukas Vlcek (lukas.vlcek@gmail.com)
 */

goog.provide('org.bigdesk.store.Manager');
goog.provide('org.bigdesk.store.Manager.EventType');

goog.require('org.bigdesk.net.XhrService');

goog.require('goog.async.Delay');
goog.require('goog.object');
goog.require('goog.Uri');

goog.require('goog.events');
goog.require("goog.events.EventTarget");

/**
 * Creates a new Manager.
 * @param {Object=} opt_config optional configuration
 * @constructor
 * @extends {goog.events.EventTarget}
 */
org.bigdesk.store.Manager = function(opt_config) {

    goog.base(this);

    if (goog.isDef(opt_config)) {
        goog.object.extend(this.config, opt_config);
    }

    /**
     * @type {!Object}
     * @private
     */
    this.config = {
        endpoint: 'http://localhost:9200',
        jsonp: false,
        delay: 4000,
        window: 10000
    };

    /** @type {!goog.Uri} */
    var endpointUri = goog.Uri.parse(this.config.endpoint);

    /**
     * @type {!org.bigdesk.net.XhrService}
     * @private
     */
    this.xhrService = new org.bigdesk.net.XhrService(endpointUri);

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

//    this.delayId_nodesStats = new goog.async.Delay(function(){
//    }, this.config.delay);



};
goog.inherits(org.bigdesk.store.Manager, goog.events.EventTarget);

/** @inheritDoc */
org.bigdesk.store.Manager.prototype.disposeInternal = function() {

    // Dispose of all Disposable objects owned by this class.

    // Remove listeners added by this class.

    // Remove references to COM objects.

    // Remove references to DOM nodes, which are COM objects in IE.
    delete this.store;
    delete this.xhrService;
    delete this.running;
    delete this.config;

    // Call the superclass's disposeInternal() method.
    goog.base(this, 'disposeInternal');
};

/**
 *
 * @param {number} timestamp
 * @param {Object} data
 */
org.bigdesk.store.Manager.prototype.handleNewNodesStats = function(timestamp, data) {

    this.store.addNodesStats(timestamp, data);

    // TODO fire some event!
};

/**
 *
 * @return {org.bigdesk.store.Manager}
 */
org.bigdesk.store.Manager.prototype.stop = function() {
    if (this.running) {

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
        this.xhrService.getNodesStats(this.handleNewNodesStats);
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
