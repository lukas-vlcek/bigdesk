var SelectedClusterNodeView = Backbone.View.extend({

    el: "#selectedClusterNode",

//    initialize: function() {
//        console.log("initialize",this);
//    },

    nodeId: function() {
        return this.options.nodeId;
    },

    render: function() {

        // Input is an array of objects having two properties: timestamp and value.
        // It update both properties timestamp and value and removes the first item.
        var normalizedDeltaToSeconds = function(items) {
            for (var i=(items.length - 1); i > 0 ; i--) {
                // delta value
                items[i].value -= items[i-1].value;
                // normalize value to seconds
                items[i].value = items[i].value / (
                    ( items[i].timestamp - items[i-1].timestamp ) <= 1000 ? 1 :
                        ( items[i].timestamp - items[i-1].timestamp ) / 1000
                    );
                // avg timestamp
                items[i].timestamp = Math.round( ( items[i].timestamp + items[i].timestamp ) / 2 );
            }
            items.shift();
        };

        var _view = this;
        var nodeInfoModel = this.model.get("nodeInfo");

        // TODO: this fetch needs to be able to output to custom log!
        nodeInfoModel.fetch({

            nodeId: this.options.nodeId,
            success: function(model, response) {

                var selectedNodeInfo = response;
                var selectedNodeId = _view.options.nodeId;
                console.log("node info", selectedNodeInfo);

                _view.renderNodeDetail(model);

                // Create all charts

                var chart_fileDescriptors = timeSeriesChart()
                    .width(270).height(160)
                    .legend({
                        caption: "File Descriptors",
                        series1: "Open",
                        series2: "Max",
                        margin_left: 5,
                        margin_bottom: 6,
                        width: 60})
                    .svg(d3.select("#svg_fileDescriptors"));

                var chart_channels = timeSeriesChart()
                    .width(270).height(160)
                    .legend({
                        caption: "Channels",
                        series1: "HTTP",
                        series2: "Transport",
                        margin_left: 5,
                        margin_bottom: 6,
                        width: 80})
                    .svg(d3.select("#svg_channels"));

                var chart_jvmThreads = timeSeriesChart()
                    .width(270).height(160)
                    .legend({
                        caption: "Threads",
                        series1: "Count",
                        series2: "Peak",
                        margin_left: 5,
                        margin_bottom: 6,
                        width: 60})
                    .svg(d3.select("#svg_jvmThreads"));

                var chart_jvmHeapMem = timeAreaChart()
                    .width(270).height(160)
                    .legend({
                        caption: "Heap Mem",
                        series1: "Used",
                        series2: "Committed",
                        margin_left: 5,
                        margin_bottom: 6,
                        width: 85})
                    .svg(d3.select("#svg_jvmHeapMem"));

                var chart_jvmNonHeapMem = timeAreaChart()
                    .width(270).height(160)
                    .legend({
                        caption: "Non-Heap Mem",
                        series1: "Used",
                        series2: "Committed",
                        margin_left: 5,
                        margin_bottom: 6,
                        width: 85})
                    .svg(d3.select("#svg_jvmNonHeapMem"));

                var chart_jvmGC = timeSeriesChart()
                    .width(270).height(160)
                    .legend({
                        caption: "GC (delta)",
                        series1: "Count",
                        series2: "Time (sec)",
                        margin_left: 5,
                        margin_bottom: 6,
                        width: 85})
                    .svg(d3.select("#svg_jvmGC"));

                var chart_osCpu = timeAreaChart()
                    .width(270).height(160)
                    .legend({
                        caption: "CPU (%)",
                        series1: "Sys",
                        series2: "User",
                        margin_left: 5,
                        margin_bottom: 6,
                        width: 55})
                    .svg(d3.select("#svg_osCpu"));

                var chart_osMem = timeAreaChart()
                    .width(270).height(160)
                    .legend({
                        caption: "Mem",
                        series1: "Used",
                        series2: "Free",
                        margin_left: 5,
                        margin_bottom: 6,
                        width: 55})
                    .svg(d3.select("#svg_osMem"));

                var chart_osSwap = timeAreaChart()
                    .width(270).height(160)
                    .legend({
                        caption: "Swap",
                        series1: "Used",
                        series2: "Free",
                        margin_left: 5,
                        margin_bottom: 6,
                        width: 55})
                    .svg(d3.select("#svg_osSwap"));

                var chart_osLoadAvg = timeSeriesChart()
                    .width(270).height(160)
                    .legend({
                        caption: "Load Average",
                        series1: "0",
                        series2: "1",
                        series3: "2",
                        margin_left: 5,
                        margin_bottom: 6,
                        width: 40})
                    .svg(d3.select("#svg_osLoadAvg"));

                var chart_indicesSearchReqs = timeSeriesChart()
                    .width(270).height(160)
                    .legend({
                        caption: "Search requests per second",
                        series1: "Fetch",
                        series2: "Query",
                        margin_left: 5,
                        margin_bottom: 6,
                        width: 60})
                    .svg(d3.select("#svg_indicesSearchReqs"));

                var chart_indicesSearchTime = timeSeriesChart()
                    .width(270).height(160)
                    .legend({
                        caption: "Search time per second",
                        series1: "Fetch",
                        series2: "Query",
                        margin_left: 5,
                        margin_bottom: 6,
                        width: 60})
                    .svg(d3.select("#svg_indicesSearchTime"));

                var chart_indicesGetReqs = timeSeriesChart()
                    .width(270).height(160)
                    .legend({
                        caption: "Get requests per second",
                        series1: "Missing",
                        series2: "Exists",
                        series3: "Get",
                        margin_left: 5,
                        margin_bottom: 6,
                        width: 65})
                    .svg(d3.select("#svg_indicesGetReqs"));

                var chart_indicesGetTime = timeSeriesChart()
                    .width(270).height(160)
                    .legend({
                        caption: "Get time per second",
                        series1: "Missing",
                        series2: "Exists",
                        series3: "Get",
                        margin_left: 5,
                        margin_bottom: 6,
                        width: 65})
                    .svg(d3.select("#svg_indicesGetTime"));

                var chart_indicesIndexingReqs = timeSeriesChart()
                    .width(270).height(160)
                    .legend({
                        caption: "Indexing requests per second",
                        series1: "Index",
                        series2: "Delete",
                        margin_left: 5,
                        margin_bottom: 6,
                        width: 65})
                    .svg(d3.select("#svg_indicesIndexingReqs"));

                var chart_indicesIndexingTime = timeSeriesChart()
                    .width(270).height(160)
                    .legend({
                        caption: "Indexing time per second",
                        series1: "Index",
                        series2: "Delete",
                        margin_left: 5,
                        margin_bottom: 6,
                        width: 65})
                    .svg(d3.select("#svg_indicesIndexingTime"));

                var chart_processCPU_time = timeSeriesChart()
                    .width(270).height(160)
                    .legend({
                        caption: "CPU time",
                        series1: "User",
                        series2: "Sys",
                        margin_left: 5,
                        margin_bottom: 6,
                        width: 45})
                    .svg(d3.select("#svg_processCPU_time"));

                var chart_processCPU_pct = timeAreaChart()
                    .width(270).height(160)
                    .legend({
                        caption: "CPU (%)",
                        series1: "process",
                        series2: ( +selectedNodeInfo.nodes[selectedNodeId].os.cpu.total_cores * 100 )+ "%",
                        margin_left: 5,
                        margin_bottom: 6,
                        width: 65})
                    .svg(d3.select("#svg_processCPU_pct"));

                var chart_processMem = timeAreaChart()
                    .width(270).height(160)
                    .legend({
                        caption: "Mem",
                        series1: "share",
                        series2: "resident",
                        series3: "total virtual",
                        margin_left: 5,
                        margin_bottom: 6,
                        width: 100})
                    .svg(d3.select("#svg_processMem"));

                var chart_transport_txrx = timeSeriesChart()
                    .width(270).height(160)
                    .legend({
                        caption: "Transport size",
                        series1: "Tx",
                        series2: "Rx",
                        margin_left: 5,
                        margin_bottom: 6,
                        width: 40})
                    .svg(d3.select("#svg_transport_txrx"));

                var nodesStatsCollection = _view.model.get("nodesStats");

                // function to update all charts
                var updateCharts = function() {

                    // get stats for selected node
                    var stats = nodesStatsCollection.map(function(snapshot){
                        if (snapshot.get("nodes").get(_view.nodeId()))
                        return {
                            id: snapshot.id, // this is timestamp
                            node: snapshot.get("nodes").get(_view.nodeId()).toJSON()
                        }
                    });

                    stats = _.filter(stats, function(item){ return (item!=undefined)});

                    var stats_the_latest = stats[stats.length - 1];
//                    console.log("the latest stats snapshot", stats_the_latest);

                    // --------------------------------------------
                    // Channels

                    var opened_transport_server_channels = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.id,
                            value: +snapshot.node.transport.server_open
                        }
                    });
                    var theLatestTotalOpened = stats[stats.length-1].node.http.total_opened;
                    var opened_http_channels = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.id,
                            value: +snapshot.node.http.current_open
                        }
                    });
                    chart_channels.update(opened_http_channels, opened_transport_server_channels);

                    if (opened_http_channels.length > 0) {
                        $("#open_http_channels").text(opened_http_channels[opened_http_channels.length-1].value);
                    }
                    if (opened_transport_server_channels.length > 0) {
                        $("#open_transport_channels").text(opened_transport_server_channels[opened_transport_server_channels.length-1].value);
                    }
                    if (theLatestTotalOpened) {
                        $("#total_opened_http_channels").text(theLatestTotalOpened);
                    }

                    // --------------------------------------------
                    // JVM Info

                    if (stats_the_latest && stats_the_latest.node) {
                        $("#jvm_uptime").text(stats_the_latest.node.jvm.uptime);
                    } else {
                        $("#jvm_uptime").text("n/a");
                    }

                    // --------------------------------------------
                    // JVM Threads

                    var jvm_threads_count = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.node.jvm.timestamp,
                            value: +snapshot.node.jvm.threads.count
                        }
                    });
                    var jvm_threads_peak_count = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.node.jvm.timestamp,
                            value: +snapshot.node.jvm.threads.peak_count
                        }
                    });
                    chart_jvmThreads.update(jvm_threads_count, jvm_threads_peak_count);

                    // --------------------------------------------
                    // JVM GC

                    var jvm_gc_collection_count_delta = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.node.jvm.timestamp,
                            value: +snapshot.node.jvm.gc.collection_count
                        }
                    });
                    var jvm_gc_collection_time_delta = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.node.jvm.timestamp,
                            value: +snapshot.node.jvm.gc.collection_time_in_millis / 1000
                        }
                    });
                    if (jvm_gc_collection_count_delta.length > 1 && jvm_gc_collection_time_delta.length > 1) {

                        for (var i=(jvm_gc_collection_count_delta.length - 1); i > 0 ; i--) {
                            jvm_gc_collection_count_delta[i].value -= jvm_gc_collection_count_delta[i-1].value;
                        }
                        jvm_gc_collection_count_delta.shift();

                        for (var i=(jvm_gc_collection_time_delta.length - 1); i > 0 ; i--) {
                            jvm_gc_collection_time_delta[i].value -= jvm_gc_collection_time_delta[i-1].value;
                        }
                        jvm_gc_collection_time_delta.shift();

                        chart_jvmGC.update(jvm_gc_collection_count_delta, jvm_gc_collection_time_delta);
                    }

                    // --------------------------------------------
                    // JVM Heap Mem

                    var jvm_heap_used_mem= stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.node.jvm.timestamp,
                            value: +snapshot.node.jvm.mem.heap_used_in_bytes
                        }
                    });
                    var jvm_heap_committed_mem= stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.node.jvm.timestamp,
                            value: +snapshot.node.jvm.mem.heap_committed_in_bytes
                        }
                    });
                    chart_jvmHeapMem.update(jvm_heap_used_mem, jvm_heap_committed_mem);

                    // --------------------------------------------
                    // JVM Non Heap Mem

                    var jvm_non_heap_used_mem= stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.node.jvm.timestamp,
                            value: +snapshot.node.jvm.mem.non_heap_used_in_bytes
                        }
                    });
                    var jvm_non_heap_committed_mem= stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.node.jvm.timestamp,
                            value: +snapshot.node.jvm.mem.non_heap_committed_in_bytes
                        }
                    });
                    chart_jvmNonHeapMem.update(jvm_non_heap_used_mem, jvm_non_heap_committed_mem);


                    // --------------------------------------------
                    // OS Info

                    if (stats_the_latest && stats_the_latest.node) {
                        $("#os_uptime").text(stats_the_latest.node.os.uptime);
                    } else {
                        $("#os_uptime").text("n/a");
                    }

                    // --------------------------------------------
                    // OS CPU

                    var os_cpu_sys = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.node.os.timestamp,
                            value: +snapshot.node.os.cpu.sys
                        }
                    });
                    var os_cpu_user = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.node.os.timestamp,
                            value: (+snapshot.node.os.cpu.user + +snapshot.node.os.cpu.sys)
                        }
                    });
                    var os_cpu_idle = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.node.os.timestamp,
                            value: 100
                        }
                    });
                    chart_osCpu.update(os_cpu_sys, os_cpu_user, os_cpu_idle);

                    if (stats_the_latest && stats_the_latest.node) {
                        $("#os_cpu_user").text(stats_the_latest.node.os.cpu.user);
                        $("#os_cpu_sys").text(stats_the_latest.node.os.cpu.sys);
                    } else {
                        $("#os_cpu_user").text("n/a");
                        $("#os_cpu_sys").text("n/a");
                    }

                    // --------------------------------------------
                    // OS Mem

                    var os_mem_actual_used = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.node.os.timestamp,
                            value: +snapshot.node.os.mem.actual_used_in_bytes
                        }
                    });
                    var os_mem_actual_free = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.node.os.timestamp,
                            value: ((+snapshot.node.os.mem.actual_free_in_bytes) + (+snapshot.node.os.mem.actual_used_in_bytes))
                        }
                    });
                    chart_osMem.update(os_mem_actual_used, os_mem_actual_free);

                    if (stats_the_latest && stats_the_latest.node) {
                        $("#os_mem_free").text(stats_the_latest.node.os.mem.actual_free);
                        $("#os_mem_used").text(stats_the_latest.node.os.mem.actual_used);
                    } else {
                        $("#os_mem_free").text("n/a");
                        $("#os_mem_used").text("n/a");
                    }

                    // --------------------------------------------
                    // OS swap

                    var os_swap_free = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.node.os.timestamp,
                            value: +snapshot.node.os.swap.free_in_bytes
                        }
                    });
                    var os_swap_used = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.node.os.timestamp,
                            value:
                                // https://github.com/elasticsearch/elasticsearch/issues/1804
                                stats_the_latest.node.os.swap.used_in_bytes == undefined ? 0 :
                                    +stats_the_latest.node.os.swap.used_in_bytes
                        }
                    });
                    chart_osSwap.update(os_swap_used, os_swap_free);

                    if (stats_the_latest && stats_the_latest.node) {
                        $("#os_swap_free").text(stats_the_latest.node.os.swap.free);
                        $("#os_swap_used").text(
                            // https://github.com/elasticsearch/elasticsearch/issues/1804
                            stats_the_latest.node.os.swap.used == undefined ? "n/a" :
                            stats_the_latest.node.os.swap.used
                        );
                    } else {
                        $("#os_swap_free").text("n/a");
                        $("#os_swap_used").text("n/a");
                    }

                    // --------------------------------------------
                    // OS load average

                    var os_loadAvg_0 = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.node.os.timestamp,
                            value: + snapshot.node.os.load_average["0"]
                        }
                    });
                    var os_loadAvg_1 = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.node.os.timestamp,
                            value: + snapshot.node.os.load_average["1"]
                        }
                    });
                    var os_loadAvg_2 = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.node.os.timestamp,
                            value: + snapshot.node.os.load_average["2"]
                        }
                    });
                    chart_osLoadAvg.update(os_loadAvg_0, os_loadAvg_1, os_loadAvg_2);

                    if (stats_the_latest && stats_the_latest.node) {
                        $("#os_load_0").text(stats_the_latest.node.os.load_average["0"]);
                        $("#os_load_1").text(stats_the_latest.node.os.load_average["1"]);
                        $("#os_load_2").text(stats_the_latest.node.os.load_average["2"]);
                    } else {
                        $("#os_load_0").text("n/a");
                        $("#os_load_1").text("n/a");
                        $("#os_load_2").text("n/a");
                    }

                    // --------------------------------------------
                    // Indices

                    if (stats_the_latest && stats_the_latest.node) {
                        $("#indices_docs_count").text(stats_the_latest.node.indices.docs.count);
                        $("#indices_docs_deleted").text(stats_the_latest.node.indices.docs.deleted);
                        $("#indices_store_size").text(stats_the_latest.node.indices.store.size);
                        $("#indices_flush_total").text(stats_the_latest.node.indices.flush.total + ", " + stats_the_latest.node.indices.flush.total_time);
                        $("#indices_refresh_total").text(stats_the_latest.node.indices.refresh.total + ", " + stats_the_latest.node.indices.refresh.total_time);
                    } else {
                        $("#indices_docs_count").text("n/a");
                        $("#indices_docs_deleted").text("n/a");
                        $("#indices_store_size").text("n/a");
                        $("#indices_flush_total").text("n/a");
                        $("#indices_refresh_total").text("n/a");
                    }

                    // --------------------------------------------
                    // Indices: search requests

                    var indices_fetch_reqs = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.id,
                            value: +snapshot.node.indices.search.fetch_total
                        }
                    });
                    var indices_query_reqs = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.id,
                            value: +snapshot.node.indices.search.query_total
                        }
                    });
                    if (indices_fetch_reqs.length > 1 && indices_query_reqs.length > 1) {

                        normalizedDeltaToSeconds(indices_fetch_reqs);
                        normalizedDeltaToSeconds(indices_query_reqs);

                        chart_indicesSearchReqs.update(indices_fetch_reqs, indices_query_reqs);
                    }

                    // --------------------------------------------
                    // Indices: search time

                    var indices_fetch_time = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.id,
                            value: +snapshot.node.indices.search.fetch_time_in_millis
                        }
                    });
                    var indices_query_time = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.id,
                            value: +snapshot.node.indices.search.query_time_in_millis
                        }
                    });

                    if (indices_fetch_time.length > 1 && indices_query_time.length > 1) {

                        normalizedDeltaToSeconds(indices_fetch_time);
                        normalizedDeltaToSeconds(indices_query_time);

                        chart_indicesSearchTime.update(indices_fetch_time, indices_query_time);
                    }

                    // --------------------------------------------
                    // Indices: get requests

                    var indices_get_reqs = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.id,
                            value: +snapshot.node.indices.get.total
                        }
                    });
                    var indices_missing_reqs = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.id,
                            value: +snapshot.node.indices.get.missing_total
                        }
                    });
                    var indices_exists_reqs = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.id,
                            value: +snapshot.node.indices.get.exists_total
                        }
                    });

                    if (indices_get_reqs.length > 1 && indices_missing_reqs.length > 1 && indices_exists_reqs.length > 1) {

                        normalizedDeltaToSeconds(indices_get_reqs);
                        normalizedDeltaToSeconds(indices_missing_reqs);
                        normalizedDeltaToSeconds(indices_exists_reqs);

                        chart_indicesGetReqs.update(indices_get_reqs, indices_missing_reqs, indices_exists_reqs);
                    }

                    // --------------------------------------------
                    // Indices: get time

                    var indices_get_time = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.id,
                            value: +snapshot.node.indices.get.time_in_millis
                        }
                    });
                    var indices_missing_time = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.id,
                            value: +snapshot.node.indices.get.missing_time_in_millis
                        }
                    });
                    var indices_exists_time = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.id,
                            value: +snapshot.node.indices.get.exists_time_in_millis
                        }
                    });

                    if (indices_get_time.length > 1 && indices_missing_time.length > 1 && indices_exists_time.length > 1) {

                        normalizedDeltaToSeconds(indices_get_time);
                        normalizedDeltaToSeconds(indices_missing_time);
                        normalizedDeltaToSeconds(indices_exists_time);

                        chart_indicesGetTime.update(indices_get_time, indices_missing_time, indices_exists_time);
                    }

                    // --------------------------------------------
                    // Indices: indexing requests

                    var indices_indexing_index_reqs = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.id,
                            value: +snapshot.node.indices.indexing.index_total
                        }
                    });
                    var indices_indexing_delete_reqs = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.id,
                            value: +snapshot.node.indices.indexing.delete_total
                        }
                    });

                    if (indices_indexing_index_reqs.length > 1 && indices_indexing_delete_reqs.length > 1) {

                        normalizedDeltaToSeconds(indices_indexing_index_reqs);
                        normalizedDeltaToSeconds(indices_indexing_delete_reqs);

                        chart_indicesIndexingReqs.update(indices_indexing_index_reqs, indices_indexing_delete_reqs);
                    }

                    // --------------------------------------------
                    // Indices: indexing time

                    var indices_indexing_index_time = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.id,
                            value: +snapshot.node.indices.indexing.index_time_in_millis
                        }
                    });
                    var indices_indexing_delete_time = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.id,
                            value: +snapshot.node.indices.indexing.delete_time_in_millis
                        }
                    });

                    if (indices_indexing_index_time.length > 1 && indices_indexing_delete_time.length > 1) {

                        normalizedDeltaToSeconds(indices_indexing_index_time);
                        normalizedDeltaToSeconds(indices_indexing_delete_time);

                        chart_indicesIndexingTime.update(indices_indexing_index_time, indices_indexing_delete_time);
                    }

                    // --------------------------------------------
                    // Process: CPU time (in millis)

                    var process_cpu_time_sys_delta = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.node.process.timestamp,
                            value: +snapshot.node.process.cpu.sys_in_millis
                        }
                    });
                    var process_cpu_time_user_delta = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.node.process.timestamp,
                            value: +snapshot.node.process.cpu.user_in_millis
                        }
                    });
                    if (process_cpu_time_sys_delta.length > 1 && process_cpu_time_user_delta.length > 1) {

                        for (var i=(process_cpu_time_sys_delta.length - 1); i > 0 ; i--) {
                            process_cpu_time_sys_delta[i].value -= process_cpu_time_sys_delta[i-1].value;
                        }
                        process_cpu_time_sys_delta.shift();

                        for (var i=(process_cpu_time_user_delta.length - 1); i > 0 ; i--) {
                            process_cpu_time_user_delta[i].value -= process_cpu_time_user_delta[i-1].value;
                        }
                        process_cpu_time_user_delta.shift();

                        chart_processCPU_time.update(process_cpu_time_user_delta, process_cpu_time_sys_delta);
                    }

                    if (stats_the_latest && stats_the_latest.node) {
                        $("#process_cpu_time_sys").text(stats_the_latest.node.process.cpu.sys_in_millis + "ms");
                        $("#process_cpu_time_user").text(stats_the_latest.node.process.cpu.user_in_millis + "ms");
                    } else {
                        $("#process_cpu_time_sys").text("n/a");
                        $("#process_cpu_time_user").text("n/a");
                    }

                    // --------------------------------------------
                    // Process: file descriptors

                    var open_file_descriptors = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.node.process.timestamp,
                            value: +snapshot.node.process.open_file_descriptors
                        }
                    });
                    var max_file_descriptors = open_file_descriptors.slice(0).map(function(snapshot){
                        return {
                            timestamp: +snapshot.timestamp,
                            value: +selectedNodeInfo.nodes[selectedNodeId].process.max_file_descriptors
                        }
                    });
                    chart_fileDescriptors.update(open_file_descriptors, max_file_descriptors);

                    if (open_file_descriptors.length > 0) {
                        $("#open_file_descriptors").text(open_file_descriptors[open_file_descriptors.length-1].value);
                    }

                    // --------------------------------------------
                    // Process: CPU percentage

                    var process_cpu_pct = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.node.process.timestamp,
                            value: +snapshot.node.process.cpu.percent
                        }
                    });
                    var _total_cores = selectedNodeInfo.nodes[selectedNodeId].os.cpu.total_cores;
                    var process_cpu_max = process_cpu_pct.map(function(item){
                        return {
                            timestamp: item.timestamp,
                            value: ( 100 * _total_cores )
                        }
                    });
                    chart_processCPU_pct.update(process_cpu_pct, process_cpu_max);

                    if (stats_the_latest && stats_the_latest.node) {
                        $("#process_cpu_pct_total").text((_total_cores * 100) + "%");
                        $("#process_cpu_pct_process").text(stats_the_latest.node.process.cpu.percent);
                    } else {
                        $("#process_cpu_pct_total").text("n/a");
                        $("#process_cpu_pct_process").text("n/a");
                    }

                    // --------------------------------------------
                    // Process: Mem

                    var process_mem_share = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.node.process.timestamp,
                            value: +snapshot.node.process.mem.share_in_bytes
                        }
                    });
                    var process_mem_resident = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.node.process.timestamp,
                            value: +snapshot.node.process.mem.resident_in_bytes
                        }
                    });
                    var process_mem_total_virtual = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.node.process.timestamp,
                            value: +snapshot.node.process.mem.total_virtual_in_bytes
                        }
                    });
                    chart_processMem.update(process_mem_share, process_mem_resident, process_mem_total_virtual);

                    if (stats_the_latest && stats_the_latest.node) {
                        $("#process_mem_total_virtual").text(stats_the_latest.node.process.mem.total_virtual);
                        $("#process_mem_resident").text(stats_the_latest.node.process.mem.resident);
                        $("#process_mem_share").text(stats_the_latest.node.process.mem.share);
                    } else {
                        $("#process_mem_total_virtual").text("n/a");
                        $("#process_mem_resident").text("n/a");
                        $("#process_mem_share").text("n/a");
                    }

                    // --------------------------------------------
                    // Transport: txrx

                    var transport_tx_delta = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.id,
                            value: +snapshot.node.transport.tx_size_in_bytes
                        }
                    });
                    var transport_rx_delta = stats.map(function(snapshot){
                        return {
                            timestamp: +snapshot.id,
                            value: +snapshot.node.transport.rx_size_in_bytes
                        }
                    });
                    if (transport_tx_delta.length > 1 && transport_rx_delta.length > 1) {

                        for (var i=(transport_tx_delta.length - 1); i > 0 ; i--) {
                            transport_tx_delta[i].value -= transport_tx_delta[i-1].value;
                        }
                        transport_tx_delta.shift();

                        for (var i=(transport_rx_delta.length - 1); i > 0 ; i--) {
                            transport_rx_delta[i].value -= transport_rx_delta[i-1].value;
                        }
                        transport_rx_delta.shift();

                        chart_transport_txrx.update(transport_tx_delta, transport_rx_delta);
                    }


                };

                // add custom listener for the collection to update UI and charts on changes
                nodesStatsCollection.on("nodesStatsUpdated", function(){
                    updateCharts();
                });

                // update charts right now, do not wait for the nearest execution
                // of update interval to show the charts to the user
                updateCharts();
            }
        });
    },

    selectedNodeInfoTemplate: [
        "<h2>Selected node:</h2>" +
            "Name: {{name}}",
        "ID: \"{{id}}\"",
        "Hostname: {{hostname}}"
    ].join("<br>"),

    selectedNodeHTTPTemplate: [
        "HTTP address: {{http_address}}",
        "",
        "Bound address: {{http.bound_address}}",
        "",
        "Publish address: {{http.publish_address}}"
    ].join("<br>"),

    selectedNodeTransportTemplate: [
        "Transport address: {{transport_address}}",
        "",
        "Bound address: {{transport.bound_address}}",
        "",
        "Publish address: {{transport.publish_address}}"
    ].join("<br>"),

    fileDescriptorsTemplate: [
        "<div>Max: {{process.max_file_descriptors}}</div>",
        "<div>Open: <span id='open_file_descriptors'>n/a</span></div>"
//        "<div>Refresh interval: {{process.refresh_interval}}ms</div>"
    ].join(""),

    process_MemTemplate: [
        "<div>Total virtual: <span id='process_mem_total_virtual'>n/a</span></div>",
        "<div>Resident: <span id='process_mem_resident'>n/a</span></div>",
        "<div>Share: <span id='process_mem_share'>n/a</span></div>"
    ].join(""),

    process_CPU_timeTemplate: [
        "<div>Sys: <span id='process_cpu_time_sys'>n/a</span></div>",
        "<div>User: <span id='process_cpu_time_user'>n/a</span></div>"
    ].join(""),

    process_CPU_pctTemplate: [
        "<div>Total: <span id='process_cpu_pct_total'>n/a</span></div>",
        "<div>Process: <span id='process_cpu_pct_process'>n/a</span></div>"
    ].join(""),

    osCpu: [
        "<div>Total: 100%</div>",
        "<div>User: <span id='os_cpu_user'>n/a</span></div>",
        "<div>Sys: <span id='os_cpu_sys'>n/a</span></div>"
    ].join(""),

    osMem: [
        "<div>Free: <span id='os_mem_free'>n/a</span></div>",
        "<div>Used: <span id='os_mem_used'>n/a</span></div>"
    ].join(""),

    osSwap: [
        "<div>Free: <span id='os_swap_free'>n/a</span></div>",
        "<div>Used: <span id='os_swap_used'>n/a</span></div>"
    ].join(""),

    osLoad: [
        "<div>2: <span id='os_load_2'>n/a</span></div>",
        "<div>1: <span id='os_load_1'>n/a</span></div>",
        "<div>0: <span id='os_load_0'>n/a</span></div>"
    ].join(""),

    channelsTemplate: [
        "<div>Transport: <span id='open_transport_channels'>na</span></div>",
        "<div>HTTP: <span id='open_http_channels'>na</span></div>",
        "<div>HTTP total opened: <span id='total_opened_http_channels'>na</span></div>"
    ].join(""),

    TDBTemplate: [
        "<svg width='100%' height='90'>" +
            "<rect x='0' y='0' width='100%' height='100%' fill='#eee' stroke-width='1' />" +
        "</svg>"
    ].join(""),

    jvmInfoTemplate1: [
        "VM name: {{vm_name}}",
        "VM vendor: {{vm_vendor}}",
        "VM version: {{vm_version}}"
    ].join("<br>"),

    jvmInfoTemplate2: [
        "Uptime: <span id='jvm_uptime'>n/a</span>",
        "Java version: {{version}}",
        "PID: {{pid}}"
    ].join("<br>"),

    osInfoTemplate1: [
        "CPU vendor: {{cpu.vendor}}",
        "CPU model: {{cpu.model}} ({{cpu.mhz}} MHz)",
        "CPU total cores: {{cpu.total_cores}}",
        "CPU sockets: {{cpu.total_sockets}} with {{cpu.cores_per_socket}} cores each",
        "CPU cache: {{cpu.cache_size}}"
    ].join("<br>"),

    osInfoTemplate2: [
        "Uptime: <span id='os_uptime'>n/a</span>",
        "Refresh interval: {{refresh_interval}}ms",
        "Total mem: {{mem.total}} ({{mem.total_in_bytes}}&nbsp;b)",
        "Total swap: {{swap.total}} ({{swap.total_in_bytes}}&nbsp;b)"
    ].join("<br>"),

    indices1Template: [
        "Size: <span id='indices_store_size'>n/a</span>",
        "Docs count: <span id='indices_docs_count'>n/a</span>",
        "Docs deleted: <span id='indices_docs_deleted'>n/a</span>",
        "Flush: <span id='indices_flush_total'>n/a</span>",
        "Refresh: <span id='indices_refresh_total'>n/a</span>"
    ].join("<br>"),

