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

// ?? I put this dependency manually here to get rid of
// TypeError: 'undefined' is not an object (evaluating 'goog.events.EventTarget')
// not sure why it was not picked by calcdeps.
goog.require('goog.events.EventTarget');

goog.require('org.bigdesk.store.Manager');
goog.require('org.bigdesk.net.TestServiceProvider');

goog.require('goog.testing.jsunit');

var testManager = function () {

    var config = {
        endpoint: 'http://localhost:9200',
        net_service_provider: 'test'
    };

    /** @type {org.bigdesk.net.ServiceProvider} */
    var serviceProvider = new org.bigdesk.net.TestServiceProvider();

    var manager = new org.bigdesk.store.Manager(config, serviceProvider);

    console.log('manager',manager);
    manager.start();

    assertTrue("We should get here...", true);

};