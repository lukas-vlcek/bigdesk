// bigdesk store keeps track of state of clusters
var bigdeskStore = new BigdeskStore();

// declare views
var clusterHealthView = undefined;
var clusterNodesListView = undefined;

var connectTo = function(url, refreshInterval, storeSize, refreshIntervalCallback, callback) {

    var connectionConfig = { baseUrl: url };
    var clusterHealth = new ClusterHealth({},connectionConfig);

    clusterHealth.fetch({
        success: function(model, response) {

            var clusterName = model.get("cluster_name");
            var cluster = bigdeskStore.getCluster(clusterName);

            var displayInitialView = function() {
                clusterHealthView = new ClusterHealthView({el: $("#clusterHealth"), model: cluster});
                clusterHealthView.render();

                clusterNodesListView = new ClusterNodesListView({el: $("#clusterNodes"), model: cluster});
                clusterNodesListView.render();
            };

            if (cluster == undefined) {

                console.log("Found a new cluster [" + clusterName + "]");

                bigdeskStore.addCluster(

                    // Keep in mind 'new Cluster()' is a heavy operation
                    // because it performs several AJAX calls.
                    new Cluster({
                        id: clusterName,
                        baseUrl: connectionConfig.baseUrl,
                        storeSize: storeSize,
                        refreshInterval: refreshInterval,
                        refreshIntervalCallback: refreshIntervalCallback
                    })
                );

                // get cluster reference so that it can be used in view later...
                cluster = bigdeskStore.getCluster(clusterName);
                displayInitialView();

            } else {

                console.log("Cluster [" + clusterName + "] found in store");

                cluster.setStoreSize(storeSize);

                // init view first, then fetch the update!
                displayInitialView();
                cluster.startFetch(refreshInterval, connectionConfig.baseUrl);
            }
            if (callback) {
                callback();
            }
        },
        error: function(model, response) {
            alert("Cannot connect to the cluster!");
        }
    });
};

var disconnectFrom = function(url, callback) {

    var connectionConfig = { baseUrl: url };
    var clusterHealth = new ClusterHealth({},connectionConfig);

    // we need to do the health.fetch to get cluster name.
    clusterHealth.fetch({
        success: function(model, response) {
            var clusterName = model.get("cluster_name");
            var cluster = bigdeskStore.getCluster(clusterName);
            if (cluster) {
                cluster.clearIntervals();
                if (clusterHealthView != undefined) {
                    clusterHealthView.clear();
                }
                if (clusterNodesListView != undefined) {
                    clusterNodesListView.clear();
                    clusterNodesListView.undelegateEvents();
                }
                console.log("Disconnected from ["+clusterName+"]");
                if (callback) {
                    callback();
                }
            }
        }
//        ,error: function(model, response) {
//            /*TODO fall back strategy*/
//        }
    });
};

var changeRefreshInterval = function(url, newRefreshInterval) {

    var connectionConfig = { baseUrl: url };
    var clusterHealth = new ClusterHealth({},connectionConfig);

    // we need to do the health.fetch to get cluster name.
    clusterHealth.fetch({
        success: function(model, response) {
            var clusterName = model.get("cluster_name");
            var cluster = bigdeskStore.getCluster(clusterName);
            if (cluster) {
                // we do not want to change URL just refresh interval
                cluster.startFetch(newRefreshInterval/*, connectionConfig.baseUrl*/);
            }
        },
        error: function(model, response) {
            // TODO do not allow change refresh select element (select original value)
        }
    });
};

var changeStoreSize = function(url, newStoreSize) {

    var connectionConfig = { baseUrl: url };
    var clusterHealth = new ClusterHealth({},connectionConfig);

    // we need to do the health.fetch to get cluster name.
    clusterHealth.fetch({
        success: function(model, response) {
            var clusterName = model.get("cluster_name");
            var cluster = bigdeskStore.getCluster(clusterName);
            if (cluster) {
                cluster.setStoreSize(newStoreSize);
            }
        },
        error: function(model, response) {
            // TODO do not allow change store size element (select original value)
        }
    });
};

$(document).ready(
    function($) {

        var restEndPoint = $("#restEndPoint"),
            refreshInterval = $("#refreshInterval"),
            storeSize = $("#storeSize"),
            button = $("#connectButton"),
            ajaxIndicator = $("#ajaxIndicator");

        var isConnected = function() {
            return (button.val() !== "Connect");
        };

        var getRefreshInterval = function() {
            return refreshInterval.find(":selected").val();
        };

        var getStoreSize = function() {
            return storeSize.find(":selected").val();
        };

        var switchButtonText = function() {
            if (isConnected()) {
                button.val("Connect");
                restEndPoint.removeAttr('disabled');
            } else {
                button.val("Disconnect");
                restEndPoint.attr('disabled','disabled');
            }
        };

        refreshInterval.change(function(){
            if (isConnected()) {
                changeRefreshInterval(restEndPoint.val(), getRefreshInterval());
            }
        });

        storeSize.change(function(){
           if (isConnected()) {
               changeStoreSize(restEndPoint.val(), getStoreSize());
           }
        });

        var clientCallback = function(clusterName, restApiName, response) {
//            console.log("["+clusterName+"] ["+restApiName+"]", response);
//            var iterator = function(nodeStats) {return nodeStats.id; };
//            if (restApiName == "cluster > Health") {
//                console.log(response);
//                var nodesCollection = this.get("nodesStats");
//                console.log("collection length",nodesCollection.length);
//                console.log("collection max",nodesCollection.max(iterator).id);
//                console.log("collection min",nodesCollection.min(iterator).id);
//            }
            ajaxIndicator.show().css("background-color", "lightgreen").fadeOut("slow");
        };

        button.click(function(){
            if (isConnected()) {
                disconnectFrom(restEndPoint.val(), switchButtonText);
            } else {
                connectTo(restEndPoint.val(), getRefreshInterval(), storeSize.val(), clientCallback, switchButtonText);
            }
        });
    }
);