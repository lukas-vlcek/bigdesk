var ClusterStateView = Backbone.View.extend({

    initialize: function() {
        var _view = this;
        _view.clear();

//        var clusterState = _view.model.get("clusterState");
    },

    render: function() {
        var _view = this;
        _view.clear();


        var clusterState = _view.model.get("clusterState");
        if (clusterState) {

            var theLatest = clusterState.at(clusterState.length-1);

            if (theLatest) {

                var packData = {
                    name: theLatest.get("cluster_name"),
                    children: []
                };

                var nodes = theLatest.get("nodes");

                for (var nodeId in theLatest.get("routing_nodes").nodes) {

                    var node = {
                        name: nodes[nodeId].name,
                        children: []
                    };

                    for (var shardCnt in theLatest.get("routing_nodes").nodes[nodeId]) {

                        var shard = theLatest.get("routing_nodes").nodes[nodeId][shardCnt];

                        node.children.push({

                            name: shard.index,
                            size: 1,

                            // optional
                            primary: shard.primary,
                            relocating_node: shard.relocating_node,
                            shard: shard.shard,
                            state: shard.state

                        });
                    };

                    packData.children.push(node);
                }

//                console.log("pack", packData);

                var width = 400,
                    height = 400,
                    format = d3.format(",d");

                var pack = d3.layout.pack()
                     .size([width - 4, height - 4])
                     .value(function(d) { return d.size; });

                var vis = d3.select("#clusterChart").append("svg")
                     .attr("width", width)
                     .attr("height", height)
                     .attr("class", "pack")
                   .append("g")
                     .attr("transform", "translate(2, 2)");

                var node = vis.data([packData]).selectAll("g.node")
                       .data(pack.nodes)
                     .enter().append("g")
                       .attr("class", function(d) { return d.children ? "node" : d.primary ? "primary leaf node" : "leaf node"; })
                       .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

                node.append("title")
                   .text(function(d) { return d.name     + (d.children ? "" : ": " + format(d.size)); });

                node.append("circle")
                   .attr("r", function(d) { return d.r; });

                node.filter(function(d) { return !d.children; }).append("text")
                   .attr("text-anchor", "middle")
                   .attr("dy", ".3em")
                   .text(function(d) { return (d.name+" ["+ d.shard+"]").substring(0, d.r / 3); });

            }
        }

    },

    clear: function() {
        // TODO off all events from initialize()
        this.$el.empty();
    }
});
