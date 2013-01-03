#!/bin/sh

../../../../../../closure-library-r2180/closure/bin/calcdeps.py \
--dep ./../../../../../../closure-library-r2180 \
--path ./../../../../../main/javascript_sources/org/bigdesk/store \
--path ./../../../../../main/javascript_sources/org/bigdesk/net \
--path ./../../../../../test/javascript_sources/org/bigdesk/net \
--output_mode deps \
> manager_test_deps.js

echo "Generated file: manager_test_deps.js"