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

goog.provide('org.bigdesk.store.snapshot.load.event.SnapshotLoadDone');
goog.provide('org.bigdesk.store.snapshot.load.event.SnapshotLoadProgress');

goog.require('org.bigdesk.store.snapshot.load.event.EventType');
goog.require('goog.events.Event');

/**
 * Create a new instance.
 * @param {!number} number_of_files
 * @param {string=} opt_message
 * @constructor
 * @extends {goog.events.Event}
 */
org.bigdesk.store.snapshot.load.event.SnapshotLoadDone = function(number_of_files, opt_message) {

    goog.events.Event.call(this, org.bigdesk.store.snapshot.load.event.EventType.SNAPSHOT_LOAD_DONE);

    /**
     * @type {!number}
     * @private
     */
    this.number_of_files_ = number_of_files;

    /**
     * @type {string}
     * @private
     */
    this.opt_message_ = opt_message || '';

};
goog.inherits(org.bigdesk.store.snapshot.load.event.SnapshotLoadDone, goog.events.Event);

/**
 * @return {string}
 */
org.bigdesk.store.snapshot.load.event.SnapshotLoadDone.prototype.getMessage = function() {
    return this.opt_message_;
};

/**
 * How many files were imported.
 * @return {!number}
 */
org.bigdesk.store.snapshot.load.event.SnapshotLoadDone.prototype.getNumberOfFiles = function() {
    return this.number_of_files_;
};

/**
 * Create a new instance.
 * @param {!number} progress
 * @constructor
 * @extends {goog.events.Event}
 */
org.bigdesk.store.snapshot.load.event.SnapshotLoadProgress = function(progress) {

    goog.events.Event.call(this, org.bigdesk.store.snapshot.load.event.EventType.SNAPSHOT_LOAD_PROGRESS);

    /**
     * @type {!number}
     * @private
     */
    this.progress_ = progress;

};
goog.inherits(org.bigdesk.store.snapshot.load.event.SnapshotLoadProgress, goog.events.Event);

/**
 * Progress of data import. Range: <0,1>
 * @return {!number}
 */
org.bigdesk.store.snapshot.load.event.SnapshotLoadProgress.prototype.getProgress = function() {
    return this.progress_;
};

