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
 * @fileoverview A store for data retrieved from elasticsearch node.
 * @author Lukas Vlcek (lukas.vlcek@gmail.com)
 */

goog.provide('org.bigdesk.store.Store');

goog.require('goog.array');

goog.require("goog.Disposable");

/**
 * Store is not typically created directly. It is managed by the Manager.
 * @constructor
 * @extends {goog.Disposable}
 */
org.bigdesk.store.Store = function() {
    goog.Disposable.call(this);

    /** @type {Array.<{timestamp: number, value: !Object}>} */
    this.nodesStats = [];

    /** @type {Array.<{timestamp: number, value: !Object}>} */
    this.nodesInfos = [];

    /** @type {Array.<{timestamp: number, value: !Object}>} */
    this.clusterStates = [];

    /** @type {Array.<{timestamp: number, value: !Object}>} */
    this.clusterHealths = [];

    /** @type {Array.<{timestamp: number, value: !Object}>} */
    this.indexSegments = [];

    /** @type {Array.<{timestamp: number, value: string}>} */
    this.hotThreads = [];

    /** @private */ this.setNodesStats     = goog.bind(function(a){this.nodesStats=a},this);
    /** @private */ this.setNodesInfos     = goog.bind(function(a){this.nodesInfos=a},this);
    /** @private */ this.setClusterStates  = goog.bind(function(a){this.clusterStates=a},this);
    /** @private */ this.setClusterHealths = goog.bind(function(a){this.clusterHealths=a},this);
    /** @private */ this.setIndexSegments  = goog.bind(function(a){this.indexSegments=a},this);
    /** @private */ this.setHotThreads     = goog.bind(function(a){this.hotThreads=a},this);
};
goog.inherits(org.bigdesk.store.Store, goog.Disposable);

/** @inheritDoc */
org.bigdesk.store.Store.prototype.disposeInternal = function() {
    org.bigdesk.store.Store.superClass_.disposeInternal.call(this);

    delete this.setNodesStats;
    delete this.setNodesInfos;
    delete this.setClusterStates;
    delete this.setClusterHealths;
    delete this.setIndexSegments;
    delete this.setHotThreads;

    delete this.nodesStats;
    delete this.nodesInfos;
    delete this.clusterStates;
    delete this.clusterHealths;
    delete this.indexSegments;
    delete this.hotThreads;
};

/**
 * Add a new item into nodesStats.
 * @param {number} timestamp
 * @param {!Object} nodesStats
 * @return {boolean} True if an element was inserted.
 */
org.bigdesk.store.Store.prototype.addNodesStats = function(timestamp, nodesStats) {
    return this.addItem_(timestamp, nodesStats, this.nodesStats);
};

/**
 * Remove all items from nodesStats older then timestamp (including).
 * @param {number} timestamp
 * @return {!Array.<number>} array with dropped timestamps
 */
org.bigdesk.store.Store.prototype.dropNodesStatsStartingFrom = function(timestamp) {
    return this.dropItemStartingFrom_(timestamp, this.nodesStats, this.setNodesStats);
};

/**
 * Add a new item into nodesInfo.
 * @param {number} timestamp
 * @param {!Object} nodesInfo
 * @return {boolean}
 */
org.bigdesk.store.Store.prototype.addNodesInfo = function(timestamp, nodesInfo) {
    return this.addItem_(timestamp, nodesInfo, this.nodesInfos);
};

/**
 * Remove all items from nodesInfo older then timestamp (including).
 * @param {number} timestamp
 * @return {!Array.<number>} array with dropped timestamps
 */
org.bigdesk.store.Store.prototype.dropNodesInfosStartingFrom = function(timestamp) {
    return this.dropItemStartingFrom_(timestamp, this.nodesInfos, this.setNodesInfos);
};

/**
 * Add a new item into clusterStates.
 * @param {number} timestamp
 * @param {!Object} clusterState
 * @return {boolean}
 */
org.bigdesk.store.Store.prototype.addClusterState = function(timestamp, clusterState) {
    return this.addItem_(timestamp, clusterState, this.clusterStates);
};

/**
 * Remove all items from clusterStates older then timestamp (including).
 * @param {number} timestamp
 * @return {!Array.<number>} array with dropped timestamps
 */
org.bigdesk.store.Store.prototype.dropClusterStatesStaringFrom = function(timestamp) {
    return this.dropItemStartingFrom_(timestamp, this.clusterStates, this.setClusterStates);
};

/**
 * Add a new item into clusterHealths.
 * @param {number} timestamp
 * @param {!Object} clusterHealth
 * @return {boolean}
 */
org.bigdesk.store.Store.prototype.addClusterHealth = function(timestamp, clusterHealth) {
    return this.addItem_(timestamp, clusterHealth, this.clusterHealths);
};

