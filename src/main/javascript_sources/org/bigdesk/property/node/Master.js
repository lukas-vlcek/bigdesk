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
 * @author
 */

goog.provide('org.bigdesk.property.node.Master');

goog.require('org.bigdesk.store.event.EventType');
goog.require('goog.events');
goog.require('goog.events.EventTarget');

/**
 *
 * @constructor
 * @extends {goog.events.EventTarget}
 */
org.bigdesk.property.node.Master = function() {
    goog.events.EventTarget.call(this);
};
goog.inherits(org.bigdesk.property.node.Master,goog.events.EventTarget);

/** @inheritDoc */
org.bigdesk.property.node.Master.prototype.disposeInternal = function() {

};
