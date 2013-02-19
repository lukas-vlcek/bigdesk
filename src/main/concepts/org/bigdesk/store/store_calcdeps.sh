#!/bin/sh

../../../../../../closure-library-r2388/closure/bin/calcdeps.py \
--dep ./../../../../../../closure-library-r2388 \
--path ./../../../../../main/javascript_sources/org/bigdesk/store \
--path ./../../../../../main/javascript_sources/org/bigdesk/net \
--path ./../../../../../main/concepts/org/bigdesk/store \
--output_mode deps \
> store_deps.js

echo "Generated file: store_deps.js"