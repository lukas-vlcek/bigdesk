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
 * @fileoverview Encapsulates XHR services. Uses goog.net.XhrManager internally.
 *
 * @author Lukas Vlcek (lukas.vlcek@gmail.com)
 */

goog.provide('org.bigdesk.net.XhrService');

goog.require('org.bigdesk.net.Service');

goog.require('goog.string.path');
goog.require('goog.string');

goog.require('goog.net.XhrManager');
goog.require('goog.net.XhrManager.Event');
goog.require('goog.net.XhrManager.Request');

goog.require('goog.Uri');

goog.require("goog.Disposable");

/**
 * Create a new instance of XhrService.
 * Requires an URI as a parameter. It assumes that this URI points
 * to a valid accessible elasticsearch HTTP REST endpoint.
 * @param {!goog.Uri} uri
 * @constructor
 * @implements {org.bigdesk.net.Service}
 * @extends {goog.Disposable}
 */
org.bigdesk.net.XhrService = function(uri) {

    goog.Disposable.call(this);

    /**
     * @type {goog.Uri}
     * @private
     */
    this.uri_ = uri;

    /**
     * @type {goog.net.XhrManager}
     * @private
     */
    this.xhrManager = new goog.net.XhrManager();

    /**
     * @type {number}
     * @const
     */
    this.XHR_REQUEST_PRIORITY = 10;

    /**
     * @type {!string}
     * @private
     * @const
     */
    this.NODES_STATS_URL_ = goog.string.path.normalizePath(this.uri_.toString()) + "/_nodes/stats";
    /**
     * Code used to identify 'nodes stats' request in xhrManager.
     * @type {!string}
     * @const
     */
    this.NODES_STATS_ID_ = goog.string.hashCode(this.NODES_STATS_URL_).toString(10);

    /**
     * @type {!string}
     * @private
     * @const
     */
    this.NODES_INFO_URL_ = goog.string.path.normalizePath(this.uri_.toString()) + "/_nodes";
    /**
     * Code used to identify 'nodes info' request in xhrManager.
     * @type {!string}
     * @const
     */
    this.NODES_INFO_ID_ = goog.string.hashCode(this.NODES_INFO_URL_).toString(10);

    /**
     * @type {!string}
     * @private
     * @const
     */
    this.CLUSTER_STATE_URL_ = goog.string.path.normalizePath(this.uri_.toString()) + "/_cluster/state";
    /**
     * Code used to identify 'cluster state' request in xhrManager.
     * @type {!string}
     * @const
     */
    this.CLUSTER_STATE_ID_ = goog.string.hashCode(this.CLUSTER_STATE_URL_).toString(10);

    /**
     * @type {!string}
     * @private
     * @const
     */
    this.CLUSTER_HEALTH_URL_ = goog.string.path.normalizePath(this.uri_.toString()) + "/_cluster/health";
    /**
     * Code used to identify 'cluster health' request in xhrManager.
     * @type {!string}
     * @const
     */
    this.CLUSTER_HEALTH_ID_ = goog.string.hashCode(this.CLUSTER_HEALTH_URL_).toString(10);

    /**
     * @type {!string}
     * @private
     * @const
     */
    this.INDEX_SEGMENTS_URL_ = goog.string.path.normalizePath(this.uri_.toString()) + "/_segments";
    /**
     * Code used to identify 'cluster health' request in xhrManager.
     * @type {!string}
     * @const
     */
    this.INDEX_SEGMENTS_ID_ = goog.string.hashCode(this.INDEX_SEGMENTS_URL_).toString(10);

    /**
     * @type {!string}
     * @private
     * @const
     */
    this.HOT_THREADS_URL_ = goog.string.path.normalizePath(this.uri_.toString()) + "/_nodes/hot_threads";
    /**
     * Code used to identify 'cluster health' request in xhrManager.
     * @type {!string}
     * @const
     */
    this.HOT_THREADS_ID_ = goog.string.hashCode(this.HOT_THREADS_URL_).toString(10);
};
goog.inherits(org.bigdesk.net.XhrService, goog.Disposable);

/** @inheritDoc */
org.bigdesk.net.XhrService.prototype.disposeInternal = function() {
    org.bigdesk.net.XhrService.superClass_.disposeInternal.call(this);
    delete this.uri_;
    goog.dispose(this.xhrManager);
};

/** @inheritDoc */
org.bigdesk.net.XhrService.prototype.getNodesStats = function(callback, opt_timestamp) {
    this.getData_(this.NODES_STATS_ID_, this.NODES_STATS_URL_, callback, opt_timestamp);
};

/** @inheritDoc */
org.bigdesk.net.XhrService.prototype.getNodesInfo = function(callback, opt_timestamp) {
    this.getData_(this.NODES_INFO_ID_, this.NODES_INFO_URL_, callback, opt_timestamp);
};

/** @inheritDoc */
org.bigdesk.net.XhrService.prototype.getClusterStates = function(callback, opt_timestamp) {
    this.getData_(this.CLUSTER_STATE_ID_, this.CLUSTER_STATE_URL_, callback, opt_timestamp);
};

/** @inheritDoc */
org.bigdesk.net.XhrService.prototype.getClusterHealth = function(callback, opt_timestamp) {
    this.getData_(this.CLUSTER_HEALTH_ID_, this.CLUSTER_HEALTH_URL_, callback, opt_timestamp);
};

/** @inheritDoc */
org.bigdesk.net.XhrService.prototype.getIndexSegments = function(callback, opt_timestamp) {
    this.getData_(this.INDEX_SEGMENTS_ID_, this.INDEX_SEGMENTS_URL_, callback, opt_timestamp);
};

/** @inheritDoc */
org.bigdesk.net.XhrService.prototype.getHotThreads = function(callback, opt_timestamp) {
    this.getData_(this.HOT_THREADS_ID_, this.HOT_THREADS_URL_, callback, opt_timestamp, true);
};

/**
 * @param {!string} rest_call_id
 * @param {!string} rest_call_url
 * @param {!function(!number, !Object)} callback
 * @param {number=} opt_timestamp
 * @param {boolean=} opt_raw_text if 'true' get raw text otherwise extract JSON object
 * @private
 */
org.bigdesk.net.XhrService.prototype.getData_ = function(rest_call_id, rest_call_url, callback, opt_timestamp, opt_raw_text) {

    var text_ = (goog.isDefAndNotNull(opt_raw_text) && goog.isBoolean(opt_raw_text)) ? opt_raw_text : false;
    var timestamp = opt_timestamp || goog.now();

    this.xhrManager.abort(rest_call_id, true);
    this.xhrManager.send(
        rest_call_id,
        rest_call_url,
        'GET',
        undefined,undefined,
        this.XHR_REQUEST_PRIORITY,
        function(e){
            var event = /** @type goog.net.XhrManager.Event */ (e);
            var response = text_ ? event.target.getResponseText() : event.target.getResponseJson();
            response = goog.isDef(response) ? response : {};
            callback(timestamp, response);
        },
        0 //max retries
    );
};