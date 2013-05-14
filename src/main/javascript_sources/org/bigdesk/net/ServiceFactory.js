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
 * @fileoverview
 * @author Lukas Vlcek (lukas.vlcek@gmail.com)
 */

goog.provide('org.bigdesk.net.ServiceFactory');

/**
 * An interface that represents a factory to construct providers a network Services.
 * The idea is that the factory implementation can return specific Service
 * implementation for given string name (e.g. 'xhr', 'jsonp') and Uri.
 *
 * For network Services an internal browser objects (like XmlHttpRequest) are typically used
 * which makes it hard for (headless) testing. ServiceFactory makes it easy to allow
 * for Service mock implementation for unit tests.
 *
 * @interface
 */
org.bigdesk.net.ServiceFactory = function() {};

/**
 * Return Service for given name. Throws an error if no Service is defined for this name.
 * @param {string} name
 * @param {!goog.Uri} uri
 * @return {!org.bigdesk.net.Service}
 */
org.bigdesk.net.ServiceFactory.prototype.getService;