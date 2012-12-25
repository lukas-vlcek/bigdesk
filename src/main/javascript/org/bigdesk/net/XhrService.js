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
 * @extends {goog.Disposable}
 */
org.bigdesk.net.XhrService = function(uri) {

    goog.base(this);

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
    this.NODES_STATS_URL_ = goog.Uri.parse(this.uri.getPath() + "/_nodes/stats").toString();
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
    this.NODES_INFO_URL_ = goog.Uri.parse(this.uri.getPath() + "/_nodes").toString();
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
    delete this.uri;
    goog.dispose(this.xhrManager);
    goog.base(this, 'disposeInternal');
};

/**
 * Request for NodesStats data.
 * The first parameter if callback function which is passed 'timestamp' and 'json response' data.
 * The second optional parameter is value of timestamp. If not provided goog.now() is used instead.
 * @param {!function(number, Object)} callback
 * @param {number=} opt_timestamp
 */
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
            var event = /** @type goog.net.XhrManager.Event */ e;
            var response = event.target.getResponseJson();
            response = goog.isDef(response) ? response : {};
            callback(timestamp, response);
        },
        0 //max retries
    );
};

/**
 * Request for NodesInfo data.
 * The first parameter if callback function which is passed 'timestamp' and 'json response' data.
 * The second optional parameter is value of timestamp. If not provided goog.now() is used instead.
 * @param {!function(number, Object)} callback
 * @param {number=} opt_timestamp
 */
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
            var event = /** @type goog.net.XhrManager.Event */ e;
            var response = event.target.getResponseJson();
            response = goog.isDef(response) ? response : {};
            callback(timestamp, response);
        },
        0 //max retries
    );
};