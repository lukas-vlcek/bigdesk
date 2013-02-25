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
//        console.log('node info', t.getData(), manager.getNodesInfoCount());
        console.log('node info', manager.getNodesInfoCount());
    });
    this.nodeStatsAddId_ = goog.events.listen(manager, org.bigdesk.store.event.EventType.NODES_STATS_ADD, function(t) {
//        console.log('node stats', t.getData(), manager.getNodesStatsCount());
        console.log('node stats', manager.getNodesStatsCount());
    });
    this.clusterStateAddId_ = goog.events.listen(manager, org.bigdesk.store.event.EventType.CLUSTER_STATE_ADD, function(t) {
//        console.log('cluster state', t.getData(), manager.getClusterStatesCount());
        console.log('cluster state', manager.getClusterStatesCount());
    });
    this.clusterHealthAddId_ = goog.events.listen(manager, org.bigdesk.store.event.EventType.CLUSTER_HEALTH_ADD, function(t) {
//        console.log('cluster health', t.getData(), manager.getClusterHealthCount());
        console.log('cluster health', manager.getClusterHealthCount());
    });
    this.indexSegmentsAddId_ = goog.events.listen(manager, org.bigdesk.store.event.EventType.INDEX_SEGMENTS_ADD, function(t) {
//        console.log('index segments', t.getData(), manager.getIndexSegmentsCount());
        console.log('index segments', manager.getIndexSegmentsCount());
    });
    this.hotThreadsAddId_ = goog.events.listen(manager, org.bigdesk.store.event.EventType.HOT_THREADS_ADD, function(t) {
//        console.log('hot threads', t.getData(),  manager.getHotThreadsCount());
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

    var storeParts = [
        {name:'Nodes Info',     id:'nodeInfo'},
        {name:'Nodes Stats',    id:'nodeStats'},
        {name:'Cluster State',  id:'clusterState'},
        {name:'Cluster Health', id:'clusterSegments'},
        {name:'Index Segments', id:'indexSegments'},
        {name:'Hot Threads',    id:'notThreads'}
    ];

    var margin = {top: 10, right: 20, bottom: 30, left: 20},
        width = 560 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .domain([0, 100])
        .range([0, width])
        .nice();

    var y = d3.scale.ordinal()
        .domain(d3.range(storeParts.length))
        .rangeRoundBands([0, height], .2);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var svg = d3.select(this.element_).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.selectAll(".storePart")
        .data(storeParts)
      .enter().append("rect")
        .attr("class", "storePart" )
        .attr("id", function(d) { return d.id; } )
        .attr("x", function() { return 0; })
        .attr("y", function(d, i) { return y(i); })
        .attr("width", function() { return width; })
        .attr("height", y.rangeBand());

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + 0 + "," + height + ")")
        .call(xAxis);

    var parts = {};
    svg.selectAll('.storePart').datum(function(){parts[this.id]=this});
    console.log(parts);
};
