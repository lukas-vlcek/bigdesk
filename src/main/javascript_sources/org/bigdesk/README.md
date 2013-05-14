Highlevel description of packages:

# net

Low level implementation of network services.
Experts only; if you want to implement tests have a look at it.

# store

Data pulled from Elasticsearch is kept in Store (persistence for data).
Important concept in this package is Manager which is in charge of the Store.

# state

Utilities for pulling data from Store.

- Head object can extract Store's State for specific timestamps.