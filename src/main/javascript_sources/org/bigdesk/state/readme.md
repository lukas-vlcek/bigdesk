# State

[`org.bigdesk.state.State`](State.js) is an object (POJO-like) that is representation of [Store](../store/readme.md) atomic state at specific point in time such that it contains the best candidates for each REST endpoint Store's collection.

The best candidate from collection for given `time` is such item whose `timestamp` = `max(timestamp)` from all items where `timestamp` <= `time`. If there is no such item in the collection then the value of best candidate is `null`.

For example consider the following Store that keeps track of three colletions `A`,`B` and `C`. The collection `A` has **three** data points, collections `B` has **five** and `C` had **three**. All sampled at different times:
```
  ====================================================
  A:                     |         1       2       3
  ====================================================
  B:   1         2<------|  3          4          5
  ====================================================
  C:   1     2      3<---| 
  ====================================================
  T: 1 2 3 4 5 6 7 8 9 A B C D E F G H I J K L M N O P
                         ^
                         |
                         Time selected by client
```
Then the State for time `{ T: B }` would be `{ A: null, B: 2, C: 3 }`.

State object is not typically instantiated by client. You can use `Head` object for it instead.

# Head

[`org.bigdesk.state.Head`](Head.js) is an object that can produce State(s). Constructor of Head requires Store Manager.

```
  // create new manager and start collecting data
  var manager = new org.bigdesk.store.Manager().start();
  
  var head = new org.bigdesk.state.Head(manager);
  
  // get state now
  var state = head.getState(new Date().getTime());
  
```