/*
{
    cluster: {
        cluster_name: {
            connectionVerified: bool,
            intervals: {_all_active_intervals_},
            storeSize: int,
            health: {},
            nodesStats: [
                timestamp_x: {
                    [nodeStats, nodeStats, ...]
                },
                timestamp_y: {[...]},
                timestamp_z: {[...]},
                ...
            ],
            nodesState: [
                {node_with_id},
                {node_with_id},
                ...
            ],
            nodeInfo: {} //relevant to selected node
        }
    }
}
*/

var Cluster = Backbone.Model.extend({
    defaults: {
        id: "not_set_yet",
        connectionVerified: false,
        health: undefined,
        nodesStats: undefined,
        nodesState: undefined,
        nodeInfo: undefined,
        storeSize: 60000, // 1min
        intervals: {},
        refreshIntervalCallback: undefined
    },
    // id: "cluster_name"
    // baseUrl: "complete URL for REST API including port number"
    // refreshInterval: _some_number_ [optional, defaults to 2000ms]
    // refreshIntervalCallback: function [optional]. If provided, it is called every time new data is pushed into store.
    initialize: function(attrs){
        var _model = this;
        var _conn = _model.get("connectionVerified");
        if (_conn == false) {
            // ensure default callback (in case user explicitly provided "undefined" value instead of function)
            if (this.get("refreshIntervalCallback") == undefined) {
                this.set({refreshIntervalCallback: function(clusterName, restApiName, response) {
                    console.log("["+clusterName+"] ["+restApiName+"]", response)
                }});
            }
            var connection = {
                baseUrl: attrs.baseUrl,
                refreshInterval: attrs.refreshInterval || 2000
            };
            var hello = new Hello({},connection);
            hello.fetch({
                success: function(model, response){
                    var version = hello.get("version");
                    if (version && version.number) {
                        version = version.number;
                        var _vArray = version.split(".");
                        if (_vArray.length > 2 && _model.checkVersion(_vArray[0], _vArray[1], _vArray[2])) {
                            _model.versionVerified(version);
                            _model.initCluster(connection);
                        } else {
                            _model.yellAboutVersion(version);
                        }
                    } else {
                        _model.yellAboutVersion("n/a");
                    }
                },
                error: function(model, response) {
                    console.log("[Error] something wrong happened...", model, response);
                }
            });
        }
    },

    // When creating a new cluster, client has to provide both REST URL endpoint and cluster name.
    // The idea is that the cluster name is obtained by client upfront using cluster health API for example.
    validate: function(attrs){
        // this must be constructor call
        if (this.get("connectionVerified") == undefined) {
            if (!attrs.id || !attrs.baseUrl) {
                return "Both cluster name and URL must be provided.\n" +
                    "Example: { " +
                        "id: \"_cluster_name_\", " +
                        "baseUrl: \"_ES_REST_end_point_\" " +
                    "}";
            }
            if (attrs.refreshIntervalCallback != undefined) {
                if (typeof attrs.refreshIntervalCallback != "function") {
                    return "refreshIntervalCallback must be function.";
                }
            }
        }
    },

    // returns false or true depending on given version numbers
    // for now we allow only 0.19.x versions
    checkVersion: function(major, minor, maintenance) {
        if (major == 0 && minor == 19 && maintenance >= 0) {
            return true;
        }
        return false;
    },

    versionVerified: function(version) {
        console.log("Check ES node version: " + version + " [ok]");
    },

    yellAboutVersion: function(version) {
        var message =
            "*********************************\n" +
            "Bigdesk may not work correctly!\n" +
            "Found ES node version: " + version + "\n" +
            "Requires ES node version: 0.19.x\n" +
            "*********************************";
        console.log(message);
        if (alert) { alert(message); }
    },

    // connection.baseUrl
    // connection.refreshInterval
    initCluster: function(connection) {
        var _model = this;
        // connection has been already verified
        _model.set({connectionVerified: true});

        _model.set({health: new ClusterHealth({},connection)});
        _model.set({nodesStats: new NodesStats([],connection)});
        _model.set({nodesState: new NodesState([],connection)});
        _model.set({nodeInfo: new NodeInfo({},connection)});

        this.startFetch(connection.refreshInterval);

    },

    clearIntervals: function() {
        var _cluster = this;
        var intervals = this.get("intervals");
        _.each(intervals, function(num, key){
            _cluster.clearInterval(key);
        });
    },

    clearInterval: function(intervalId) {
//        console.log("stop interval " + intervalId);
        var intervals = this.get("intervals");
        if (intervals && intervals[intervalId]) {
            clearInterval(intervals[intervalId]);
            delete intervals[intervalId];
            this.set({intervals: intervals});
        }
    },

    startInterval: function(intervalId, functionCall, interval) {
//        console.log("start interval " + intervalId);
        var intervals = this.get("intervals");
        if (intervals) {
            if (intervals[intervalId]) {
                console.log("[WARN] replacing existing interval");
            }
            var i = setInterval(functionCall, interval);
            intervals[intervalId] = i;
            this.set({intervals: intervals});
            // fire callback right now
            functionCall();
        }
    },

    // start fetching bigdesk models and collections
    // params:
    //  refreshInterval
    //  baseUrl [optional] can override baseUrl that was passed into Cluster constructor
    startFetch: function(refreshInterval, baseUrl) {
        var _cluster = this;
        var _clientCallback = _cluster.get("refreshIntervalCallback");
        var _clusterName = _cluster.get("id");

        if (baseUrl && typeof baseUrl == "string") {
            _cluster.get("health").setBaseUrl(baseUrl);
            _cluster.get("nodesStats").setBaseUrl(baseUrl);
            _cluster.get("nodesState").setBaseUrl(baseUrl);
            _cluster.get("nodeInfo").setBaseUrl(baseUrl);
        }

        var healthRefreshFunction = function(){
            _cluster.get("health").fetch({
                success:function(model, response){
                    _clientCallback.call(_cluster, _clusterName, "cluster > Health", response);
                }
            });
        };

        var nodesStatsRefreshFunction = function(){
            _cluster.get("nodesStats").fetch({
                add: true,
                storeSize: _cluster.get("storeSize"),
                now: new Date().getTime(),
                silent: true,
                success:function(model, response){
                    _clientCallback.call(_cluster, _clusterName, "cluster > NodesStats", response);
                }
            });
        };

        var nodesStateRefreshFunction = function(){
            _cluster.get("nodesState").fetch({
                add: true,
                silent: true,
                success:function(model, response){
                    _clientCallback.call(_cluster, _clusterName, "cluster > NodesState", response);
                }
            });
        };

        this.clearInterval("nodesStateInterval");
        this.clearInterval("nodesStatsInterval");
        this.clearInterval("healthInterval");

        this.startInterval("nodesStateInterval", nodesStateRefreshFunction, refreshInterval);
        this.startInterval("nodesStatsInterval", nodesStatsRefreshFunction, refreshInterval);
        this.startInterval("healthInterval", healthRefreshFunction, refreshInterval);
    },

    // set storeSize value of the cluster
    setStoreSize: function(storeSize) {
        var _cluster = this;
        _cluster.set({storeSize: storeSize});
    }
});

var ClusterCollection = Backbone.Collection.extend({
    model: Cluster
});

var BigdeskStore = Backbone.Model.extend({

    defaults: {
        cluster: new ClusterCollection()
    },

    // Returns an instance of a Cluster model with given name (id)
    // or <code>undefined</code> if no instance if found.
    getCluster: function(clusterName) {
        return this.get("cluster").get(clusterName);
    },

    // Add a new cluster into store. Parameter is an instance of a Cluster model.
    // Throws error if there already is a cluster with the same id.
    addCluster: function(clusterModel) {
        var _c = this.get("cluster");
        if (_c.get(clusterModel.get("id")) == undefined) {
            _c.add(clusterModel)
        } else {
            throw "Cluster already exists.";
        };
    }
});
