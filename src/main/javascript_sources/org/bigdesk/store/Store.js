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

    /** @type {goog.array.ArrayLike} */
    this.nodesStats = [];

    /** @type {goog.array.ArrayLike} */
    this.nodesInfos = [];

    /** @type {goog.array.ArrayLike} */
    this.clusterStates = [];

    /** @type {goog.array.ArrayLike} */
    this.clusterHealths = [];

    /** @type {goog.array.ArrayLike} */
    this.indexSegments = [];
};
goog.inherits(org.bigdesk.store.Store, goog.Disposable);

/** @inheritDoc */
org.bigdesk.store.Store.prototype.disposeInternal = function() {
    org.bigdesk.store.Store.superClass_.disposeInternal.call(this);
    delete this.nodesStats;
    delete this.nodesInfos;
    delete this.clusterStates;
    delete this.clusterHealths;
    delete this.indexSegments;
};

/**
 * Add a new item into nodesStats.
 * @param {!number} timestamp
 * @param {!Object} nodesStats
 * @return {boolean} True if an element was inserted.
 */
org.bigdesk.store.Store.prototype.addNodesStats = function(timestamp, nodesStats) {
    return this.addItem_(timestamp, nodesStats, this, 'nodesStats');
};

/**
 * Remove all items from nodesStats older then timestamp (including).
 * @param {!number} timestamp
 * @return {!Array.<number>} array with dropped timestamps
 */
org.bigdesk.store.Store.prototype.dropFromNodesStats = function(timestamp) {
    return this.dropItemStartingFrom_(timestamp, this, 'nodesStats');
};

/**
 * Add a new item into nodesInfo.
 * @param {!number} timestamp
 * @param {!Object} nodesInfo
 * @return {boolean}
 */
org.bigdesk.store.Store.prototype.addNodesInfo = function(timestamp, nodesInfo) {
    return this.addItem_(timestamp, nodesInfo, this, 'nodesInfos');
};

/**
 * Remove all items from nodesInfo older then timestamp (including).
 * @param {!number} timestamp
 * @return {!Array.<number>} array with dropped timestamps
 */
org.bigdesk.store.Store.prototype.dropFromNodesInfos = function(timestamp) {
    return this.dropItemStartingFrom_(timestamp, this, 'nodesInfos');
};

/**
 * Add a new item into clusterStates.
 * @param {!number} timestamp
 * @param {!Object} clusterState
 * @return {boolean}
 */
org.bigdesk.store.Store.prototype.addClusterState = function(timestamp, clusterState) {
    return this.addItem_(timestamp, clusterState, this, 'clusterStates');
};

/**
 * Remove all items from clusterStates older then timestamp (including).
 * @param {!number} timestamp
 * @return {!Array.<number>} array with dropped timestamps
 */
org.bigdesk.store.Store.prototype.dropClusterStatesStaringFrom = function(timestamp) {
    return this.dropItemStartingFrom_(timestamp, this, 'clusterStates');
};

/**
 * Add a new item into clusterHealths.
 * @param {!number} timestamp
 * @param {!Object} clusterHealth
 * @return {boolean}
 */
org.bigdesk.store.Store.prototype.addClusterHealth = function(timestamp, clusterHealth) {
    return this.addItem_(timestamp, clusterHealth, this, 'clusterHealths');
};

/**
 * Remove all items from clusterHealths older then timestamp (including).
 * @param {!number} timestamp
 * @return {!Array.<number>} array with dropped timestamps
 */
org.bigdesk.store.Store.prototype.dropClusterHealthsStaringFrom = function(timestamp) {
    return this.dropItemStartingFrom_(timestamp, this, 'clusterHealths');
};

/**
 * Add a new item into indexSegments.
 * @param {!number} timestamp
 * @param {!Object} indexSegments
 * @return {boolean}
 */
org.bigdesk.store.Store.prototype.addIndexSegments = function(timestamp, indexSegments) {
    return this.addItem_(timestamp, indexSegments, this, 'indexSegments');
};

/**
 * Remove all items from indexSegments older then timestamp (including).
 * @param {!number} timestamp
 * @return {!Array.<number>} array with dropped timestamps
 */
org.bigdesk.store.Store.prototype.dropIndexSegmentsStaringFrom = function(timestamp) {
    return this.dropItemStartingFrom_(timestamp, this, 'indexSegments');
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
 * @param {!number} timestamp
 * @param {!Object} item
 * @param {!Object} context
 * @param {!string} arrayName
 * @return {boolean} insert succeeded?
 * @private
 */
org.bigdesk.store.Store.prototype.addItem_ = function(timestamp, item, context, arrayName) {
    if (!goog.isNumber(timestamp)) { throw new Error("timestamp must be a number") }
    if (!goog.isObject(item)) { throw new Error("item must be an object") }
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
 * @param {!number} timestamp
 * @param {!Object} context
 * @param {!string} arrayName
 * @return {!Array.<number>} array with dropped timestamps
 * @private
 */
org.bigdesk.store.Store.prototype.dropItemStartingFrom_ = function(timestamp, context, arrayName) {
    if (!goog.isNumber(timestamp)) { throw new Error("timestamp must be a number") }
    var index = goog.array.binarySearch(
        context[arrayName],
        { timestamp: timestamp },
        org.bigdesk.store.Store.prototype.timestampsCompareOnlyGreater);
    if (index >= 0) {
        var dropped = /** @type {!Array.<number>} */ goog.array.slice(context[arrayName], index);
        context[arrayName] = goog.array.slice(context[arrayName], 0, index);
        return dropped;
    } else {
        return [];
    }
};
