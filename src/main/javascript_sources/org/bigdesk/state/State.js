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
 * @fileoverview
 * @author Lukas Vlcek (lukas.vlcek@gmail.com)
 */

goog.provide('org.bigdesk.state.State');

/**
 *
 * @param {number} position
 * @param {?{timestamp: number, value: !Object}} nodesStats
 * @param {?{timestamp: number, value: !Object}} nodesInfo
 * @param {?{timestamp: number, value: !Object}} clusterState
 * @param {?{timestamp: number, value: !Object}} clusterHealth
 * @param {?{timestamp: number, value: !Object}} indexSegments
 * @param {?{timestamp: number, value: string}}  hotThreads
 * @constructor
 */
org.bigdesk.state.State = function (position, nodesStats, nodesInfo, clusterState,
                                    clusterHealth, indexSegments, hotThreads) {
    /**
     * @type {number}
     * @private
     */
    this.position_ = position;

    /**
     * @type {?{timestamp: number, value: !Object}}
     * @private
     */
    this.nodesStats_ = nodesStats;

    /**
     * @type {?{timestamp: number, value: !Object}}
     * @private
     */
    this.nodesInfo_ = nodesInfo;

    /**
     * @type {?{timestamp: number, value: !Object}}
     * @private
     */
    this.clusterState_ = clusterState;

    /**
     * @type {?{timestamp: number, value: !Object}}
     * @private
     */
    this.clusterHealth_ = clusterHealth;

    /**
     * @type {?{timestamp: number, value: !Object}}
     * @private
     */
    this.indicesSegments_ = indexSegments;

    /**
     * @type {?{timestamp: number, value: string}}
     * @private
     */
    this.hotThreads_ = hotThreads;
};

/**
 * Position of this State.
 * @return {number}
 */
org.bigdesk.state.State.prototype.getPosition = function() {
    return this.position_ ;
};

/**
 * @return {?{timestamp: number, value: !Object}}
 */
org.bigdesk.state.State.prototype.getNodesStats = function() {
    return this.nodesStats_;
};

/**
 * @return {?{timestamp: number, value: !Object}}
 */
org.bigdesk.state.State.prototype.getNodesInfo = function() {
    return this.nodesInfo_;
};

/**
 * @return {?{timestamp: number, value: !Object}}
 */
org.bigdesk.state.State.prototype.getClusterState = function() {
    return this.clusterState_;
};

/**
 * @return {?{timestamp: number, value: !Object}}
 */
org.bigdesk.state.State.prototype.getClusterHealth = function() {
    return this.clusterHealth_;
};

/**
 * @return {?{timestamp: number, value: !Object}}
 */
org.bigdesk.state.State.prototype.getIndicesSegments = function() {
    return this.indicesSegments_;
};

/**
 * @return {?{timestamp: number, value: string}}
 */
org.bigdesk.state.State.prototype.getHotThreads = function() {
    return this.hotThreads_;
};