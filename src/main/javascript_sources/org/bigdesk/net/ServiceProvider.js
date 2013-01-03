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

goog.provide('org.bigdesk.net.ServiceProvider');

/**
 * An interface that represents provider of a net Services.
 * The idea is that the provider implementation can return specific Service
 * implementation for given string name (e.g. 'xhr', 'jsonp') and Uri.
 *
 * Services are typically quite dependent on browser objects and functionality
 * (such as DOM objects) which makes it hard for (headless) testing. ServiceProvider
 * makes it easy to provide ad-hoc Services for unit tests.
 *
 * @interface
 */
org.bigdesk.net.ServiceProvider = function() {};

/**
 * Return Service for given name. Throws an error if no Service is defined for this name.
 * @param {!string} name
 * @param {!goog.Uri} uri
 * @return {!org.bigdesk.net.Service}
 */
org.bigdesk.net.ServiceProvider.prototype.getService = function(name, uri) {};