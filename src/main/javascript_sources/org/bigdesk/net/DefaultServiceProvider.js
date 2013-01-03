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

goog.provide('org.bigdesk.net.DefaultServiceProvider');

goog.require('org.bigdesk.net.ServiceProvider');
goog.require('org.bigdesk.net.XhrService');
goog.require('org.bigdesk.net.JsonpService');

goog.require('goog.Uri');

/**
 * The default implementation of ServiceProvider. It can return Service for two
 * different names: 'xhr' and 'jsonp'.
 * @constructor
 * @implements {org.bigdesk.net.ServiceProvider}
 */
org.bigdesk.net.DefaultServiceProvider = function() {};

/** @inheritDoc */
org.bigdesk.net.DefaultServiceProvider.prototype.getService = function (name, uri) {

    if (name === 'xhr') {
        return new org.bigdesk.net.XhrService(uri);
    } else if (name === 'jsonp') {
        return new org.bigdesk.net.JsonpService();
    } else {
        throw new Error("Unsupported name of service implementation ["+name+"]");
    }

};
