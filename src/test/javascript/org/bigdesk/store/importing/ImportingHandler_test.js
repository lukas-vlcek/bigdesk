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
goog.require('org.bigdesk.store.share.importing.ImportingHandler');

//goog.require('goog.string.path');

goog.require('goog.testing.jsunit');

var testImportHandler = function () {

    var store = new org.bigdesk.store.Store();
    var importHandler = new org.bigdesk.store.share.importing.ImportingHandler();

//    var baseUri = goog.string.path.dirname(window.location.href)+'/';

    var manifest = {

        description: "Test",
        create_date: "",
        bigdesk_version: "3.0.0",
        elasticsearch_version: "0.20.0",

        store: {
            source_type: "FileList",
            nodes_stats: [
                { uri: "nodes_stats_1.json" },
                { uri: "nodes_stats_2.json" }
            ],
            nodes_info: [
                { uri: "nodes_info_1.json" },
                { uri: "nodes_info_2.json" }
            ]
        }

    };

    assertEquals("store is empty", 0, store.nodesStats.length);

    importHandler.importData(store, manifest);

//    assertEquals("six items were imported", 6, store.nodesStats.length);
//    assertArrayEquals("array should be sorted",
//        [6,5,4,3,2,1],
//        goog.array.map(store.nodesStats, function(item){ return item.timestamp })
//    );

};
