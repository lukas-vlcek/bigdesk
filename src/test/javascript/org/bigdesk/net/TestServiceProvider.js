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

goog.provide('org.bigdesk.net.TestServiceProvider');

goog.require('org.bigdesk.net.Service');
goog.require('org.bigdesk.net.ServiceProvider');
goog.require('org.bigdesk.net.TestService');

goog.require('goog.Uri');

/**
 *
 * @constructor
 * @implements {org.bigdesk.net.ServiceProvider}
 */
org.bigdesk.net.TestServiceProvider = function() {};

/** @inheritDoc */
org.bigdesk.net.TestServiceProvider.prototype.getService = function (name, uri) {

    if (name === 'test') {
        return new org.bigdesk.net.TestService(uri);
    }

};