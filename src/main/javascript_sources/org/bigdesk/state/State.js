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
 * @param {{timestamp: number, value: !Object}=} opt_nodesStats
 * @param {{timestamp: number, value: !Object}=} opt_nodesInfo
 * @param {{timestamp: number, value: !Object}=} opt_clusterState
 * @param {{timestamp: number, value: !Object}=} opt_clusterHealth
 * @param {{timestamp: number, value: !Object}=} opt_indexSegments
 * @param {{timestamp: number, value: string}=}  opt_hotThreads
 * @constructor
 */
org.bigdesk.state.State = function (opt_nodesStats, opt_nodesInfo, opt_clusterState,
                                    opt_clusterHealth, opt_indexSegments, opt_hotThreads) {

    this.nodesStats = opt_nodesStats;
    this.nodesInfo = opt_nodesInfo;
    this.clusterState = opt_clusterState;
    this.clusterHealth = opt_clusterHealth;
    this.indicesSegments = opt_indexSegments;
    this.hotThreads = opt_hotThreads;

};