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
 * @fileoverview Event that is fired when request fails.
 * @author Lukas Vlcek (lukas.vlcek@gmail.com)
 */

goog.provide('org.bigdesk.store.event.RequestError');

goog.require('goog.events.Event');

/**
 * Create a new instance.
 * @param {!Object} error
 * @param {number=} opt_timestamp if not provided goog.now() is used instead
 * @constructor
 */
org.bigdesk.store.event.RequestError = function(error, opt_timestamp) {

    goog.events.Event.call(this, error);

    /**
     * @type {!Object}
     * @private
     */
    this.error_ = error;

    /**
     * @type {!number}
     * @private
     */
    this.timestamp_ = opt_timestamp || goog.now();

};
goog.inherits(org.bigdesk.store.event.RequestError, goog.events.Event);

/**
 * @return {!Object}
 */
org.bigdesk.store.event.RequestError.prototype.gerError = function() {
    return this.error_;
};

/**
 * @return {!number}
 */
org.bigdesk.store.event.RequestError.prototype.getTimestamp = function() {
    return this.timestamp_;
};


