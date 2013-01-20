#!/bin/sh

# ----------------------------------------------------------------------------
# A simple script to generate dependency list in load order.
#
# Author: Lukas Vlcek (lukas.vlcek@gmail.com)
# ----------------------------------------------------------------------------

./closure-library-r2180/closure/bin/build/closurebuilder.py \
  --root=./closure-library-r2180 \
  --root=./src/main/javascript_sources \
  --root=./src/test/jsTestDriver \
  \
  --output_mode='list' \
  --output_file=./rawlist \
  \
  --namespace="test.org.bigdesk.store.importing.FileListImportingAsyncTest"

# prepare the output for the jsTestDriver.conf format
# put the following output into the 'load:' section

echo "---- START ----"

while read line
do
  # leaving out all *Test.js files
  if ! [[ "${line}" =~ "Test.js" ]]; then
    echo " - $line"
  fi
done < ./rawlist

echo "---- END ----"

rm ./rawlist