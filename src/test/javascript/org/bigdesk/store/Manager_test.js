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
goog.require('org.bigdesk.store.Manager.EventType');

goog.require('goog.testing.jsunit');

/**
 * Setup new Manager instance into global variable called 'manager'.
 * It allows for customized manager configuration.
 * @param {Object} configuration
 * @return {org.bigdesk.store.Manager}
 */
var setUpNewGlobalManager = function(configuration) {

    if (goog.isDefAndNotNull(this.manager)) { tearDown() }

    var config = {
        net_service_provider: 'test'
    };

    if (goog.isDefAndNotNull(configuration)) {
        goog.mixin(config, configuration)
    }

    /** @type {org.bigdesk.net.ServiceProvider} */
     var serviceProvider = new org.bigdesk.net.TestServiceProvider();

    this.manager = new org.bigdesk.store.Manager(config, serviceProvider);
    return this.manager;
};

var tearDown = function() {
    if (this.manager) {
        this.manager.dispose(); delete this.manager;
    }
};

/**
 * If you start the manager, it pulls all resources immediately without the delay.
 * This test uses TestService which does not execute any async requests thus the results are delivered immediately,
 * in practice, the Service executes some kind of async request, so the results are delivered after some delay.
 */
var testManagerStartStop = function () {

    var manager = setUpNewGlobalManager();

    assertEquals("Manager's store is empty", 0, manager.getNodesStatsCount());
    assertEquals("Manager's store is empty", 0, manager.getNodesInfoCount());

    manager.start().stop();

    assertEquals("Manager's store contains just one item", 1, manager.getNodesStatsCount());
    assertEquals("Manager's store contains just one item", 1, manager.getNodesInfoCount());

};

var testManagerBasicEvents = function () {

    var manager = setUpNewGlobalManager();

    var id1 = goog.events.listen(
        manager,
        org.bigdesk.store.Manager.EventType.NODES_STATS_ADD,
        function(e) {
            var event = /** @type {org.bigdesk.store.event.NodesStatsAdd} */ e;
            assertEquals('Expecting event with nodes stats', 'nodes stats', event.getNodesStats()['type'])
        }
    );

    var id2 = goog.events.listen(
        manager,
        org.bigdesk.store.Manager.EventType.NODES_INFO_ADD,
        function(e) {
            var event = /** @type {org.bigdesk.store.event.NodesInfoAdd} */ e;
            assertEquals('Expecting event with nodes info', 'nodes info', event.getNodesStats()['type'])
        }
    );

    manager.start().stop();
};