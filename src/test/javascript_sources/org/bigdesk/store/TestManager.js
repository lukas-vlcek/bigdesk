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
 * @fileoverview Manager used for tests, it changes visibility of some static method from @protected to @public.
 * The idea is that one can directly put data into managed {@link org.bigdesk.store.Store} without need to mock
 * Elasticsearch node and without {@link org.bigdesk.net.Service} pulling data from it.
 * @author Lukas Vlcek (lukas.vlcek@gmail.com)
 */

goog.provide('org.bigdesk.store.TestManager');

goog.require('org.bigdesk.store.Manager');

/**
 * Creates a new instance.
 * @param {Object=} opt_config optional configuration
 * @constructor
 * @extends {org.bigdesk.store.Manager}
 */
org.bigdesk.store.TestManager = function(opt_config) {
    org.bigdesk.store.Manager.call(this, opt_config);
};
goog.inherits(org.bigdesk.store.TestManager, org.bigdesk.store.Manager);

/**
 * Make sure TestManager can not be started (even accidentally)
 * @return {org.bigdesk.store.TestManager}
 */
org.bigdesk.store.TestManager.prototype.start = function() {
    this.stop();
    return this;
};

/**
 * Calls Manager#addIntoNodesStats(timestamp, data).
 * @param {number} timestamp
 * @param {!Object} data
 */
org.bigdesk.store.TestManager.prototype.addIntoNodesStatsTest = function(timestamp, data) {
    this.addIntoNodesStats(timestamp, data);
};

/**
 * Calls Manager#addIntoNodesInfo(timestamp, data).
 * @param {number} timestamp
 * @param {!Object} data
 */
org.bigdesk.store.TestManager.prototype.addIntoNodesInfoTest = function(timestamp, data) {
    this.addIntoNodesInfo(timestamp, data);
};

/**
 * Calls Manager#addIntoClusterStates(timestamp, data).
 * @param {number} timestamp
 * @param {!Object} data
 */
org.bigdesk.store.TestManager.prototype.addIntoClusterStatesTest = function(timestamp, data) {
    this.addIntoClusterStates(timestamp, data);
};

/**
 * Calls Manager#addIntoClusterHealths(timestamp, data).
 * @param {number} timestamp
 * @param {!Object} data
 */
org.bigdesk.store.TestManager.prototype.addIntoClusterHealthsTest = function(timestamp, data) {
    this.addIntoClusterHealths(timestamp, data);
};

/**
 * Calls Manager#addIntoIndexSegments(timestamp, data).
 * @param {number} timestamp
 * @param {!Object} data
 */
org.bigdesk.store.TestManager.prototype.addIntoIndexSegmentsTest = function(timestamp, data) {
    this.addIntoIndexSegments(timestamp, data);
};

/**
 * Calls Manager#addIntoHotThreads(timestamp, data).
 * @param {number} timestamp
 * @param {string} data
 */
org.bigdesk.store.TestManager.prototype.addIntoHotThreadsTest = function(timestamp, data) {
    this.addIntoHotThreads(timestamp, data);
};