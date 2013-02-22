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

goog.provide('org.bigdesk.net.Service');

/**
 * An interface that represents net service.
 * @interface
 */
org.bigdesk.net.Service = function() {};

/**
 * Request for NodesStats data.
 * The first parameter if callback function which is passed 'timestamp' and 'json response' data.
 * The second optional parameter is value of timestamp. If not provided goog.now() is used instead.
 * @param {!function(!number, !Object)} callback
 * @param {number=} opt_timestamp
 */
org.bigdesk.net.Service.prototype.getNodesStats = function(callback, opt_timestamp) {};

/**
 * Request for NodesInfo data.
 * The first parameter if callback function which is passed 'timestamp' and 'json response' data.
 * The second optional parameter is value of timestamp. If not provided goog.now() is used instead.
 * @param {!function(!number, !Object)} callback
 * @param {number=} opt_timestamp
 */
org.bigdesk.net.Service.prototype.getNodesInfo = function(callback, opt_timestamp) {};

/**
 * Request for ClusterState data.
 * The first parameter if callback function which is passed 'timestamp' and 'json response' data.
 * The second optional parameter is value of timestamp. If not provided goog.now() is used instead.
 * @param {!function(!number, !Object)} callback
 * @param {number=} opt_timestamp
 */
org.bigdesk.net.Service.prototype.getClusterStates = function(callback, opt_timestamp) {};

/**
 * Request for ClusterHealth data.
 * The first parameter if callback function which is passed 'timestamp' and 'json response' data.
 * The second optional parameter is value of timestamp. If not provided goog.now() is used instead.
 * @param {!function(!number, !Object)} callback
 * @param {number=} opt_timestamp
 */
org.bigdesk.net.Service.prototype.getClusterHealth = function(callback, opt_timestamp) {};

/**
 * Request for IndexSegments data.
 * The first parameter if callback function which is passed 'timestamp' and 'json response' data.
 * The second optional parameter is value of timestamp. If not provided goog.now() is used instead.
 * @param {!function(!number, !Object)} callback
 * @param {number=} opt_timestamp
 */
org.bigdesk.net.Service.prototype.getIndexSegments = function(callback, opt_timestamp) {};

/**
 * Request for HotThreads data.
 * The first parameter if callback function which is passed 'timestamp' and 'json response' data.
 * The second optional parameter is value of timestamp. If not provided goog.now() is used instead.
 * @param {!function(!number, !Object)} callback
 * @param {number=} opt_timestamp
 */
org.bigdesk.net.Service.prototype.getHotThreads = function(callback, opt_timestamp) {};