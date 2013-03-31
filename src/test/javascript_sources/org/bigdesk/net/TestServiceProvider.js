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
 * @fileoverview Simple implementation of ServiceProvider used in tests. It knows only
 * how to serve {@link org.bigdesk.net.TestService} and {@link org.bigdesk.net.NoopService} instances.
 * @author Lukas Vlcek (lukas.vlcek@gmail.com)
 */

goog.provide('org.bigdesk.net.TestServiceProvider');

goog.require('org.bigdesk.net.ServiceProvider');
goog.require('org.bigdesk.net.TestService');
goog.require('org.bigdesk.net.NoopService');

goog.require('goog.Uri');

/**
 * @constructor
 * @implements {org.bigdesk.net.ServiceProvider}
 */
org.bigdesk.net.TestServiceProvider = function() {};

/** @inheritDoc */
org.bigdesk.net.TestServiceProvider.prototype.getService = function (name, uri) {

    if (name === 'test') {
        return new org.bigdesk.net.TestService();
    } else if (name === 'noop') {
        return new org.bigdesk.net.NoopService();
    } else {
        throw new Error("Unsupported name of service implementation ["+name+"]");
    }

};