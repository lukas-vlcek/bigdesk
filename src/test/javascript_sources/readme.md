Sources that are used for tests like mocks, helper classes, etc ... but not goog.testing.jsunit classes itself.

I want to keep these sources separated from production sources, however, during @mvn test@ and @mvn package@ these
 sources are copied to @src/main/javascript@ folder (which is created at that time as well and cleared in the end).
