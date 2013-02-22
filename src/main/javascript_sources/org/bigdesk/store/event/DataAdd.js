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

goog.provide('org.bigdesk.store.event.DataAdd');

goog.require('goog.events.Event');

/**
 * @fileoverview Event that is fired when a new data is added into the store.
 *
 * @author Lukas Vlcek (lukas.vlcek@gmail.com)
 */

/**
 *
 * @param {!string} type
 * @param {!number} timestamp
 * @param {!Object|!string} data
 * @constructor
 * @extends {goog.events.Event}
 */
org.bigdesk.store.event.DataAdd = function(type, timestamp, data) {

    goog.events.Event.call(this, type);

    /**
     * @type {!number}
     * @private
     */
    this.timestamp_ = timestamp;

    /**
     * @type {!Object|!string}
     * @private
     */
    this.data_ = data;
};
goog.inherits(org.bigdesk.store.event.DataAdd, goog.events.Event);

/**
 *
 * @return {!Object|!string}
 */
org.bigdesk.store.event.DataAdd.prototype.getData = function() {
    return this.data_;
};

/**
 *
 * @return {!number}
 */
org.bigdesk.store.event.DataAdd.prototype.getTimestamp = function() {
    return this.timestamp_;
};