# Store

The core of Bigdesk functionality is based on [REST API][REST_API] that any [HTTP enabled][HTTP_ENABLED] Elasticsearch node provides. The idea is to pull JSON data from the REST endpoints in periodic intervals, store it somewhere and then build additional functionality on top of given slice of historical data.

[REST_API]:     http://www.elasticsearch.org/guide/reference/api/
[HTTP_ENABLED]: http://www.elasticsearch.org/guide/reference/modules/http.html

All the JSON data pulled from Elasticsearch node is stored in `org.bigdesk.store.Store`. This is a simple object that contains several arrays where the data for specific Elasticsearch cluster is kept.

Internally, every JSON object stored in the Store gets `timestamp` and all objects in each array are sorted by it. 

# Manager

Store is typically not instantiated and used directly by a client, instead the client creates an instance of `org.bigdesk.store.Manager` which is in charge of the Store lifecycle.

The important thing is that single Manager takes care of single Store only. This means that single Manager can collect data from one Elasticsearch cluster only.

The simplest use of the `Manager` can look like the following:

```
var manager = new org.bigdesk.store.Manager();

// start pulling the data
manager.start();

// stop pulling the data
manager.stop();
```

Manager can accept a configuration:

```
var configuration =
{
    endpoint: 'http://localhost:9200'
};

var manager = new org.bigdesk.store.Manager(configuration);

// start pulling the data
manager.start();

// stop pulling the data
manager.stop();
```

See [complete list](#) of all configuration options.

### Events dispatched by Manager

Manager implements `goog.events.EventTarget` and dispatches bunch of events. The events dispatch by the Manager can be found in [`org.bigdesk.store.event.EventType`](event/EventType.js). Basically, it dispatches events with every change in the Store data and couple of other events related Store lifecycle.