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

goog.provide('org.bigdesk.Init');

goog.require('org.bigdesk.store.Manager');

/*
 Quick workaround: 'require' the following two files to get rid of advanced compilation errors.
 Correct solution is described here:
 http://code.google.com/p/closure-library/wiki/FrequentlyAskedQuestions
 */
goog.require('goog.net.XhrLite');
goog.require('goog.debug.ErrorHandler');

{
    var configuration =
    {
        endpoint: 'http://localhost:9200',
        jsonp: false
    };

    var manager = new org.bigdesk.store.Manager(configuration);

    manager
        .stop()
        .setJsonp(false)
//        .delays(function(delays){
//            delays
//                .setNodesStatsDelay(3000)
//                .setNodesInfosDelay(3000)
//        })
        .start();

}
