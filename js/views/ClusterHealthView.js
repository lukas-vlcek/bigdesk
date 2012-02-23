var ClusterHealthView = Backbone.View.extend({

    initialize: function() {

        this.clear();

        var _view = this;

        // Health model is not available now (loaded via AJAX), thus we have to
        // wait for it to be loaded to bind to its events.
        this.model.on("change:health",
            function(model){

                var health = model.get("health");

                health.on("change:status", function(){
                    _view.render();
                });

                health.on("change:number_of_nodes", function(){
                    _view.render();
                });

                health.on("change:status", function(){
                    _view.render();
                });
            });
    },

    render: function() {
        var health = this.model.get("health");
        if (health) {
            $(this.el).html(
                "Cluster: " + health.get("cluster_name") +
                "<br>Number of nodes: " + health.get("number_of_nodes") +
                "<br>Status: <span style='background-color: "+health.get("status")+"'>" + health.get("status") +"</span>");
        }
        return this;
    },

    clear: function() {
        $(this.el).html("No cluster connected.");
    }
});
