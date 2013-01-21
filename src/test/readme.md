# About Javascript Testing

All javascript tests in this project are broken down into three categories, each found under specific folder:

* html
* javascript
* jsTestDriver

## javascript

Tests implemented using Google Closure
```
goog.require('goog.testing.jsunit');
```

They do not run in web browsers and are typically used for simple unit tests.
When `mvm clean test` is run, then all these tests are executed.

## html

Contains wrappers that allow execution of individual tests from `src/test/javascript` package (see above).
Each test typically requires three files:

1. HTML page
2. shell script to generate file with a list of dependencies
3. generated dependencies file

Both HTML page and the shell script needs to be maintained manually, but that is not a big deal.

Execution of individual test is as simple as opening the HTML page in web browser. Just note that this executes the original javascript code (no compilation and no minification).

## jsTestDriver

Tests implemented using Google [JsTestDriver](http://code.google.com/p/js-test-driver/).

When `mvm clean test` (or `mvn clean jstd:test`) is run, then all these tests are executed in web browser. Some IDE support jsTestDriver as well, for example IntelliJ IDEA do (just note that some configuration of maven pom.xml was required to support both manual execution of these tests as well as execution driven by IDE).

These tests are driven by configuration file called [`jsTestDriver.conf`](https://github.com/jbossorg/search-web-ui/blob/master/jsTestDriver.conf) and dependency list in this configuration file can be generated/updated using [`printClosureDependencies.sh`](https://github.com/jbossorg/search-web-ui/blob/master/printClosureDependencies.sh) script.

# How to implement Javascript tests

The typical process of implementing a new javascript test is to add a new test under `src/test/javascript` package. Then implement a new `src/test/html` wrapper for it (which allows quick and immediate execution of the test).

If web browser is required, then add a new test under `src/test/jeTestDriver` package.