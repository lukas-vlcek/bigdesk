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

var testNodesStats = function() {

    var store = new org.bigdesk.store.Store();
    assertEquals("Array is empty", 0, store.nodesStats.length);

    store.addNodesStats(1, {});
    store.addNodesStats(3, {});
    store.addNodesStats(5, {});
    store.addNodesStats(4, {});
    store.addNodesStats(2, {});

    assertEquals("NodesStats array should have five items", 5, store.nodesStats.length);
    assertArrayEquals("v array should be kept sorted",
        [5,4,3,2,1],
        goog.array.map(store.nodesStats, function(item){ return item.timestamp })
    );

    // delete all from existing timestamp
    store.removeNodesStatsStaringFrom(2);

    assertArrayEquals("NodesStats array should be kept sorted",
        [5,4,3],
        goog.array.map(store.nodesStats, function(item){ return item.timestamp })
    );

    store.addNodesStats(7, {});
    store.addNodesStats(8, {});
    store.addNodesStats(9, {});

    assertArrayEquals("NodesStats array should be kept sorted",
        [9,8,7,5,4,3],
        goog.array.map(store.nodesStats, function(item){ return item.timestamp })
    );

    // delete all from non-existing timestamp
    store.removeNodesStatsStaringFrom(6);

    assertArrayEquals("NodesStats array should be kept sorted",
        [9,8,7],
        goog.array.map(store.nodesStats, function(item){ return item.timestamp })
    );
};

var testNodesInfos = function() {

    var store = new org.bigdesk.store.Store();
    assertEquals("Array is empty", 0, store.nodesInfos.length);

    store.addNodesInfo(1, {});
    store.addNodesInfo(3, {});
    store.addNodesInfo(5, {});
    store.addNodesInfo(4, {});
    store.addNodesInfo(2, {});

    assertEquals("NodesInfos array should have five items", 5, store.nodesInfos.length);
    assertArrayEquals("NodesInfos array should be kept sorted",
        [5,4,3,2,1],
        goog.array.map(store.nodesInfos, function(item){ return item.timestamp })
    );

    // delete all from existing timestamp
    store.removeNodesInfosStaringFrom(2);

    assertArrayEquals("NodesInfos array should be kept sorted",
        [5,4,3],
        goog.array.map(store.nodesInfos, function(item){ return item.timestamp })
    );

    store.addNodesInfo(7, {});
    store.addNodesInfo(8, {});
    store.addNodesInfo(9, {});

    assertArrayEquals("NodesInfos array should be kept sorted",
        [9,8,7,5,4,3],
        goog.array.map(store.nodesInfos, function(item){ return item.timestamp })
    );

    // delete all from non-existing timestamp
    store.removeNodesInfosStaringFrom(6);

    assertArrayEquals("NodesInfos array should be kept sorted",
        [9,8,7],
        goog.array.map(store.nodesInfos, function(item){ return item.timestamp })
    );
};

var testClusterStates = function() {

    var store = new org.bigdesk.store.Store();
    assertEquals("Array is empty", 0, store.clusterStates.length);

    store.addClusterState(1, {});
    store.addClusterState(3, {});
    store.addClusterState(5, {});
    store.addClusterState(4, {});
    store.addClusterState(2, {});

    assertEquals("clusterStates array should have five items", 5, store.clusterStates.length);
    assertArrayEquals("clusterStates array should be kept sorted",
        [5,4,3,2,1],
        goog.array.map(store.clusterStates, function(item){ return item.timestamp })
    );

    // delete all from existing timestamp
    store.removeClusterStatesStaringFrom(2);

    assertArrayEquals("clusterStates array should be kept sorted",
        [5,4,3],
        goog.array.map(store.clusterStates, function(item){ return item.timestamp })
    );

    store.addClusterState(7, {});
    store.addClusterState(8, {});
    store.addClusterState(9, {});

    assertArrayEquals("clusterStates array should be kept sorted",
        [9,8,7,5,4,3],
        goog.array.map(store.clusterStates, function(item){ return item.timestamp })
    );

    // delete all from non-existing timestamp
    store.removeClusterStatesStaringFrom(6);

    assertArrayEquals("clusterStates array should be kept sorted",
        [9,8,7],
        goog.array.map(store.clusterStates, function(item){ return item.timestamp })
    );
};

var testClusterHealths = function() {

    var store = new org.bigdesk.store.Store();
    assertEquals("Array is empty", 0, store.clusterHealths.length);

    store.addClusterHealth(1, {});
    store.addClusterHealth(3, {});
    store.addClusterHealth(5, {});
    store.addClusterHealth(4, {});
    store.addClusterHealth(2, {});

    assertEquals("clusterHealths array should have five items", 5, store.clusterHealths.length);
    assertArrayEquals("clusterHealths array should be kept sorted",
        [5,4,3,2,1],
        goog.array.map(store.clusterHealths, function(item){ return item.timestamp })
    );

    // delete all from existing timestamp
    store.removeClusterHealthsStaringFrom(2);

    assertArrayEquals("clusterHealths array should be kept sorted",
        [5,4,3],
        goog.array.map(store.clusterHealths, function(item){ return item.timestamp })
    );

    store.addClusterHealth(7, {});
    store.addClusterHealth(8, {});
    store.addClusterHealth(9, {});

    assertArrayEquals("clusterHealths array should be kept sorted",
        [9,8,7,5,4,3],
        goog.array.map(store.clusterHealths, function(item){ return item.timestamp })
    );

    // delete all from non-existing timestamp
    store.removeClusterHealthsStaringFrom(6);

    assertArrayEquals("clusterHealths array should be kept sorted",
        [9,8,7],
        goog.array.map(store.clusterHealths, function(item){ return item.timestamp })
    );
};

var testIndexSegments = function() {

    var store = new org.bigdesk.store.Store();
    assertEquals("Array is empty", 0, store.indexSegments.length);

    store.addIndexSegments(1, {});
    store.addIndexSegments(3, {});
    store.addIndexSegments(5, {});
    store.addIndexSegments(4, {});
    store.addIndexSegments(2, {});

    assertEquals("indexSegments array should have five items", 5, store.indexSegments.length);
    assertArrayEquals("indexSegments array should be kept sorted",
        [5,4,3,2,1],
        goog.array.map(store.indexSegments, function(item){ return item.timestamp })
    );

    // delete all from existing timestamp
    store.removeIndexSegmentsStaringFrom(2);

    assertArrayEquals("indexSegments array should be kept sorted",
        [5,4,3],
        goog.array.map(store.indexSegments, function(item){ return item.timestamp })
    );

    store.addIndexSegments(7, {});
    store.addIndexSegments(8, {});
    store.addIndexSegments(9, {});

    assertArrayEquals("indexSegments array should be kept sorted",
        [9,8,7,5,4,3],
        goog.array.map(store.indexSegments, function(item){ return item.timestamp })
    );

    // delete all from non-existing timestamp
    store.removeIndexSegmentsStaringFrom(6);

    assertArrayEquals("indexSegments array should be kept sorted",
        [9,8,7],
        goog.array.map(store.indexSegments, function(item){ return item.timestamp })
    );
};