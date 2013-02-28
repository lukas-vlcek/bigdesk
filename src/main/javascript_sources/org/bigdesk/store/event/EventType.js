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

goog.provide('org.bigdesk.store.event.EventType');

goog.require('goog.events');

/**
 * Events fired by the Manager.
 * @enum {string}
 */
org.bigdesk.store.event.EventType = {

    MANAGER_DISPOSED       : goog.events.getUniqueId('manager_disposed'),

    STORE_WHIPPED_OUT      : goog.events.getUniqueId('store_whipped_out'),

    NODES_STATS_ADD        : goog.events.getUniqueId('nodes_stats_add'),
    NODES_STATS_REMOVE     : goog.events.getUniqueId('nodes_stats_remove'),
    NODES_STATS_REQ_ERR    : goog.events.getUniqueId('nodes_stats_req_err'),

    NODES_INFO_ADD         : goog.events.getUniqueId('nodes_info_add'),
    NODES_INFO_REMOVE      : goog.events.getUniqueId('nodes_info_remove'),
    NODES_INFO_REQ_ERR     : goog.events.getUniqueId('nodes_info_req_err'),

    CLUSTER_STATE_ADD      : goog.events.getUniqueId('cluster_state_add'),
    CLUSTER_STATE_REMOVE   : goog.events.getUniqueId('cluster_state_remove'),
    CLUSTER_STATE_REQ_ERR  : goog.events.getUniqueId('cluster_state_req_err'),

    CLUSTER_HEALTH_ADD     : goog.events.getUniqueId('cluster_health_add'),
    CLUSTER_HEALTH_REMOVE  : goog.events.getUniqueId('cluster_health_remove'),
    CLUSTER_HEALTH_REQ_ERR : goog.events.getUniqueId('cluster_health_req_err'),

    INDEX_SEGMENTS_ADD     : goog.events.getUniqueId('index_segments_add'),
    INDEX_SEGMENTS_REMOVE  : goog.events.getUniqueId('index_segments_remove'),
    INDEX_SEGMENTS_REQ_ERR : goog.events.getUniqueId('index_segments_req_err'),

    HOT_THREADS_ADD        : goog.events.getUniqueId('hot_threads_add'),
    HOT_THREADS_REMOVE     : goog.events.getUniqueId('hot_threads_remove'),
    HOT_THREADS_REQ_ERR    : goog.events.getUniqueId('hot_threads_req_err')
};
