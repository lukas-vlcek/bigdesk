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

goog.provide('org.bigdesk.store.Store');

goog.require('goog.array');

/**
 * bigdesk store
 * @constructor
 */
org.bigdesk.store.Store = function() {

    /** @type {goog.array.ArrayLike} */
    this.nodesStats = [];

    /** @type {goog.array.ArrayLike} */
    this.nodesInfo = [];

    /** @type {goog.array.ArrayLike} */
    this.clusterStates = [];

    /** @type {goog.array.ArrayLike} */
    this.clusterHealths = [];

    /** @type {goog.array.ArrayLike} */
    this.indexSegments = [];
};


/**
 * Add a new item into nodesStats.
 * @param timestamp
 * @param nodesStats
 * @return {boolean} True if an element was inserted.
 */
org.bigdesk.store.Store.prototype.addNodesStats = function(timestamp, nodesStats) {
    return this.addItem_(timestamp, nodesStats, this, 'nodesStats');
};

/**
 * Remove all items from nodesStats older then timestamp (including).
 * @param timestamp
 * @return {number}
 */
org.bigdesk.store.Store.prototype.removeNodesStatsStaringFrom = function(timestamp) {
    return this.removeItemStartingFrom_(timestamp, this, 'nodesStats');
};

/**
 * Add a new item into nodesInfo.
 * @param timestamp
 * @param nodesInfo
 * @return {boolean}
 */
org.bigdesk.store.Store.prototype.addNodesInfo = function(timestamp, nodesInfo) {
    return this.addItem_(timestamp, nodesInfo, this, 'nodesInfo');
};

/**
 * Remove all items from nodesInfo older then timestamp (including).
 * @param timestamp
 * @return {number}
 */
org.bigdesk.store.Store.prototype.removeNodesInfosStaringFrom = function(timestamp) {
    return this.removeItemStartingFrom_(timestamp, this, 'nodesInfo');
};

/**
 * Add a new item into clusterStates.
 * @param timestamp
 * @param clusterState
 * @return {boolean}
 */
org.bigdesk.store.Store.prototype.addClusterState = function(timestamp, clusterState) {
    return this.addItem_(timestamp, clusterState, this, 'clusterStates');
};

/**
 * Remove all items from clusterStates older then timestamp (including).
 * @param timestamp
 * @return {number}
 */
org.bigdesk.store.Store.prototype.removeClusterStatesStaringFrom = function(timestamp) {
    return this.removeItemStartingFrom_(timestamp, this, 'clusterStates');
};

/**
 * Add a new item into clusterHealths.
 * @param timestamp
 * @param clusterHealth
 * @return {boolean}
 */
org.bigdesk.store.Store.prototype.addClusterHealth = function(timestamp, clusterHealth) {
    return this.addItem_(timestamp, clusterHealth, this, 'clusterHealths');
};

/**
 * Remove all items from clusterHealths older then timestamp (including).
 * @param timestamp
 * @return {number}
 */
org.bigdesk.store.Store.prototype.removeClusterHealthsStaringFrom = function(timestamp) {
    return this.removeItemStartingFrom_(timestamp, this, 'clusterHealths');
};

/**
 * Add a new item into indexSegments.
 * @param timestamp
 * @param indexSegments
 * @return {boolean}
 */
org.bigdesk.store.Store.prototype.addIndexSegments = function(timestamp, indexSegments) {
    return this.addItem_(timestamp, indexSegments, this, 'indexSegments');
};

/**
 * Remove all items from indexSegments older then timestamp (including).
 * @param timestamp
 * @return {number}
 */
org.bigdesk.store.Store.prototype.removeIndexSegmentsStaringFrom = function(timestamp) {
    return this.removeItemStartingFrom_(timestamp, this, 'indexSegments');
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
 *
 * @param {number} timestamp
 * @param {Object} item
 * @param {Object} context
 * @param {string} arrayName
 * @return {boolean}
 * @private
 */
org.bigdesk.store.Store.prototype.addItem_ = function(timestamp, item, context, arrayName) {
    var newArrayElement = { timestamp: timestamp, value: item };
    // We assume an array is sorted (descending) so we can optimize here.
    // First we check the first element's timestamp, if it is less then incoming
    // timestamp we can insert new value at the first position in the array.
    if (context[arrayName].length > 0 && context[arrayName][0].timestamp < timestamp) {
        context[arrayName].unshift(newArrayElement);
        return true;
    } else {
    // else we do binary insert
        return goog.array.binaryInsert(
            context[arrayName],
            newArrayElement,
            org.bigdesk.store.Store.prototype.timestampsCompare
        );
    }
};

/**
 *
 * @param {number} timestamp
 * @param {Object} context
 * @param {string} arrayName
 * @return {number}
 * @private
 */
org.bigdesk.store.Store.prototype.removeItemStartingFrom_ = function(timestamp, context, arrayName) {
    var index = goog.array.binarySearch(
        context[arrayName],
        { timestamp: timestamp },
        org.bigdesk.store.Store.prototype.timestampsCompareOnlyGreater);
    if (index >= 0) {
        var length = context[arrayName].length;
        context[arrayName] = goog.array.slice(context[arrayName], 0, index);
        return length - context[arrayName].length;
    } else {
        return 0;
    }
};
