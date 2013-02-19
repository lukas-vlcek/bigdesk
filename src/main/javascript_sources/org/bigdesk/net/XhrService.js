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
    this.uri = uri;

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
    this.NODES_STATS_URL_ = goog.string.path.normalizePath(this.uri.toString()) + "/_nodes/stats";
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
    this.NODES_INFO_URL_ = goog.string.path.normalizePath(this.uri.toString()) + "/_nodes";
    /**
     * Code used to identify 'nodes info' request in xhrManager.
     * @type {!string}
     * @const
     */
    this.NODES_INFO_ID_ = goog.string.hashCode(this.NODES_INFO_URL_).toString(10);

};
goog.inherits(org.bigdesk.net.XhrService, goog.Disposable);

/** @inheritDoc */
org.bigdesk.net.XhrService.prototype.disposeInternal = function() {
    org.bigdesk.net.XhrService.superClass_.disposeInternal.call(this);
    delete this.uri;
    goog.dispose(this.xhrManager);
};

/** @inheritDoc */
org.bigdesk.net.XhrService.prototype.getNodesStats = function(callback, opt_timestamp) {

    var timestamp = opt_timestamp || goog.now();

    this.xhrManager.abort(this.NODES_STATS_ID_, true);
    this.xhrManager.send(
        this.NODES_STATS_ID_,
        this.NODES_STATS_URL_,
        'GET',
        undefined,undefined,
        this.XHR_REQUEST_PRIORITY,
        function(e){
            var event = /** @type goog.net.XhrManager.Event */ (e);
            var response = event.target.getResponseJson();
            response = goog.isDef(response) ? response : {};
            callback(timestamp, response);
        },
        0 //max retries
    );
};

/** @inheritDoc */
org.bigdesk.net.XhrService.prototype.getNodesInfo = function(callback, opt_timestamp) {

    var timestamp = opt_timestamp || goog.now();

    this.xhrManager.abort(this.NODES_INFO_ID_, true);
    this.xhrManager.send(
        this.NODES_INFO_ID_,
        this.NODES_INFO_URL_,
        'GET',
        undefined,undefined,
        this.XHR_REQUEST_PRIORITY,
        function(e){
            var event = /** @type goog.net.XhrManager.Event */ (e);
            var response = event.target.getResponseJson();
            response = goog.isDef(response) ? response : {};
            callback(timestamp, response);
        },
        0 //max retries
    );
};