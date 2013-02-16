#!/bin/sh

../../../../../../closure-library-r2388/closure/bin/calcdeps.py \
--dep ./../../../../../../closure-library-r2388 \
--path ./../../../../../main/javascript_sources/org/bigdesk/store \
--output_mode deps \
> Store_test_deps.js

echo "Generated file: Store_test_deps.js"