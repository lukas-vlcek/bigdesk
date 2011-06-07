/**
 * BigDesk is a monitoring application with live charts and statistics info for ElasticSearch cluster.
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
        // charts
        chjvmthreads, chjvmmemheap, chjvmmemnonheap,
        choscpu, chosmem, chosswap
        ;

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
                connect(hostVal, portVal);
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
        // jvm charts
        chjvmthreads = chartsBuilder.buildChJvmThreads('jvm-threads'),
        chjvmmemheap = chartsBuilder.buildChJvmMem('jvm-mem-heap', 'Mem Heap'),
        chjvmmemnonheap = chartsBuilder.buildChJvmMem('jvm-mem-non-heap', 'Mem Non-Heap'),
        // os charts
        choscpu = chartsBuilder.buildChOsCpu("os-cpu"),
        chosmem = chartsBuilder.buildChOsMem("os-mem"),
        chosswap = chartsBuilder.buildChOsSwap("os-swap",'Swap')
    ];

    function connect (hostVal, portVal) {
        var path;
        if (hostVal.indexOf('/') != -1) {
            var hostArr = hostVal.split('/');

            path = "http://" + hostArr[0] + ":" + portVal;
            hostArr.shift(); // remove host

            if (hostArr.length > 0) { // anything left?
                path += "/" + hostArr.join('/');
            }
        } else {
            path = "http://" + hostVal + ":" + portVal;
        }
        path += + "/_cluster/health";

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

    function stats (data) {

    //    console.log(data);
        updateClusterAndNodeNames(data);

        var selectedNode = undefined;
        for (var node in data.nodes) {
            if (!selectedNode && data.nodes[node].name == selectedNodeName) { selectedNode = data.nodes[node]; }
        }
        if (selectedNode) {
    //        console.log(selectedNode);

            var indices = selectedNode.indices;
            var jvm = selectedNode.jvm;
            var os = selectedNode.os;

            // insert blank space into charts
            if (firstPoint) {

                firstPoint = false;

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

            // populate charts
            chjvmthreads.series[0].addPoint([jvm.timestamp, (jvm.threads ? jvm.threads.count : null)], false, false);
            chjvmthreads.series[1].addPoint([jvm.timestamp, (jvm.threads ? jvm.threads.peak_count : null)], false, false);

            chjvmmemheap.series[0].addPoint([jvm.timestamp, (jvm.mem ? jvm.mem.heap_committed_in_bytes : null)], false, false);
            chjvmmemheap.series[1].addPoint([jvm.timestamp, (jvm.mem ? jvm.mem.heap_used_in_bytes : null)], false, false);

            chjvmmemnonheap.series[0].addPoint([jvm.timestamp, (jvm.mem ? jvm.mem.non_heap_committed_in_bytes : null)], false, false);
            chjvmmemnonheap.series[1].addPoint([jvm.timestamp, (jvm.mem ? jvm.mem.non_heap_used_in_bytes : null)], false, false);

            shrinkCharts([chjvmthreads, chjvmmemheap, chjvmmemnonheap], jvm.timestamp - winsizeVal);

            choscpu.series[0].addPoint([os.timestamp, (os.cpu ? os.cpu.idle : null)], false, false);
            choscpu.series[1].addPoint([os.timestamp, (os.cpu ? os.cpu.sys : null)], false, false);
            choscpu.series[2].addPoint([os.timestamp, (os.cpu ? os.cpu.user : null)], false, false);

            chosmem.series[0].addPoint([os.timestamp, (os.mem.actual_free_in_bytes && os.mem.actual_used_in_bytes ? os.mem.actual_free_in_bytes + os.mem.actual_used_in_bytes : null)], false, false);
            chosmem.series[1].addPoint([os.timestamp, (os.mem.used_in_bytes ? os.mem.used_in_bytes : null)], false, false);
            chosmem.series[2].addPoint([os.timestamp, (os.mem.actual_used_in_bytes ? os.mem.actual_used_in_bytes : null)], false, false);

            chosswap.series[0].addPoint([os.timestamp, (os.swap ? os.swap.free_in_bytes : null)], false, false);
            chosswap.series[1].addPoint([os.timestamp, (os.swap ? os.swap.used_in_bytes : null)], false, false);

            shrinkCharts([choscpu, chosmem, chosswap],os.timestamp - winsizeVal);

            // redraw all charts
            redrawCharts(charts);

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

    // Update cluster name and Nodes if there has been any change since the last run.
    function updateClusterAndNodeNames (data){
        if (data) {
            if(data.cluster_name && clusterName != data.cluster_name) {
                clusterName = data.cluster_name;
                clusterNameSpan.text(clusterName);
            }
            if (data.nodes) {
                var nodesChanged = false;
                for (var node in nodes) {
                    // node removed?
                    if (!data.nodes[node]) {
                        if (selectedNodeName && nodes[node] == selectedNodeName) {
                            selectedNodeName = undefined;
                            cleanCharts(charts);
                            // TODO stop timer ?
                        }
                        delete nodes[node];
                        nodesChanged = true;
                    }
                }
                for (var node in data.nodes) {
                    // new node?
                    if (!nodes[node]) {
                        nodes[node] = data.nodes[node].name;
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
        var id = getSelectedNodeId(nodeName);
        if (id) {
            var path = "http://localhost:9200/_cluster/nodes/"+id;
            $.ajax({
                type: "GET",
                url: path,
                dataType: 'jsonp',
                success: function( data ) {
                    if (data && data.nodes)
                    updateStaticNodeData(data.nodes[id]);
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
//        console.log(data);
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
        }
    }

    function setupInterval (delay) {
        clearInterval(timer);
        var path = "http://"+host.val()+":"+port.val()+"/_cluster/nodes/stats";
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
                    while (series.data[0].category && series.data[0].category < threshold) series.data[0].remove(false);
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
