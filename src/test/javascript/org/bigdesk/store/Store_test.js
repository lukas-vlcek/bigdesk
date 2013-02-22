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

goog.require('org.bigdesk.store.Store');

goog.require('goog.testing.jsunit');

var testMissingTimestamp = function() {

    var store = new org.bigdesk.store.Store();

    try {
        var error = assertThrows('Must throw an Error',store.addNodesStats());
        fail('store.addNodesStats incorrectly doesn\'t thrown exception');
    } catch (e) {
        assertEquals('error message', 'timestamp must be a number', e.message);
    }
};

var testMissingItem = function() {

    var store = new org.bigdesk.store.Store();

    try {
        var error = assertThrows('Must throw an Error',store.addNodesStats(1));
        fail('store.addNodesStats incorrectly doesn\'t thrown exception');
    } catch (e) {
        assertEquals('error message', 'item must be an object', e.message);
    }
};

var testNullTimestamp = function() {

    var store = new org.bigdesk.store.Store();

    try {
        var error = assertThrows('Must throw an Error',store.addNodesStats(null));
        fail('store.addNodesStats incorrectly doesn\'t thrown exception');
    } catch (e) {
        assertEquals('error message', 'timestamp must be a number', e.message);
    }
};

var testNullItem = function() {

    var store = new org.bigdesk.store.Store();

    try {
        var error = assertThrows('Must throw an Error',store.addNodesStats(1, null));
        fail('store.addNodesStats incorrectly doesn\'t thrown exception');
    } catch (e) {
        assertEquals('error message', 'item must be an object', e.message);
    }
};

var testUndefinedTimestamp = function() {

    var store = new org.bigdesk.store.Store();

    var undef;
    assertTrue(!goog.isDef(undef));
    try {
        var error = assertThrows('Must throw an Error',store.addNodesStats(undef));
        fail('store.addNodesStats incorrectly doesn\'t thrown exception');
    } catch (e) {
        assertEquals('error message', 'timestamp must be a number', e.message);
    }
};

var testUndefinedItem = function() {

    var store = new org.bigdesk.store.Store();

    var undef;
    assertTrue(!goog.isDef(undef));
    try {
        var error = assertThrows('Must throw an Error',store.addNodesStats(1, undef));
        fail('store.addNodesStats incorrectly doesn\'t thrown exception');
    } catch (e) {
        assertEquals('error message', 'item must be an object', e.message);
    }
};

var testDropItems = function() {

    var store = new org.bigdesk.store.Store();

    store.addNodesStats(3, {});
    store.addNodesStats(5, {});
    store.addNodesStats(4, {});
    store.addNodesStats(2, {});

    assertEquals("NodesStats array should have four items", 4, store.nodesStats.length);

    assertArrayEquals("if dropped from 1 no items are actually removed",
        [],
        goog.array.map(store.dropNodesStatsStartingFrom(1), function(item){ return item.timestamp })
    );

    assertEquals("NodesStats array should have still four items", 4, store.nodesStats.length);

    assertArrayEquals("if dropped from 1 no items are actually removed",
        [5,4,3,2],
        goog.array.map(store.dropNodesStatsStartingFrom(6), function(item){ return item.timestamp })
    );

    assertEquals("NodesStats array should be empty now", 0, store.nodesStats.length);
};

var testNodesStats = function() {
    var store = new org.bigdesk.store.Store();
    genericMethod_(
        function(){return store.nodesStats},
        goog.bind(store.addNodesStats, store),
        goog.bind(store.dropNodesStatsStartingFrom, store)
    );
};

var testNodesInfos = function() {
    var store = new org.bigdesk.store.Store();
    genericMethod_(
        function(){return store.nodesInfos},
        goog.bind(store.addNodesInfo, store),
        goog.bind(store.dropNodesInfosStartingFrom, store)
    );
};

var testClusterStates = function() {
    var store = new org.bigdesk.store.Store();
    genericMethod_(
        function(){return store.clusterStates},
        goog.bind(store.addClusterState, store),
        goog.bind(store.dropClusterStatesStaringFrom, store)
    );
};

var testClusterHealths = function() {
    var store = new org.bigdesk.store.Store();
    genericMethod_(
        function(){return store.clusterHealths},
        goog.bind(store.addClusterHealth, store),
        goog.bind(store.dropClusterHealthsStaringFrom, store)
    );
};

var testIndexSegments = function() {
    var store = new org.bigdesk.store.Store();
    genericMethod_(
        function(){return store.indexSegments},
        goog.bind(store.addIndexSegments, store),
        goog.bind(store.dropIndexSegmentsStaringFrom, store)
    );
};

var testHotThreads= function() {
    var store = new org.bigdesk.store.Store();
    genericMethod_(
        function(){return store.hotThreads},
        goog.bind(store.addHotThreads, store),
        goog.bind(store.dropHotThreadsStaringFrom, store)
    );
};

/**
 * @param {!function(): goog.array.ArrayLike} getArray
 * @param {!function(!number, !Object)} addMethod
 * @param {!function(!number)} dropMethod
 * @private
 */
var genericMethod_ = function(getArray, addMethod, dropMethod) {

    assertEquals("Array is empty", 0, getArray.length);

    addMethod(1, {});
    addMethod(3, {});
    addMethod(5, {});
    addMethod(4, {});
    addMethod(2, {});

    assertEquals("array should have five items", 5, getArray().length);
    assertArrayEquals("array should be kept ordered",
        [5,4,3,2,1],
        goog.array.map(getArray(), function(item){ return item.timestamp })
    );

    // drop all items after timestamp that is explicitly present in the array
    var dropped = dropMethod(2);
    assertArrayEquals("dropped array is also ordered",
        [2,1],
        goog.array.map(dropped, function(item){ return item.timestamp })
    );

    assertArrayEquals("array should be kept sorted",
        [5,4,3],
        goog.array.map(getArray(), function(item){ return item.timestamp })
    );

    addMethod(7, {});
    addMethod(8, {});
    addMethod(9, {});

    assertArrayEquals("array should be kept sorted",
        [9,8,7,5,4,3],
        goog.array.map(getArray(), function(item){ return item.timestamp })
    );

    // drop all items after timestamp that is not explicitly present in the array
    dropped = dropMethod(6);
    assertArrayEquals("dropped array is also sorted",
        [5,4,3],
        goog.array.map(dropped, function(item){ return item.timestamp })
    );

    assertArrayEquals("array should be kept sorted",
        [9,8,7],
        goog.array.map(getArray(), function(item){ return item.timestamp })
    );
};