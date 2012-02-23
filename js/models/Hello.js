// the only REST API that gives ES cluster version

var Hello = Backbone.Model.extend({
    url: function() { return '/'; }
});
