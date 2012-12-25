#!/bin/sh

../../../../../../closure-library-r2180/closure/bin/calcdeps.py \
--dep ./../../../../../../closure-library-r2180 \
--path ./../../../../../main/javascript/org/bigdesk/store \
--output_mode deps \
> deps_test.js

echo "Generated file: deps_test.js"