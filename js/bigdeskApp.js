// bigdesk store keeps track of state of clusters
var bigdeskStore = new BigdeskStore();

// declare views
var clusterHealthView = undefined;
var clusterNodesListView = undefined;

var connectionNotEstablishedTimeout = undefined;

var setupConnectionCheck = function(url) {
    if (connectionNotEstablishedTimeout == undefined) {
        connectionNotEstablishedTimeout = setTimeout(function(){
            alert("Can not connect to endpoint ["+url+"]\nMake sure endpoint is defined correctly.");
        }, 2000);
    }
};

var clearConnectionCheck = function() {
    if (connectionNotEstablishedTimeout != undefined) {
        clearTimeout(connectionNotEstablishedTimeout);
        connectionNotEstablishedTimeout = undefined;
    }
};

var disconnectionNotSuccessfulTimeout = undefined;

var setupFallbackDisconnectStrategy = function(fallbackStrategy) {
    if (disconnectionNotSuccessfulTimeout == undefined) {
        disconnectionNotSuccessfulTimeout = setTimeout(fallbackStrategy, 2000);
    }
};

var clearFallbackDisconnectStrategy = function() {
    if (disconnectionNotSuccessfulTimeout != undefined) {
        clearTimeout(disconnectionNotSuccessfulTimeout);
        disconnectionNotSuccessfulTimeout = undefined;
    }
};

var connectTo = function(url, refreshInterval, storeSize, dispatcher, callback) {

    clearConnectionCheck();
    setupConnectionCheck(url);

    var connectionConfig = { baseUrl: url };
    var clusterHealth = new ClusterHealth({},connectionConfig);

    clusterHealth.fetch({

        success: function(model, response) {

            clearConnectionCheck();

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
                        dispatcher: dispatcher
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

            clearConnectionCheck();
            alert("Cannot connect to the cluster!");

        }
    });
};

var disconnectFrom = function(url, callback) {

    var disconnectFromCluster = function(cluster) {
        cluster.clearIntervals();
        if (clusterHealthView != undefined) {
            clusterHealthView.clear();
        }
        if (clusterNodesListView != undefined) {
            clusterNodesListView.clear();
            clusterNodesListView.undelegateEvents();
        }
    };

    // Iterate through all clusters having baseUrl == url and disconnect from them.
    var fallbackStrategy = function(url) {
        _.each(bigdeskStore.get("cluster")
            .filter(function(cluster){
                return cluster.get("health").get("baseUrl") == url;
            }),
            function(cluster){
                console.log("Disconnecting from ["+cluster.id+"] using fallback strategy");
                disconnectFromCluster(cluster);
            });
        if (callback) {
            callback();
        }
    };

    clearFallbackDisconnectStrategy();
    setupFallbackDisconnectStrategy(function(){fallbackStrategy(url)});

    var connectionConfig = { baseUrl: url };
    var clusterHealth = new ClusterHealth({},connectionConfig);

    // we need to do the health.fetch to get cluster name.
    clusterHealth.fetch({

        success: function(model, response) {

            clearFallbackDisconnectStrategy();

            var clusterName = model.get("cluster_name");
            var cluster = bigdeskStore.getCluster(clusterName);
            if (cluster) {
                disconnectFromCluster(cluster);
                console.log("Disconnected from ["+clusterName+"]");
                if (callback) {
                    callback();
                }
            } else {
                fallbackStrategy(url);
            }
        },

        error: function(model, response) {

            clearFallbackDisconnectStrategy();
            fallbackStrategy(url);

        }
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

        var ajaxResponseCallback = function(clusterName, restApiName, response) {
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

        var newDataCallback = function(description, data) {
//            console.log(description, data);
        };

        var bigdeskEventDispatcher = _.clone(Backbone.Events);
        bigdeskEventDispatcher.on("onAjaxResponse", ajaxResponseCallback);
        bigdeskEventDispatcher.on("onNewData", newDataCallback);

        button.click(function(){
            if (isConnected()) {
                disconnectFrom(restEndPoint.val(), switchButtonText);
            } else {
                connectTo(restEndPoint.val(), getRefreshInterval(), storeSize.val(), bigdeskEventDispatcher, switchButtonText);
            }
        });

        restEndPoint.bind("keypress",function(event){
            if (typeof event == 'undefined' && window.event) { event = window.event; }
            if(event.keyCode == 13){
                if (event.cancelable && event.preventDefault) {
                    event.preventDefault();
                    button.click();
                } else {
                    button.click();
                    return false;
                }
            }
        });

        var getSearchUrlVar = function(key) {
            var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.search);
            return decodeURIComponent(result && result[1] || "");
        };

        var getUrlParams = function() {
            return {
                endpoint: getSearchUrlVar("endpoint") || "http://localhost:9200",
                refresh: getSearchUrlVar("refresh") || 2000,
                history: getSearchUrlVar("history") || 300000,
                connect: getSearchUrlVar("connect") || false
            }
        };

        var useUrlParams = function() {
            var params = getUrlParams();
            restEndPoint.val(params.endpoint);
            refreshInterval.val(params.refresh);
            storeSize.val(params.history);
            return params;
        };

        var BigdeskRouter = Backbone.Router.extend({

            routes: {
//                "nodes" : "nodes",
//                "nodes/:nodeId" : "nodes",
                "*other" : "defaultRoute"
            },

//            nodes: function(nodeId) {
//                useUrlParams();
//            },

            defaultRoute: function(other) {
                var params = useUrlParams();
                if (params.connect == true || params.connect == "true") {
                    button.click();
                }
            }

        });

        var bigdeskRouter = new BigdeskRouter();

        Backbone.history.start();

    }
);