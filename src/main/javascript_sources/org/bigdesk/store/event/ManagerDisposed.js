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
 * @fileoverview Event that is fired when Manager is disposed (all data is lost as well).
 * @author Lukas Vlcek (lukas.vlcek@gmail.com)
 */

goog.provide('org.bigdesk.store.event.ManagerDisposed');

goog.require('org.bigdesk.store.event.EventType');
goog.require('goog.events.Event');

/**
 * TODO: this class and StoreWhippedOut can have common abstract parent
 * Create a new instance.
 * @constructor
 * @extends {goog.events.Event}
 */
org.bigdesk.store.event.ManagerDisposed = function() {

    goog.events.Event.call(this, org.bigdesk.store.event.EventType.MANAGER_DISPOSED);

    /**
     * @type {!number}
     * @private
     */
    this.timestamp_ = goog.now();

};
goog.inherits(org.bigdesk.store.event.ManagerDisposed, goog.events.Event);

/**
 * When the event has been fired (datetime in ms).
 * @return {!number}
 */
org.bigdesk.store.event.ManagerDisposed.prototype.getTimestamp = function() {
    return this.timestamp_;
};