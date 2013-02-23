/*
 * Copyright 2011-2013 Lukas Vlcek
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Concept of Store Dashboard
 * @author Lukas Vlcek (lukas.vlcek@gmail.com)
 */

goog.provide('org.bigdesk.store.Dashboard');

goog.require('org.bigdesk.store.Manager');
goog.require('goog.events.EventTarget');
goog.require('goog.dom');
goog.require('goog.dom.TagName');

/**
 * @param {!Element} element to host the dashboard
 * @param {!Element} start_button
 * @param {!Element} stop_button
 * @param {!Element} interval
 * @param {Object=} opt_conf
 * @constructor
 * @extends {goog.events.EventTarget}
 */
org.bigdesk.store.Dashboard = function(element, start_button, stop_button, interval, opt_conf) {

    goog.events.EventTarget.call(this);

    this.element_ = element;
    this.start_ = start_button;
    this.stop_ = stop_button;
    this.interval_ = interval;

    this.prepareHTML();

    var manager = new org.bigdesk.store.Manager(opt_conf);

    this.startId_     = goog.events.listen(this.start_,    'click',  function(){ manager.start() });
    this.stopId_      = goog.events.listen(this.stop_,     'click',  function(){ manager.stop() });
    this.intervalId_  = goog.events.listen(this.interval_, 'change', function(){
        var newDelay = this.options[this.selectedIndex].value;
        manager.updateDelay(newDelay);
    }, false, this.interval_);

    this.nodeInfoAddId_ = goog.events.listen(manager, org.bigdesk.store.event.EventType.NODES_INFO_ADD, function(t) {
        console.log('node info', t.getData(), manager.getNodesInfoCount());
    });
    this.nodeStatsAddId_ = goog.events.listen(manager, org.bigdesk.store.event.EventType.NODES_STATS_ADD, function(t) {
        console.log('node stats', t.getData(), manager.getNodesStatsCount());
    });
    this.clusterStateAddId_ = goog.events.listen(manager, org.bigdesk.store.event.EventType.CLUSTER_STATE_ADD, function(t) {
        console.log('cluster state', t.getData(), manager.getClusterStatesCount());
    });
    this.clusterHealthAddId_ = goog.events.listen(manager, org.bigdesk.store.event.EventType.CLUSTER_HEALTH_ADD, function(t) {
        console.log('cluster health', t.getData(), manager.getClusterHealthCount());
    });
    this.indexSegmentsAddId_ = goog.events.listen(manager, org.bigdesk.store.event.EventType.INDEX_SEGMENTS_ADD, function(t) {
        console.log('index segments', t.getData(), manager.getIndexSegmentsCount());
    });
    this.hotThreadsAddId_ = goog.events.listen(manager, org.bigdesk.store.event.EventType.HOT_THREADS_ADD, function(t) {
        console.log('hot threads', manager.getHotThreadsCount());
    });
};
goog.inherits(org.bigdesk.store.Dashboard, goog.events.EventTarget);

/** @inheritDoc */
org.bigdesk.store.Dashboard.prototype.disposeInternal = function() {
    org.bigdesk.store.Dashboard.superClass_.disposeInternal.call(this);

    goog.events.unlistenByKey(this.startId_);
    goog.events.unlistenByKey(this.stopId_);
    goog.events.unlistenByKey(this.intervalId_);

    goog.events.unlistenByKey(this.nodeInfoAddId_);
    goog.events.unlistenByKey(this.nodeStatsAddId_);
    goog.events.unlistenByKey(this.clusterStateAddId_);
    goog.events.unlistenByKey(this.clusterHealthAddId_);
    goog.events.unlistenByKey(this.indexSegmentsAddId_);
    goog.events.unlistenByKey(this.hotThreadsAddId_);

    delete this.element_;
    delete this.start_;
    delete this.stop_;
};

/**
 * @private
 */
org.bigdesk.store.Dashboard.prototype.prepareHTML = function() {

    var nodesInfoDiv     = goog.dom.createElement(goog.dom.TagName.DIV);
    var nodesStatsDiv    = goog.dom.createElement(goog.dom.TagName.DIV);
    var clusterStateDiv  = goog.dom.createElement(goog.dom.TagName.DIV);
    var clusterHealthDiv = goog.dom.createElement(goog.dom.TagName.DIV);
    var indexSegmentsDiv = goog.dom.createElement(goog.dom.TagName.DIV);
    var hotThreadsDiv    = goog.dom.createElement(goog.dom.TagName.DIV);

    this.prepareStorePartHTML(nodesInfoDiv, 'Nodes Info');
    this.prepareStorePartHTML(nodesStatsDiv, 'Nodes Stats');
    this.prepareStorePartHTML(clusterStateDiv, 'Cluster State');
    this.prepareStorePartHTML(clusterHealthDiv, 'Cluster Health');
    this.prepareStorePartHTML(indexSegmentsDiv, 'Index Segments');
    this.prepareStorePartHTML(hotThreadsDiv, 'Hot Threads');

    goog.dom.setProperties(nodesInfoDiv,    { 'class':'storePart', 'id':'nodesInfoDiv' });
    goog.dom.setProperties(nodesStatsDiv,   { 'class':'storePart', 'id':'nodesStatsDiv' });
    goog.dom.setProperties(clusterStateDiv, { 'class':'storePart', 'id':'clusterStateDiv' });
    goog.dom.setProperties(clusterHealthDiv,{ 'class':'storePart', 'id':'clusterHealthDiv' });
    goog.dom.setProperties(indexSegmentsDiv,{ 'class':'storePart', 'id':'indexSegmentsDiv' });
    goog.dom.setProperties(hotThreadsDiv,   { 'class':'storePart', 'id':'hotThreadsDiv' });

    goog.dom.append(this.element_, [nodesInfoDiv, nodesStatsDiv, clusterStateDiv, clusterHealthDiv, indexSegmentsDiv, hotThreadsDiv]);
};

/**
 *
 * @param {!Element} parent
 * @param {!string} description
 * @return {!Element}
 * @private
 */
org.bigdesk.store.Dashboard.prototype.prepareStorePartHTML = function(parent, description) {

    var count = goog.dom.createElement(goog.dom.TagName.DIV);
    goog.dom.setProperties(count, {'class':'partCount'});
    goog.dom.append(count, goog.dom.createTextNode("0"));

    var desc = goog.dom.createElement(goog.dom.TagName.DIV);
    goog.dom.setProperties(desc, {'class':'partDescription'});
    goog.dom.append(desc, goog.dom.createTextNode(description));

    var clear = goog.dom.createElement(goog.dom.TagName.DIV);
    goog.dom.setProperties(clear, {'class':'partClear'});

    goog.dom.append(parent,[
        desc, count, clear
    ]);

    return parent;
};
