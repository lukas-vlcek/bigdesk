# Store

All JSON data pulled form Elasticsearch is stored in the `Store`. Store is typically not instantiated directly
by client, instead client creates instance of `Manager` which is in charge of the store lifecycle.

```
var configuration =
{
    endpoint: 'http://localhost:9200'
};

var manager = new org.bigdesk.store.Manager(configuration);

manager.start();
// ...
manager.stop();
```