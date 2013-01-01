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
 * @fileoverview Event that is fired when nodes stats data is added into the store.
 * @author Lukas Vlcek (lukas.vlcek@gmail.com)
 */

goog.provide('org.bigdesk.store.event.NodesStatsAdd');

goog.require('org.bigdesk.store.Manager.EventType');

goog.require('goog.events.Event');


/**
 * @param {!number} timestamp
 * @param {!Object} json
 * @constructor
 * @extends {goog.events.Event}
 */
org.bigdesk.store.event.NodesStatsAdd = function(timestamp, json) {

    goog.base(this, org.bigdesk.store.Manager.EventType.NODES_STATS_ADD);

    /**
     * @type {!number}
     * @private
     */
    this.timestamp_ = timestamp;

    /**
     * @type {!Object}
     * @private
     */
    this.json_ = json;
};
goog.inherits(org.bigdesk.store.event.NodesStatsAdd, goog.events.Event);

/**
 *
 * @return {!Object}
 */
org.bigdesk.store.event.NodesStatsAdd.prototype.getNodesStats = function() {
    return this.json_;
};

/**
 *
 * @return {!number}
 */
org.bigdesk.store.event.NodesStatsAdd.prototype.getTimestamp = function() {
    return this.timestamp_;
};
