/*
 * Copyright 2011-2013 Lukas Vlcek
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

goog.provide("test.org.bigdesk.store.snapshot.load.FileListAsyncTest");

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');

goog.require('goog.fs.FileReader');
goog.require('goog.fs.FileReader.EventType');
goog.require('goog.fs.FileReader.ReadyState');

/**
 * This is test of HTML5 File API. It requires user interaction.
 *
 * Once the test is started, it requires user to manually select some files.
 * Then it loads those files and test that they are not empty.
 *
 * Tested in:
 * <ul>
 * <li> Google Chrome (24.0.1312.52) - OK
 * <li> Safari (6.0.2) - OK
 * <li> Firefox (16.0, 18.0) - Files in FileList are empty objects (?) is it because CORS?
 * </ul>
 *
 * For some useful tips:
 * {@see https://developer.mozilla.org/en-US/docs/Using_files_from_web_applications}
 */
AsyncTestCase('FileListLoadAsyncTest', {

    hasFileAPI: function() {
        return (window.File && window.FileReader && window.FileList && window.Blob);
    },

    testX: function(queue) {

        if (this.hasFileAPI()) {

            /*:DOC += <h1>Select manifest and all data files</h1><input type="file" id="fileinput" multiple="multiple" />*/
            var input = goog.dom.getElement('fileinput');
            var /** @type {FileList} */ fileList;
            var fileContent = [];

            assertNotNull('Element should be found', input);

            queue.call('Step 1: Wait for the user to select files (timeout set to 30sec)', function(callbacks) {

                var goToNextQueueStep = callbacks.noop({ timeout: 30, invocations: 1 });

                goog.events.listen(input,
                    goog.events.EventType.CHANGE,
                        function(evt) {
                            fileList = evt.target.files;
                            goToNextQueueStep();
                        }
                );
            });

            queue.call('Step 2: Load selected files', function(callbacks) {

                assertTrue(goog.isDefAndNotNull(fileList));
                assertTrue('Assuming user selected some files',fileList.length > 0);

                if (fileList.length > 0) {

                    var goToNextQueueStep = callbacks.noop({ timeout: 30, invocations: 1 });
                    var loadedFiles = 0;

                    for (var i = 0, numFiles = fileList.length; i < numFiles; i++) {
                        var f = fileList[i];

                        (callbacks.addCallback(function(file, pos){

                            var fr = new goog.fs.FileReader();

                            goog.events.listen(
                                fr,
                                goog.fs.FileReader.EventType.LOAD,
                                function(evt) {
                                    var content = evt.target.getResult();
                                    fileContent[pos] = content;
                                    loadedFiles++;
                                    if (loadedFiles == fileList.length) {
                                        goToNextQueueStep();
                                    }
                                }
                            );

                            fr.readAsText(file);

                        }))(f,i);

                    }

                }

            });

            queue.call('Step 3: Do something with the content', function(callbacks) {

                assertEquals('All selected files loaded', fileList.length, fileContent.length);

                // assuming selected files were not empty
                for (var i = 0; i < fileContent.length; i++) {
                    assertNotNull(fileContent[i]);
                    assertTrue(fileContent[i].length > 0);
                }

            });
        }
    }

});
