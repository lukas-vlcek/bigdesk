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
};


/**
 * Add a new item into nodesStats.
 * @param timestamp
 * @param nodesStats
 * @return {boolean} True if an element was inserted.
 */
org.bigdesk.store.Store.prototype.addNodesStats = function(timestamp, nodesStats) {
    return this.addItem(timestamp, nodesStats, this, 'nodesStats');
};

/**
 * Remove all items from nodesStats older then timestamp (including).
 * @param timestamp
 * @return {number}
 */
org.bigdesk.store.Store.prototype.removeNodesStatsStaringFrom = function(timestamp) {
    return this.removeItemStartingFrom(timestamp, this, 'nodesStats');
};

/**
 * Add a new item into nodesInfo.
 * @param timestamp
 * @param nodesInfo
 * @return {boolean}
 */
org.bigdesk.store.Store.prototype.addNodesInfo = function(timestamp, nodesInfo) {
    return this.addItem(timestamp, nodesInfo, this, 'nodesInfo');
};

/**
 * Remove all items from nodesInfo older then timestamp (including).
 * @param timestamp
 * @return {number}
 */
org.bigdesk.store.Store.prototype.removeNodesInfosStaringFrom = function(timestamp) {
    return this.removeItemStartingFrom(timestamp, this, 'nodesInfo');
};

/**
 * Add a new item into clusterStates.
 * @param timestamp
 * @param clusterState
 * @return {*}
 */
org.bigdesk.store.Store.prototype.addClusterState = function(timestamp, clusterState) {
    return this.addItem(timestamp, clusterState, this, 'clusterStates');
};

/**
 * Remove all items from clusterStates older then timestamp (including).
 * @param timestamp
 * @return {*}
 */
org.bigdesk.store.Store.prototype.removeClusterStatesStaringFrom = function(timestamp) {
    return this.removeItemStartingFrom(timestamp, this, 'clusterStates');
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

/** @private */
org.bigdesk.store.Store.prototype.addItem = function(timestamp, item, context, arrayName) {
    return goog.array.binaryInsert(
        context[arrayName],
        { timestamp: timestamp, value: item },
        org.bigdesk.store.Store.prototype.timestampsCompare
    );
};

/** @private */
org.bigdesk.store.Store.prototype.removeItemStartingFrom = function(timestamp, context, arrayName) {
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
