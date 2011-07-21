/**
 * BigDesk is a monitoring application with live charts and statistics info for ElasticSearch cluster.
 * @github https://github.com/lukas-vlcek/bigdesk/
 * @author Lukas Vlcek (twitter: @lukasvlcek)
 */
;
(function(){

    var mainArea = $("#mainArea"),
        form = $("#top form"),
        button = $("#go"),
        host = $("#host"),
        port = $("#port"),
        interval = $("#interval"),
        indicesStatsContainer = $("#indices div.container"),
        jvmStatsContainer = $("#jvmStatsContainer"),
        cpuStateContainer = $("#cpuStateContainer"),
        transportStateContainer = $("#transportStateContainer"),
        networkStateContainer = $("#networkStateContainer"),
        jvmStateContainer = $("#jvmStateContainer"),
        processStateContainer = $("#processStateContainer"),
        processStatsContainer = $("#processStatsContainer"),
        nodeStatsContainer = $("#nodeStatsContainer"),
        connected = false,
        firstPoint = true,
        winsize = $("#winsize"),
        winsizeVal = $("option:selected", winsize).val(),
        clusterNameSpan = $("#cluster-name"),
        clusterName = clusterNameSpan.text(),
        selectedNodeName,
        nodesSpan = $("#nodes"),
        timer, charts,
        nodes = {},
        // for easier parsing
        endpoint,
        // charts
        chProcessFileDesc, chNodeOpenChannels,
        chjvmthreads, chjvmmemheap, chjvmmemnonheap,
        choscpu, chosmem, chosswap
        ;

    var _selectedNodeState = {};

    mainArea.slideUp();

    $(".sectionHeader").click(function(event){
        $(".container",event.target.parentNode).slideToggle();
    });

    form.bind('submit', function(){ return false; });

    button.bind('click', function() {
        if ($(this).val() == "STOP") {
            mainArea.animate({ opacity: 0.3});
            mainArea.slideUp();
            clearTimeout(timer);
            connected = false;
            host.removeAttr("disabled");
            port.removeAttr("disabled");
            button.val("GO!");
            firstPoint = true;
            // disconected ...
        } else {
            mainArea.slideDown();
            mainArea.animate({ opacity: 1});
            var hostVal = host.val();
            var portVal = port.val();
            if (!hostVal || !portVal || hostVal.trim().length == 0 || portVal.trim().length == 0) {
                alert("Fill in host and port data!");
            } else {
                setupEndpoint();
                connect();
            }
        }
    });

    interval.change(function() {
        if (connected) {
            setupInterval($(this).attr('value'));
        }
    });

    winsize.change(function() {
        winsizeVal = $(this).attr('value');
        shrinkCharts(charts);
        redrawCharts(charts);
    });

    // build all charts
    charts = [
        // process chart
        chProcessFileDesc = chartsBuilder.buildChProcessFileDesc('process_file_descriptors'),
        chNodeOpenChannels = chartsBuilder.buildChNodeOpenChannels('node_open_channels'),
        // jvm charts
        chjvmthreads = chartsBuilder.buildChJvmThreads('jvm-threads'),
        chjvmmemheap = chartsBuilder.buildChJvmHeapMem('jvm-mem-heap', 'Mem Heap'),
        chjvmmemnonheap = chartsBuilder.buildChJvmNonHeapMem('jvm-mem-non-heap', 'Mem Non-Heap'),
        // os charts
        choscpu = chartsBuilder.buildChOsCpu("os-cpu"),
        chosmem = chartsBuilder.buildChOsMem("os-mem"),
        chosswap = chartsBuilder.buildChOsSwap("os-swap",'Swap')
    ];

    /**
     * Parse host and port fields into an endpoint form.
     *
     * @todo Support scheme.
     * @todo Use some sort of parse_uri()
     */
    function setupEndpoint() {
        if (host.val().indexOf('/') != -1) {
            var hostArr = host.val().split('/');

            path = "http://" + hostArr[0] + ":" + port.val();
            hostArr.shift(); // remove host

            if (hostArr.length > 0) { // anything left?
                path += "/" + hostArr.join('/');
            }
        } else {
            path = "http://" + host.val() + ":" + port.val();
        }
        endpoint = path;
    }
    

    function connect () {
        var path = endpoint + "/_cluster/health";
        $.ajax({
            type: "GET",
            url: path,
            data: "level=shards",
            dataType: 'jsonp',
            success : function( data ) {
                setupInterval( $("option:selected", interval).val() );
                connected = true;
                host.attr("disabled", "true");
                port.attr("disabled", "true");
                button.val("STOP");
            }
        });
    }

    /**
     * @param stats /_cluster/nodes/stats
     */
    function stats (stats) {

        var path = endpoint + "/_cluster/state";
        $.ajax({
            type: "GET",
            url: path,
            data: "filter_metadata=true&filter_routing_table=true&filter_blocks=true",
            dataType: 'jsonp',
            success : function( state ) {
                updateClusterAndNodeNames( stats, state );
            }
        });

        var selectedNode = undefined;
        for (var node in stats.nodes) {
            if (!selectedNode && stats.nodes[node].name == selectedNodeName) { selectedNode = stats.nodes[node]; }
        }
        if (selectedNode) {

            var indices = selectedNode.indices;
            var jvm = selectedNode.jvm;
            var os = selectedNode.os;
            var process = selectedNode.process;
            var currentMillis = new Date().getTime();

            // insert blank space into charts
            if (firstPoint) {

                firstPoint = false;

                chProcessFileDesc.series[0].addPoint([process.timestamp - 1, null], false, false);
                chProcessFileDesc.series[1].addPoint([process.timestamp - 1, null], false, false);

                chNodeOpenChannels.series[0].addPoint([currentMillis - 1, null], false, false);
                chNodeOpenChannels.series[1].addPoint([currentMillis - 1, null], false, false);

                chjvmthreads.series[0].addPoint([jvm.timestamp - 1, null], false, false);
                chjvmthreads.series[1].addPoint([jvm.timestamp - 1, null], false, false);

                chjvmmemheap.series[0].addPoint([jvm.timestamp - 1, null], false, false);
                chjvmmemheap.series[1].addPoint([jvm.timestamp - 1, null], false, false);

                chjvmmemnonheap.series[0].addPoint([jvm.timestamp - 1, null], false, false);
                chjvmmemnonheap.series[1].addPoint([jvm.timestamp - 1, null], false, false);

                choscpu.series[0].addPoint([os.timestamp - 1, null], false, false);
                choscpu.series[1].addPoint([os.timestamp - 1, null], false, false);
                choscpu.series[2].addPoint([os.timestamp - 1, null], false, false);

                chosmem.series[0].addPoint([os.timestamp - 1, null], false, false);
                chosmem.series[1].addPoint([os.timestamp - 1, null], false, false);
                chosmem.series[2].addPoint([os.timestamp - 1, null], false, false);

                chosswap.series[0].addPoint([os.timestamp - 1, null], false, false);
                chosswap.series[1].addPoint([os.timestamp - 1, null], false, false);
            }

            // update stats that are not charts
            updateIndices(indices);
            updateJvmGC(jvm.gc);
            updateProcessStats(process);
            updateNodeStats(selectedNode);

            // populate charts
            chartPoint(chProcessFileDesc.series[0], process.timestamp, process.open_file_descriptors);
            chartPoint(chProcessFileDesc.series[1], process.timestamp, ( _selectedNodeState.process ? _selectedNodeState.process.max_file_descriptors : null));

            shrinkCharts([chProcessFileDesc], process.timestamp - winsizeVal);

            chartPoint(chNodeOpenChannels.series[0], currentMillis, (selectedNode.http ? selectedNode.http.server_open : null));
            chartPoint(chNodeOpenChannels.series[1], currentMillis, (selectedNode.transport ? selectedNode.transport.server_open : null));

            shrinkCharts([chNodeOpenChannels], currentMillis - winsizeVal);

            chartPoint(chjvmthreads.series[0], jvm.timestamp, (jvm.threads ? jvm.threads.count : null));
            chartPoint(chjvmthreads.series[1], jvm.timestamp, (jvm.threads ? jvm.threads.peak_count : null));

            chartPoint(chjvmmemheap.series[0], jvm.timestamp, (jvm.mem ? jvm.mem.heap_committed_in_bytes : null));
            chartPoint(chjvmmemheap.series[1], jvm.timestamp, (jvm.mem ? jvm.mem.heap_used_in_bytes : null));

            chartPoint(chjvmmemnonheap.series[0], jvm.timestamp, (jvm.mem ? jvm.mem.non_heap_committed_in_bytes : null));
            chartPoint(chjvmmemnonheap.series[1], jvm.timestamp, (jvm.mem ? jvm.mem.non_heap_used_in_bytes : null));

            shrinkCharts([chjvmthreads, chjvmmemheap, chjvmmemnonheap], jvm.timestamp - winsizeVal);

            chartPoint(choscpu.series[0], os.timestamp, (os.cpu ? os.cpu.idle : null));
            chartPoint(choscpu.series[1], os.timestamp, (os.cpu ? os.cpu.sys : null));
            chartPoint(choscpu.series[2], os.timestamp, (os.cpu ? os.cpu.user : null));

            chartPoint(chosmem.series[0], os.timestamp, (os.mem.actual_free_in_bytes && os.mem.actual_used_in_bytes ? os.mem.actual_free_in_bytes + os.mem.actual_used_in_bytes : null));
            chartPoint(chosmem.series[1], os.timestamp, (os.mem.used_in_bytes ? os.mem.used_in_bytes : null));
            chartPoint(chosmem.series[2], os.timestamp, (os.mem.actual_used_in_bytes ? os.mem.actual_used_in_bytes : null));

            chartPoint(chosswap.series[0], os.timestamp, (os.swap ? os.swap.free_in_bytes : null));
            chartPoint(chosswap.series[1], os.timestamp, (os.swap ? os.swap.used_in_bytes : null));

            shrinkCharts([choscpu, chosmem, chosswap],os.timestamp - winsizeVal);

            // redraw all charts
            redrawCharts(charts);

        }
    }

    function chartPoint ( series, timestamp, value ) {
        if ( series && series.data ) {
            if ( series.data.length > 0) {
                var point = series.data[ series.data.length -1 ];
                if ( point && point.category ) {
                    // do not add point with the same timestamp (causes issues in highcharts)
                    if ( point.category < timestamp ) {
                        series.addPoint( [timestamp, value], false, false );
                    }
                } else {
                    series.addPoint( [timestamp, value], false, false );
                }
            } else {
                series.addPoint( [timestamp, value], false, false );
            }
        }
    }

    function updateIndices (indices) {
        if (!indices) return;
        // response format changed in 0.16
        // see https://github.com/elasticsearch/elasticsearch/issues/746
        $("#indicesStatsTmpl").mustache(indices).appendTo(indicesStatsContainer.empty());
    }

    function updateJvmGC (gc) {
        if (!gc) return;
        // let's makes collectors mustache friendly
        gc.collectorsX = [];
        $.each(gc.collectors, function(id, col){
            col.collection_type = id;
            gc.collectorsX.push(col);
        });
        $("#jvmStatsTmpl").mustache(gc).appendTo(jvmStatsContainer.empty());
    }

    function updateProcessStats (process) {
        if (process) {
            $("#processStatsTmpl").mustache(process).appendTo(processStatsContainer.empty());
        }
    }

    function updateNodeStats (node) {
        if (node) {
            $("#nodeStatsTmpl").mustache(node).appendTo(nodeStatsContainer.empty());
        }
    }

    // Update cluster name and Nodes if there has been any change since the last run.
    /**
     * Update cluster name and Nodes if there has been any change since the last run.
     * @param stats /_cluster/nodes/stats
     * @param state /_cluster/state
     */
    function updateClusterAndNodeNames ( stats, state ){
        if (stats) {
            // get master node id if available
            var masterNodeId = undefined;
            if (state) {
               masterNodeId = state.master_node;
            }
            if(stats.cluster_name && clusterName != stats.cluster_name) {
                clusterName = stats.cluster_name;
                clusterNameSpan.text(clusterName);
            }
            if (stats.nodes) {
                var nodesChanged = false;
                for (var node in nodes) {
                    // node removed?
                    if (!stats.nodes[node]) {
                        if (selectedNodeName && nodes[node] == selectedNodeName) {
                            selectedNodeName = undefined;
                            cleanCharts(charts);
                            // TODO stop timer ?
                        }
                        delete nodes[node];
                        nodesChanged = true;
                    }
                }
                for (var node in stats.nodes) {
                    // new node?
                    if (!nodes[node]) {
                        nodes[node] = stats.nodes[node].name;
                        nodesChanged = true;
                    }
                }
                if (nodesChanged) {
                    //redraw nodes
                    var _nodes = [];
                    for (var n in nodes) _nodes.push(nodes[n]);
                    _nodes.sort(); // sort node names alphabetically
                    nodesSpan.empty();
                    if (selectedNodeName == undefined && _nodes.length > 0) {
                        // make first available node selected
                        selectedNodeName = _nodes[0];
                        refreshNodeInfo(selectedNodeName);
                    }
                    $.each(_nodes, function(index, value) {
                        var node =  $(document.createElement("span")).attr("class","node").append(value);
                        if (value == selectedNodeName) { $(node).addClass("selectedNode"); }
                        if ( masterNodeId == getSelectedNodeId(value)) { $(node).addClass( "masterNode" ); }
                        $(node).click(
                            function(){
                                // new node selected by user
                                if (selectedNodeName != $(this).text()) {
                                    selectedNodeName = $(this).text();
                                    refreshNodeInfo(selectedNodeName);
                                    $.each(nodesSpan.children(),
                                        function(id, s){
                                          if (selectedNodeName == $(s).text()) $(s).addClass("selectedNode")
                                          else $(s).removeClass("selectedNode");
                                        }
                                    );
                                    cleanCharts(charts);
                                    setupInterval($("#interval option:selected").val());
                                }
                            }
                        );
                        $(nodesSpan).append(node);
                    });
                }
            }
        }
    }

    function refreshNodeInfo (nodeName) {
        _selectedNodeState = {}; // TODO temporary
        var id = getSelectedNodeId(nodeName);
        if (id) {
            var path = endpoint + "/_cluster/nodes/"+id;
            $.ajax({
                type: "GET",
                url: path,
                dataType: 'jsonp',
                success: function( data ) {
                    if (data && data.nodes) {
                        updateStaticNodeData(data.nodes[id]);
                    }
                }
            });
        }
    }

    function getSelectedNodeId (name) {
        for (var node in nodes) {
            if (nodes[node] == name) return node;
        }
        return undefined;
    }

    function updateStaticNodeData (data) {
        if (data) {
            $("#networkStateTmpl").mustache(data).appendTo(networkStateContainer.empty());
            if (data.os && data.os.cpu) {
                $("#cpuStateTmpl").mustache(data.os.cpu).appendTo(cpuStateContainer.empty());
            }
            if (data.transport) {
                $("#transportStateTmpl").mustache(data.transport).appendTo(transportStateContainer.empty());
            }
            if (data.jvm) {
                $("#jvmStateTmpl").mustache(data.jvm).appendTo(jvmStateContainer.empty());;
            }
            if (data.process) {
                $("#processStateTmpl").mustache(data.process).appendTo(processStateContainer.empty());
                _selectedNodeState.process = { max_file_descriptors: data.process.max_file_descriptors };
            }
        }
    }

    function setupInterval (delay) {
        clearInterval(timer);
        var path = endpoint + "/_cluster/nodes/stats";
        var _function = function(){
            $.ajax({
                type: "GET",
                url: path,
                dataType: 'jsonp',
                success : function( data ) {
                    stats(data);
                }
            });
        };
        _function(); // execute the _function right now before the first delay interval elapses
        timer = setInterval(_function, delay);
    }

    function cleanCharts(chartsArray) {
        for (var i = 0; i < chartsArray.length; i++) {
            for (var s = 0; s < chartsArray[i].series.length; s++) {
                var series = chartsArray[i].series[s];
                series.setData([],true);
            }
        }
    }

    function shrinkCharts (chartsArray, threshold) {
        if (threshold && winsizeVal > 0) {
            for (var i = 0; i < chartsArray.length; i++) {
                for (var s = 0; s < chartsArray[i].series.length; s++) {
                    var series = chartsArray[i].series[s];
                    if (series.data && series.data.length > 0 ) {
                        while (series.data[0].category && series.data[0].category < threshold) series.data[0].remove(false);
                    }
                }
            }
        }
    }

    function redrawCharts (chartsArray) {
        for (var i = 0; i < chartsArray.length; i++) {
            chartsArray[i].redraw();
        }
    }

})();
