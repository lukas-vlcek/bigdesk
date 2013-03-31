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
 * @fileoverview NoopService is a Service used for tests instead of production Service implementations.
 * It does nothing and the idea is that it is used in combination with {@link org.bigdesk.store.TestManager}.
 * @author Lukas Vlcek (lukas.vlcek@gmail.com)
 */

goog.provide('org.bigdesk.net.NoopService');

goog.require('org.bigdesk.net.Service');

/**
 * @constructor
 * @implements {org.bigdesk.net.Service}
 */
org.bigdesk.net.NoopService = goog.nullFunction;

/** @inheritDoc */
org.bigdesk.net.NoopService.prototype.getNodesStats = function(callback, opt_errback, opt_timestamp) {};

/** @inheritDoc */
org.bigdesk.net.NoopService.prototype.getNodesInfo = function(callback, opt_errback, opt_timestamp) {};

/** @inheritDoc */
org.bigdesk.net.NoopService.prototype.getClusterStates = function(callback, opt_errback, opt_timestamp) {};

/** @inheritDoc */
org.bigdesk.net.NoopService.prototype.getClusterHealth = function(callback, opt_errback, opt_timestamp) {};

/** @inheritDoc */
org.bigdesk.net.NoopService.prototype.getIndexSegments = function(callback, opt_errback, opt_timestamp) {};

/** @inheritDoc */
org.bigdesk.net.NoopService.prototype.getHotThreads = function(callback, opt_errback, opt_timestamp) {};