//    jvmMemPoolTemplate: [
//        "<svg id='{{pool_id}}'></svg>",
//        "max: <span>n/a</span>",
//        "used: <span>n/a</span>"
//    ].join("<br>"),

    renderNodeDetail: function(model) {

        // NODE info row

        var jsonModel = model.toJSON();

        var selectedNodeInfo = Mustache.render(this.selectedNodeInfoTemplate, jsonModel);

        var p1 = this.make("p", {}, selectedNodeInfo);
        var col1 = this.make("div", {"class":"twelvecol last"});
        var rowSelectedNode = this.make("div", {"class":"row nodeDetail"});

        $(rowSelectedNode).append(col1);
        $(col1).append(p1);

        // HTTP & Transport Title

        var transportTitleP = this.make("p", {}, "<h2>HTTP & Transport</h2>");
        var transportTitleCol = this.make("div", {"class":"twelvecol last"});
        var rowTransportTitle = this.make("div", {"class":"row nodeDetail newSection"});

        $(rowTransportTitle).append(transportTitleCol);
        $(transportTitleCol).append(transportTitleP);

        // HTTP & Transport

        var channels = Mustache.render(this.channelsTemplate, {});
        var selectedNodeHTTP = Mustache.render(this.selectedNodeHTTPTemplate, jsonModel);
        var selectedNodeTransport = Mustache.render(this.selectedNodeTransportTemplate, jsonModel);
//        var _tbd = Mustache.render(this.TDBTemplate, {});

        var desp1 = this.make("p", {}, selectedNodeHTTP);
        var desp2 = this.make("p", {}, selectedNodeTransport);
        var desp3 = this.make("p", {},
            "<div style='overflow: auto;'>" +
                "<svg width='100%' height='160'>" +
                    "<svg id='svg_channels' clip_id='clip_channels' width='46.5%' height='100%' x='0' y='0' preserveAspectRatio='xMinYMin' viewBox='0 0 250 160'/>" +
                    "<svg id='svg_transport_txrx' clip_id='clip_transport_txrx' width='46.5%' height='100%' x='54%' y='0' preserveAspectRatio='xMinYMin' viewBox='0 0 250 160'/>" +
                "</svg>" +
                "<div width='46.5%' style='margin-left: 0%; float: left;'>"+channels+"</div>" +
                "<div width='46.5%' style='margin-left: 54%;'></div>" +
            "</div>"
        );

        var desCol1 = this.make("div", {"class":"threecol"});
        var desCol2 = this.make("div", {"class":"threecol"});
        var desCol3 = this.make("div", {"class":"sixcol last"});

        var rowTransportCharts = this.make("div", {"class":"row nodeDetail"});
        $(rowTransportCharts).append(desCol1, desCol2, desCol3);
        $(desCol1).append(desp1);
        $(desCol2).append(desp2);
        $(desCol3).append(desp3);

        // JVM title

        var jvmTitleP = this.make("p", {}, "<h2>JVM</h2>");
        var jvmTitleCol = this.make("div", {"class":"twelvecol last"});
        var rowJvmTitle = this.make("div", {"class":"row nodeDetail newSection"});

        $(rowJvmTitle).append(jvmTitleCol);
        $(jvmTitleCol).append(jvmTitleP);

        // JVM detail row

        var jvmInfo1 = Mustache.render(this.jvmInfoTemplate1, jsonModel.jvm);
        var jvmInfo2 = Mustache.render(this.jvmInfoTemplate2, jsonModel.jvm);

        var jvmp1 = this.make("p", {}, jvmInfo1);
        var jvmp2 = this.make("p", {}, jvmInfo2);

        var jvmCol1 = this.make("div", {"class":"fourcol"});
        var jvmCol2 = this.make("div", {"class":"eightcol last"});

        var rowJvm = this.make("div", {"class":"row nodeDetail", "id":"jvmInfo"});

        $(rowJvm).append(jvmCol1, jvmCol2);
        $(jvmCol1).append(jvmp1);
        $(jvmCol2).append(jvmp2);

        // JVM row for charts
        var jvmpCharts1 = this.make("div", {},
            "<svg width='100%' height='160'>" +
                "<svg id='svg_jvmHeapMem' clip_id='clip_jvmHeapMem' width='46.5%' height='100%' x='0' y='0' preserveAspectRatio='xMinYMin' viewBox='0 0 250 160'/>" +
                "<svg id='svg_jvmNonHeapMem' clip_id='clip_jvmNonHeapMem' width='46.5%' height='100%' x='54%' y='0' preserveAspectRatio='xMinYMin' viewBox='0 0 250 160'/>" +
            "</svg>"
        );
        var jvmpCharts2 = this.make("div", {},
            "<svg width='100%' height='160'>" +
                "<svg id='svg_jvmThreads' clip_id='clip_jvmThreads' width='46.5%' height='100%' x='0' y='0' preserveAspectRatio='xMinYMin' viewBox='0 0 250 160'/>" +
                "<svg id='svg_jvmGC' clip_id='clip_jvmGC' width='46.5%' height='100%' x='54%' y='0' preserveAspectRatio='xMinYMin' viewBox='0 0 250 160'/>" +
            "</svg>"
        );

        var jvmColCharts1 = this.make("div", {"class":"sixcol"});
        var jvmColCharts2 = this.make("div", {"class":"sixcol last"});

        var rowJvmCharts = this.make("div", {"class":"row nodeDetail"});

        $(rowJvmCharts).append(jvmColCharts1, jvmColCharts2);
        $(jvmColCharts1).append(jvmpCharts1);
        $(jvmColCharts2).append(jvmpCharts2);

        // JVM Mem Pools

//        var jvmMemPool_CMS_Old_Gen = Mustache.render(this.jvmMemPoolTemplate, { pool_id: "CMS Old Gen" });
//
//        console.log(jsonModel);
//        console.log(jvmMemPool_CMS_Old_Gen);
//
//        var jvmPoolp1 = this.make("p", {});
//        var jvmPoolp2 = this.make("p", {});
//        var jvmPoolp3 = this.make("p", {});
//        var jvmPoolp4 = this.make("p", {});
//        var jvmPoolp5 = this.make("p", {});
//        var jvmPoolp6 = this.make("p", {});
//
//        var jvmPoolCol1 = this.make("div", {"class":"twocol"});
//        var jvmPoolCol2 = this.make("div", {"class":"twocol"});
//        var jvmPoolCol3 = this.make("div", {"class":"twocol"});
//        var jvmPoolCol4 = this.make("div", {"class":"twocol"});
//        var jvmPoolCol5 = this.make("div", {"class":"twocol"});
//        var jvmPoolCol6 = this.make("div", {"class":"twocol last"});
//
//        var rowJvmMemPools = this.make("div", {"class":"row nodeDetail"});
//
//        $(rowJvmMemPools).append(jvmPoolCol1,jvmPoolCol2,jvmPoolCol3,jvmPoolCol4,jvmPoolCol5,jvmPoolCol6);
//        $(jvmPoolCol1).append(jvmPoolp1);
//        $(jvmPoolCol2).append(jvmPoolp2);
//        $(jvmPoolCol3).append(jvmPoolp3);
//        $(jvmPoolCol4).append(jvmPoolp4);
//        $(jvmPoolCol5).append(jvmPoolp5);
//        $(jvmPoolCol6).append(jvmPoolp6);

        // OS title

        var osTitleP = this.make("p", {}, "<h2>OS</h2>");
        var osTitleCol = this.make("div", {"class":"twelvecol last"});
        var rowOsTitle = this.make("div", {"class":"row nodeDetail newSection"});

        $(rowOsTitle).append(osTitleCol);
        $(osTitleCol).append(osTitleP);

        // OS detail row

        var osInfo1 = Mustache.render(this.osInfoTemplate1, jsonModel.os);
        var osInfo2 = Mustache.render(this.osInfoTemplate2, jsonModel.os);

        var osp1 = this.make("p", {}, osInfo1);
        var osp2 = this.make("p", {}, osInfo2 );

        var osCol1 = this.make("div", {"class":"fourcol"});
        var osCol2 = this.make("div", {"class":"eightcol last"});

        var rowOS = this.make("div", {"class":"row nodeDetail", "id":"osInfo"});

        $(rowOS).append(osCol1, osCol2);
        $(osCol1).append(osp1);
        $(osCol2).append(osp2);

        // OS row for charts

        var osCpu = Mustache.render(this.osCpu, jsonModel);
        var osMem = Mustache.render(this.osMem, jsonModel);

        var osCharts1 = this.make("p", {},
            "<div style='overflow: auto;'>" +
                "<svg width='100%' height='160'>" +
                    "<svg id='svg_osCpu' clip_id='clip_osCpu' width='46.5%' height='100%' x='0' y='0' preserveAspectRatio='xMinYMin' viewBox='0 0 250 160'/>" +
                    "<svg id='svg_osMem' clip_id='clip_osMem' width='46.5%' height='100%' x='54%' y='0' preserveAspectRatio='xMinYMin' viewBox='0 0 250 160'/>" +
                "</svg>" +
                "<div width='46.5%' style='margin-left: 0%; float: left;'>" + osCpu + "</div>" +
                "<div width='46.5%' style='margin-left: 54%;'>" + osMem + "</div>" +
            "</div>"
        );

        var osSwap = Mustache.render(this.osSwap, jsonModel);
        var osLoad = Mustache.render(this.osLoad, jsonModel);

        var osCharts2 = this.make("p", {},
            "<div style='overflow: auto;'>" +
                "<svg width='100%' height='160'>" +
                    "<svg id='svg_osSwap' clip_id='clip_osSwap' width='46.5%' height='100%' x='0' y='0' preserveAspectRatio='xMinYMin' viewBox='0 0 250 160'/>" +
                    "<svg id='svg_osLoadAvg' clip_id='clip_osLoadAvg' width='46.5%' height='100%' x='54%' y='0' preserveAspectRatio='xMinYMin' viewBox='0 0 250 160'/>" +
                "</svg>" +
                "<div width='46.5%' style='margin-left: 0%; float: left;'>" + osSwap + "</div>" +
                "<div width='46.5%' style='margin-left: 54%;'>" + osLoad + "</div>" +
            "</div>"
        );

        var osColCharts1 = this.make("div", {"class":"sixcol"});
        var osColCharts2 = this.make("div", {"class":"sixcol last"});

        var rowOsCharts = this.make("div", {"class":"row nodeDetail"});

        $(rowOsCharts).append(osColCharts1, osColCharts2);
        $(osColCharts1).append(osCharts1);
        $(osColCharts2).append(osCharts2);

        // Process title

        var processTitleP = this.make("p", {}, "<h2>Process</h2>");
        var processTitleCol = this.make("div", {"class":"twelvecol last"});
        var rowProcessTitle = this.make("div", {"class":"row nodeDetail newSection"});

        $(rowProcessTitle).append(processTitleCol);
        $(processTitleCol).append(processTitleP);

        // Process chart row

        var fileDescriptors = Mustache.render(this.fileDescriptorsTemplate, jsonModel);
        var processMem = Mustache.render(this.process_MemTemplate, jsonModel);

        var processCharts1 = this.make("p", {},
            "<div style='overflow: auto;'>" +
                "<svg width='100%' height='160'>" +
                    "<svg id='svg_fileDescriptors' clip_id='clip_fileDescriptors' width='46.5%' height='100%' x='0' y='0' preserveAspectRatio='xMinYMin' viewBox='0 0 250 160'/>" +
                    "<svg id='svg_processMem' clip_id='clip_processMem' width='46.5%' height='100%' x='54%' y='0' preserveAspectRatio='xMinYMin' viewBox='0 0 250 160'/>" +
                "</svg>" +
                "<div width='46.5%' style='margin-left: 0%; float: left;'>" + fileDescriptors + "</div>" +
                "<div width='46.5%' style='margin-left: 54%;'>" + processMem + "</div>" +
            "</div>"
        );

        var processCPU_time = Mustache.render(this.process_CPU_timeTemplate, jsonModel);
        var processCPU_pct = Mustache.render(this.process_CPU_pctTemplate, jsonModel);

        var processCharts2 = this.make("p", {},
            "<div style='overflow: auto;'>" +
                "<svg width='100%' height='160'>" +
                    "<svg id='svg_processCPU_time' clip_id='clip_processCPU_time' width='46.5%' height='100%' x='0' y='0' preserveAspectRatio='xMinYMin' viewBox='0 0 250 160'/>" +
                    "<svg id='svg_processCPU_pct' clip_id='clip_processCPU_pct' width='46.5%' height='100%' x='54%' y='0' preserveAspectRatio='xMinYMin' viewBox='0 0 250 160'/>" +
                "</svg>" +
                "<div width='46.5%' style='margin-left: 0%; float: left;'>" + processCPU_time + "</div>" +
                "<div width='46.5%' style='margin-left: 54%;'>" + processCPU_pct + "</div>" +
            "</div>"
        );

        var processColCharts1 = this.make("div", {"class":"sixcol"});
        var processColCharts2 = this.make("div", {"class":"sixcol last"});
        var rowProcessCharts = this.make("div", {"class":"row nodeDetail"});

        $(rowProcessCharts).append(processColCharts1, processColCharts2);
        $(processColCharts1).append(processCharts1);
        $(processColCharts2).append(processCharts2);

        // Indices title

        var indicesTitleP = this.make("p", {}, "<h2>Indices</h2>");
        var indicesTitleCol = this.make("div", {"class":"twelvecol last"});
        var rowIndicesTitle = this.make("div", {"class":"row nodeDetail newSection"});

        $(rowIndicesTitle).append(indicesTitleCol);
        $(indicesTitleCol).append(indicesTitleP);

        // Indices detail row #1

        var indices1Info = Mustache.render(this.indices1Template, {});

        var indicesp1 = this.make("p", {}, indices1Info);
        var indicesp2 = this.make("p", {},
            "<svg width='100%' height='160'>" +
                "<svg id='svg_indicesSearchReqs' clip_id='clip_indicesSearchReqs' width='46.5%' height='100%' x='0' y='0' preserveAspectRatio='xMinYMin' viewBox='0 0 250 160'/>" +
                "<svg id='svg_indicesSearchTime' clip_id='clip_indicesSearchTime' width='46.5%' height='100%' x='54%' y='0' preserveAspectRatio='xMinYMin' viewBox='0 0 250 160'/>" +
            "</svg>"
        );
        var indicesp3 = this.make("p", {},
            "<svg width='100%' height='160'>" +
                "<svg id='svg_indicesGetReqs' clip_id='clip_indicesGetReqs' width='46.5%' height='100%' x='0' y='0' preserveAspectRatio='xMinYMin' viewBox='0 0 250 160'/>" +
                "<svg id='svg_indicesGetTime' clip_id='clip_indicesGetTime' width='46.5%' height='100%' x='54%' y='0' preserveAspectRatio='xMinYMin' viewBox='0 0 250 160'/>" +
            "</svg>"
        );

        var indicesCol1 = this.make("div", {"class":"twocol"});
        var indicesCol2 = this.make("div", {"class":"fivecol"});
        var indicesCol3 = this.make("div", {"class":"fivecol last"});

        var rowIndices = this.make("div", {"class":"row nodeDetail"});
        $(rowIndices).append(indicesCol1, indicesCol2, indicesCol3);
        $(indicesCol1).append(indicesp1);
        $(indicesCol2).append(indicesp2);
        $(indicesCol3).append(indicesp3);

        // Indices detail row #2

        var indicesp1_2 = this.make("p", {}, "");
        var indicesp2_2 = this.make("p", {},
            "<svg width='100%' height='160'>" +
                "<rect x='0' y='0' width='100%' height='100%' fill='#eee' stroke-width='1' />" +
            "</svg>"
        );
        var indicesp3_2 = this.make("p", {},
            "<svg width='100%' height='160'>" +
                "<svg id='svg_indicesIndexingReqs' clip_id='clip_indicesIndexingReqs' width='46.5%' height='100%' x='0' y='0' preserveAspectRatio='xMinYMin' viewBox='0 0 250 160'/>" +
                "<svg id='svg_indicesIndexingTime' clip_id='clip_indicesIndexingTime' width='46.5%' height='100%' x='54%' y='0' preserveAspectRatio='xMinYMin' viewBox='0 0 250 160'/>" +
            "</svg>"
        );

        var indicesCol1_2 = this.make("div", {"class":"twocol"});
        var indicesCol2_2 = this.make("div", {"class":"fivecol"});
        var indicesCol3_2 = this.make("div", {"class":"fivecol last"});

        var rowIndices_2 = this.make("div", {"class":"row nodeDetail"});
        $(rowIndices_2).append(indicesCol1_2, indicesCol2_2, indicesCol3_2);
        $(indicesCol1_2).append(indicesp1_2);
        $(indicesCol2_2).append(indicesp2_2);
        $(indicesCol3_2).append(indicesp3_2);

        this.$el.parent().append(
            rowSelectedNode,

            rowJvmTitle,
            rowJvm,
            rowJvmCharts,

//            rowJvmMemPools,

            rowOsTitle,
            rowOS,
            rowOsCharts,

            rowProcessTitle,
            rowProcessCharts,

            rowTransportTitle,
            rowTransportCharts,

            rowIndicesTitle,
            rowIndices,
            rowIndices_2//,
//            "<div class='row nodeDetail'>" +
//                "<div class='threecol'><p>Network info</p></div>" +
//                "<div class='ninecol last'><p>Network stats</p></div>" +
//            "</div>",
//            "<div class='row nodeDetail'>" +
//                "<div class='twocol'><p>Thread-pool info</p></div>" +
//                "<div class='onecol'><p>Bulk</p></div>" +
//                "<div class='onecol'><p>Cached</p></div>" +
//                "<div class='onecol'><p>Flush</p></div>" +
//                "<div class='onecol'><p>Index</p></div>" +
//                "<div class='onecol'><p>Management</p></div>" +
//                "<div class='onecol'><p>Merge</p></div>" +
//                "<div class='onecol'><p>Percolate</p></div>" +
//                "<div class='onecol'><p>Refresh</p></div>" +
//                "<div class='onecol'><p>Search</p></div>" +
//                "<div class='onecol last'><p>Snapshot</p></div>" +
//            "</div>",
//            "<div class='row nodeDetail'>" +
//                "<div class='twelvecol last'><p>Process...</p></div>" +
//            "</div>",
//            "<div class='row nodeDetail'>" +
//                "<div class='twelvecol last'><p>Settings...</p></div>" +
//            "</div>"
        );
    },

    clear: function() {
        this.$el.parent().find("div.row.nodeDetail").remove();

    },

    destroy: function() {

        // remove custom listeners first
        var nodesStatsCollection = this.model.get("nodesStats");
        nodesStatsCollection.off("nodesStatsUpdated");

        this.clear();
        this.undelegateEvents();
    }
});