/**
 * Remove all items from clusterHealths older then timestamp (including).
 * @param {number} timestamp
 * @return {!Array.<number>} array with dropped timestamps
 */
org.bigdesk.store.Store.prototype.dropClusterHealthsStaringFrom = function(timestamp) {
    return this.dropItemStartingFrom_(timestamp, this.clusterHealths, this.setClusterHealths);
};

/**
 * Add a new item into indexSegments.
 * @param {number} timestamp
 * @param {!Object} indexSegments
 * @return {boolean}
 */
org.bigdesk.store.Store.prototype.addIndexSegments = function(timestamp, indexSegments) {
    return this.addItem_(timestamp, indexSegments, this.indexSegments);
};

/**
 * Remove all items from indexSegments older then timestamp (including).
 * @param {number} timestamp
 * @return {!Array.<number>} array with dropped timestamps
 */
org.bigdesk.store.Store.prototype.dropIndexSegmentsStaringFrom = function(timestamp) {
    return this.dropItemStartingFrom_(timestamp, this.indexSegments, this.setIndexSegments);
};

/**
 * Add a new item into hotThreads.
 * @param {number} timestamp
 * @param {string} hotThreads
 * @return {boolean}
 */
org.bigdesk.store.Store.prototype.addHotThreads = function(timestamp, hotThreads) {
    return this.addItem_(timestamp, hotThreads, this.hotThreads);
};

/**
 * Remove all items from hotThreads older then timestamp (including).
 * @param {number} timestamp
 * @return {!Array.<number>} array with dropped timestamps
 */
org.bigdesk.store.Store.prototype.dropHotThreadsStaringFrom = function(timestamp) {
    return this.dropItemStartingFrom_(timestamp, this.hotThreads, this.setHotThreads);
};

/**
 * Compares its two arguments for order, using < and > operators.
 * @param {{timestamp: number}} a The first object to be compared.
 * @param {{timestamp: number}} b The second object to be compared.
 * @return {number} A negative number, zero, or a positive number as the first
 *     argument is less than, equal to, or greater than the second.
 * @private
 */
org.bigdesk.store.Store.prototype.timestampsCompare = function(a, b) {
    return a.timestamp < b.timestamp ? 1 : a.timestamp > b.timestamp ? -1 : 0;
};

/**
 * Compares its two arguments for order, using > operator only.
 * @param {{timestamp: number}} a The first object to be compared.
 * @param {{timestamp: number}} b The second object to be compared.
 * @return {number} A zero, or a positive number as the first
 *     argument is equal to, or greater than the second. (If the
 *     first argument is less then the second, they are treated equal).
 *     This function is used to find and index after which all objects
 *     are lesser.
 * @private
 */
org.bigdesk.store.Store.prototype.timestampsCompareOnlyGreater = function(a, b) {
    return a.timestamp < b.timestamp ? 1 : 0;
};

/**
 * @param {number} timestamp
 * @param {!Object|string} item can be JSON or string (hot threads)
 * @param {Array.<{timestamp: number}>} array
 * @return {boolean} insert succeeded?
 * @private
 */
org.bigdesk.store.Store.prototype.addItem_ = function(timestamp, item, array) {
    if (!goog.isNumber(timestamp)) { throw new Error("timestamp must be a number") }
    if (!goog.isObject(item) && !goog.isString(item)) { throw new Error("item must be an object") }
    var newArrayElement = { timestamp: timestamp, value: item };
    // We assume an array is sorted (descending) so we can optimize here.
    // First we check the first element's timestamp, if it is less then incoming
    // timestamp we can insert new value at the first position in the array.
    if (array.length > 0 && array[0].timestamp < timestamp) {
        array.unshift(newArrayElement);
        return true;
    } else {
    // else we do binary insert
        return goog.array.binaryInsert(
            array,
            newArrayElement,
            this.timestampsCompare
        );
    }
};

/**
 * @param {number} timestamp
 * @param {goog.array.ArrayLike} array
 * @param {function(goog.array.ArrayLike)} setParentArray function to set array in parent
 * @return {!Array.<number>} array with dropped timestamps
 * @private
 */
org.bigdesk.store.Store.prototype.dropItemStartingFrom_ = function(timestamp, array, setParentArray) {
    if (!goog.isNumber(timestamp)) { throw new Error("timestamp must be a number") }
    var index = goog.array.binarySearch(
        array,
        { timestamp: timestamp },
        this.timestampsCompareOnlyGreater);
    if (index >= 0) {
        var dropped = /** @type {!Array.<number>} */ (goog.array.slice(array, index));
        setParentArray(goog.array.slice(array, 0, index));
        return dropped;
    } else {
        return [];
    }
};
