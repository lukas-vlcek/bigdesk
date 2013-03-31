/*
 * Copyright 2011-2013 Lukas Vlcek
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Head is to track state of the {@link org.bigdesk.store.Store} in specific point in time.
 * Head can read {@link org.bigdesk.state.State} of the Store.
 * @author Lukas Vlcek (lukas.vlcek@gmail.com)
 */

goog.provide('org.bigdesk.state.Head');

goog.require('org.bigdesk.state.State');
goog.require('org.bigdesk.store.Manager');
goog.require('org.bigdesk.store.event.EventType');

goog.require('goog.events');
goog.require('goog.Disposable');

/**
 * Create new instance.
 * @param {!org.bigdesk.store.Manager} manager
 * @constructor
 * @extends {goog.Disposable}
 */
org.bigdesk.state.Head = function(manager) {

    goog.Disposable.call(this);

    /**
     * @type {org.bigdesk.store.Manager}
     * @private
     */
    this.manager_ = manager;

    /**
     * @type {number}
     * @private
     */
    this.position_;

    // shortcut
    var et_ = org.bigdesk.store.event.EventType;

    this.addClusterHealth_    = goog.events.listen(this.manager_, et_.CLUSTER_HEALTH_ADD, goog.nullFunction);
    this.removeClusterHealth_ = goog.events.listen(this.manager_, et_.CLUSTER_HEALTH_REMOVE, goog.nullFunction);
    this.addClusterState_     = goog.events.listen(this.manager_, et_.CLUSTER_STATE_ADD, goog.nullFunction);
    this.removeClusterState_  = goog.events.listen(this.manager_, et_.CLUSTER_STATE_REMOVE, goog.nullFunction);
    this.addHotThreads_       = goog.events.listen(this.manager_, et_.HOT_THREADS_ADD, goog.nullFunction);
    this.removeHotThreads_    = goog.events.listen(this.manager_, et_.HOT_THREADS_REMOVE, goog.nullFunction);
    this.addIndexSegments_    = goog.events.listen(this.manager_, et_.INDEX_SEGMENTS_ADD, goog.nullFunction);
    this.removeIndexSegments_ = goog.events.listen(this.manager_, et_.INDEX_SEGMENTS_REMOVE, goog.nullFunction);
    this.addNodesInfo_        = goog.events.listen(this.manager_, et_.NODES_INFO_ADD, goog.nullFunction);
    this.removeNodesInfo_     = goog.events.listen(this.manager_, et_.NODES_INFO_REMOVE, goog.nullFunction);
    this.addNodesStats_       = goog.events.listen(this.manager_, et_.NODES_STATS_ADD, goog.nullFunction);
    this.removeNodesStats_    = goog.events.listen(this.manager_, et_.NODES_STATS_REMOVE, goog.nullFunction);
    this.storeWhippedOut_     = goog.events.listen(this.manager_, et_.STORE_WHIPPED_OUT, goog.nullFunction);
    this.managerDisposed_     = goog.events.listen(this.manager_, et_.MANAGER_DISPOSED,
        goog.bind(function(){this.manager_ = null},this)
    );

};
goog.inherits(org.bigdesk.state.Head, goog.Disposable);

/** @inheritDoc */
org.bigdesk.state.Head.prototype.disposeInternal = function() {
    org.bigdesk.state.Head.superClass_.disposeInternal.call(this);

    goog.events.unlistenByKey(this.addClusterHealth_);
    goog.events.unlistenByKey(this.removeClusterHealth_);
    goog.events.unlistenByKey(this.addClusterState_);
    goog.events.unlistenByKey(this.removeClusterState_);
    goog.events.unlistenByKey(this.addHotThreads_);
    goog.events.unlistenByKey(this.removeHotThreads_);
    goog.events.unlistenByKey(this.addIndexSegments_);
    goog.events.unlistenByKey(this.removeIndexSegments_);
    goog.events.unlistenByKey(this.addNodesInfo_);
    goog.events.unlistenByKey(this.removeNodesInfo_);
    goog.events.unlistenByKey(this.addNodesStats_);
    goog.events.unlistenByKey(this.removeNodesStats_);
    goog.events.unlistenByKey(this.storeWhippedOut_);
    goog.events.unlistenByKey(this.managerDisposed_);

    delete this.manager_; // do not dispose Manager!, just remove the reference
    delete this.position_;
};

/**
 * Return Manager or null if Manager has been disposed.
 * @return {org.bigdesk.store.Manager}
 */
org.bigdesk.state.Head.prototype.getManager = function() {
    return this.manager_;
};

/**
 *
 * @return {number}
 */
org.bigdesk.state.Head.prototype.getPosition = function() {
    return this.position_;
};

/**
 * Get State for specific timestamp.
 * @param {number} timestamp
 * @return {org.bigdesk.state.State}
 */
org.bigdesk.state.Head.prototype.getState = function(timestamp) {
    this.position_ = timestamp;
    var state = null;
    if (goog.isDefAndNotNull(this.manager_)) {

        var nodesStats    = this.manager_.getNodesStatsFor(timestamp);
        var nodesInfo     = this.manager_.getNodesInfoFor(timestamp);
        var clusterState  = this.manager_.getClusterStateFor(timestamp);
        var clusterHealth = this.manager_.getClusterHealthFor(timestamp);
        var indexSegments = this.manager_.getIndexSegmentsFor(timestamp);
        var hotThreads    = this.manager_.getHotThreadsFor(timestamp);

        state = new org.bigdesk.state.State(this.position_,
            nodesStats, nodesInfo, clusterState, clusterHealth, indexSegments, hotThreads);
    }
    return state;
};