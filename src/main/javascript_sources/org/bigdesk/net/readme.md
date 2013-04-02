`org.bigdesk.net` package provides functionality for network communication. In most cases client does not have to directly deal with objects found in this package at all, expect when implementing tests.

# Service

[`org.bigdesk.net.Service`](Service.js) is an interface that describes a contract by which data from Elasticsearch node is retrieved.

`Service` implementation(s) is used by [`Manager`](../store/readme.md) under the hood to handle network communication with Elasticsearch node.

The following implementations are available:

- [`XhrService`](XhrService.js): uses [XMLHttpRequest][XMLHttpRequest] API to make `GET` requests. This is recommended implementation.
- [`JsonpService`](JsonpService.js): uses [JSONP][JSNOP] technique to load data from Elasticsearch. _(Not implemented yet…)_
- [`TestService`](../../../../../test/javascript_sources/org/bigdesk/net/TestService.js): used only for testing. Not available in production code.
- [`NoopService`](../../../../../test/javascript_sources/org/bigdesk/net/NoopService.js): used only for testing. Not available in production code.

[XMLHttpRequest]: http://en.wikipedia.org/wiki/XMLHttpRequest
[JSNOP]: http://en.wikipedia.org/wiki/JSONP

`Service` object is not typically instantiated directly by client but one of `ServiceFactory` implementations is used to get `Service` instance.

# ServiceFactory

[`org.bigdesk.net.ServiceFactory`](ServiceFactory.js) is an interface used for _abstract factory_ (-like) encapsulation of obtaining `Service` implementation.

There are two implementations available:

- [`DefaultServiceFactory`](DefaultServiceFactory.js): can create `XhrService` or `JsonpService`.
- [`TestServiceFactory`](../../../../../test/javascript_sources/org/bigdesk/net/TestServiceFactory.js): used for tests only. It can create `TestService` or `NoopService`.

Example of using `DefaultServiceFactory` to :

```javascript
goog.require('org.bigdesk.net.DefaultServiceFactory');
goog.require('goog.Uri');  

// get ServiceFactory
var factory = /** @type {org.bigdesk.net.ServiceFactory} */ new org.bigdesk.net.DefaultServiceFactory();
  
// we want use XhrService
var xhrService = factory.getService('xhr', goog.Uri.parse('http://localhost:9200'));
  
// get hot threads …
xhrService.getHotThreads(goog.nullFunction);
```

But hold on! Client does not instantiate ServiceFactory directly (except for tests). By default the `Manager` does this for you and uses the `DefaultServiceManager` and `XhrService` implementations. 
This is equivalent to the following configuration:

```javascript
var manager = new org.bigdesk.store.Manager({
  endpoint: 'http://localhost:9200',
  net_service: 'xhr'
});
```
Using `JSONP` on default `endpoint` would be:

```javascript
var manager = new org.bigdesk.store.Manager({
  net_service: 'jsonp'
});
```

## Unit Testing

`Manager` can accept implementation of `ServiceFactry` as a second optional argument in the constructor. This allows us to tell the `Manager` to use `TestService`, `NoopService` or any other `Service` implementation that provided factory knows how to create.

```javascript
var factory = new org.bigdesk.net.TestServiceFactory();
var manager = new org.bigdesk.store.Manager({
  net_service: 'noop'
}, factory);
```