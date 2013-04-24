/*   
   Copyright 2011-2012 Lukas Vlcek

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

// full _all/_status response, http://www.elasticsearch.org/guide/reference/api/admin-indices-status.html

var IndicesStatusTimestamp = Backbone.Model;

var IndicesStatus = Backbone.Collection.extend({

    model: IndicesStatusTimestamp,

    url: function() {
        // TODO 'recovery' and 'snapshot' status
        return '/_all/_status';
    },

    parse: function(data) {
        // add key
        data.id = new Date().getTime();
        return data;
    },

    add: function(models, options) {
        delete options.silent;
        if (options && options.now && options.storeSize) {
            var iterator = function(indicesStatusTimestamp) {
                return !(indicesStatusTimestamp.id < (options.now - options.storeSize));
            };

            var rejected = this.reject(iterator);
            if (rejected.length > 0) {
                this.remove(rejected, options);
            }
        }
        var parentCall = Backbone.Collection.prototype.add.call(this, models, options);

        // custom trigger: collection has been updated
        this.trigger("indicesStatusUpdated", {});

        return parentCall;
    },

    // make sure models are ordered by time
    comparator: function(model) {
        return model.id;
    }

});
