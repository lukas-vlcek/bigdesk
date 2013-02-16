#!/bin/sh

../../../../../../closure-library-r2388/closure/bin/calcdeps.py \
--dep ./../../../../../../closure-library-r2388 \
--path ./../../../../../main/javascript_sources/org/bigdesk/store \
--path ./../../../../../main/javascript_sources/org/bigdesk/net \
--path ./../../../../../test/javascript_sources/org/bigdesk/net \
--output_mode deps \
> Manager_test_deps.js

echo "Generated file: Manager_test_deps.js"