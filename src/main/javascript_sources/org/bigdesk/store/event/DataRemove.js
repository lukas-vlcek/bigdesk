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

goog.provide('org.bigdesk.store.event.DataRemove');

goog.require('goog.events.Event');

/**
 * @fileoverview Event that is fired when some data is removed from the store.
 *
 * @author Lukas Vlcek (lukas.vlcek@gmail.com)
 */

/**
 *
 * @param {!string} type
 * @param {!Array.<number>} timestamps
 * @constructor
 * @extends {goog.events.Event}
 */
org.bigdesk.store.event.DataRemove = function(type, timestamps) {

    goog.events.Event.call(this, type);

    /**
     * @type {!Array.<number>}
     * @private
     */
    this.timestamps_ = timestamps;
};
goog.inherits(org.bigdesk.store.event.DataRemove, goog.events.Event);

/**
 *
 * @return {!Array.<number>}
 */
org.bigdesk.store.event.DataRemove.prototype.getTimestamps = function() {
    return this.timestamps_;
};