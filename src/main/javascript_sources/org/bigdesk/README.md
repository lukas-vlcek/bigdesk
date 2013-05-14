Highlevel description of packages:

# context

Defines context for the application. Context typically defines singletons and factories.
Client can setup specific objects into the context (typically for tests). By default
context contains objects used in production. Context is represented by `LookUp` object.

This is similar concept to JEE AS context or Spring application context, though much simpler.
The goal is to get loose coupling and easier testing.

# net

Low level implementation of network services.
Experts only; if you want to implement tests have a look at it.

# store

Data pulled from Elasticsearch is kept in Store (persistence for data).
Important concept in this package is Manager which is in charge of the Store.

# state

Utilities for pulling data from Store.

- Head object can extract Store's State for specific timestamps.