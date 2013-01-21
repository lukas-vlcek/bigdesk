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

/**
 * @fileoverview
 * @author Lukas Vlcek (lukas.vlcek@gmail.com)
 */

goog.provide('org.bigdesk.store.share.importing.ImportingHandler');
goog.provide('org.bigdesk.store.share.importing.StoreSourceType');
goog.provide('org.bigdesk.store.share.importing.StorePart');
goog.provide('org.bigdesk.store.share.importing.ImportingHandler.EventType');

goog.require('org.bigdesk.store.share.importing.event.DataImportProgress');
goog.require('org.bigdesk.store.share.importing.event.DataImportDone');

goog.require('goog.net.Jsonp');

goog.require('goog.array');
goog.require('goog.object');
goog.require('goog.string');
goog.require('goog.json');

goog.require('goog.events.EventTarget');
goog.require('goog.events');

goog.require('goog.fs.FileReader');
goog.require('goog.async.DeferredList');

goog.require('goog.debug.Logger');

/**
 * Create new instance od ImportHandler.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
org.bigdesk.store.share.importing.ImportingHandler = function() {
    goog.events.EventTarget.call(this);

    /** @private */
    this.log = goog.debug.Logger.getLogger('org.bigdesk.store.share.importing.ImportingHandler');

    this.thiz_ = this;

};
goog.inherits(org.bigdesk.store.share.importing.ImportingHandler, goog.events.EventTarget);

/** @inheritDoc */
org.bigdesk.store.share.importing.ImportingHandler.prototype.disposeInternal = function() {
    org.bigdesk.store.share.importing.ImportingHandler.superClass_.disposeInternal.call(this);
};

/**
 * Load data declared in manifest into the store. The store is supposed to be empty.
 * @param {!org.bigdesk.store.Store} store
 * @param {!Object} manifest
 * @param {FileList=} opt_filelist FileList containing Files with the data (used only if 'source_type' is set to 'FileList')
 * TODO consider returning Deferred (instead of firing DataImportDone event)
 */
org.bigdesk.store.share.importing.ImportingHandler.prototype.importData = function(store, manifest, opt_filelist) {

    // shortcuts
    var DataImportProgress = org.bigdesk.store.share.importing.event.DataImportProgress;
    var DataImportDone     = org.bigdesk.store.share.importing.event.DataImportDone;
    var StoreSourceType    = org.bigdesk.store.share.importing.StoreSourceType;
    var thiz_ = this;

    if (goog.object.containsKey(manifest, 'store') && goog.isObject(manifest['store'])) {

        var manifestStore = manifest['store'];
        var sourceType;

        // check and verify 'source_type'
        if (goog.object.containsKey(manifestStore, 'source_type') &&
            goog.object.containsValue(StoreSourceType, manifestStore['source_type'])) {
            sourceType = manifestStore['source_type'];
            thiz_.log.info("Source type: ["+sourceType+"]");
        }
        if (!goog.isDefAndNotNull(sourceType)) {
            thiz_.log.severe("Importing error: Unknown 'source_type' value ["+sourceType+"]");
            // TODO fire event: did not find any source type information
            return;
        }

        var totalParts = 0;
        var partsProcessed = 0;
        var progress = 0;

        // start import progress
        this.dispatchEvent(new DataImportProgress(progress));

        // first get number of total parts and its files in manifest (needed to track total progress)
        var parts = goog.object.getValues(org.bigdesk.store.share.importing.StorePart);
        goog.array.forEach(parts, function(part){
            if (goog.isArray(manifestStore[part])) {
                totalParts += manifestStore[part].length;
            }
        });

        // no data files found
        if (totalParts == 0) {
            progress = 1;
            thiz_.dispatchEvent(new DataImportProgress(progress));
            return;
        }

        // contribution of individual file to total progress
        // in other words, how much the total progress increases if one file is imported
        // what matters is number of files, not their size
        var progressPartFileIncrement = 1/totalParts;

        // import individual parts and report progress
        goog.array.forEach(parts, function(part){

            var deferredFileList = /** @type {!Array.<!goog.async.Deferred>} */ [];

            goog.array.forEach(manifestStore[part], function(partFile) {

                if (goog.object.containsKey(partFile, 'uri')) {
                    var uri = partFile['uri'];
                    thiz_.log.info("Importing file: ["+part+"]["+uri+"]");
                    if (sourceType == StoreSourceType.FILE_LIST) {
                        var file = thiz_.findFileByName(uri, opt_filelist);
                        if (file != null) {
                            var deferred = goog.fs.FileReader.readAsText(file);
                            deferred.addCallback(function(result){
                                thiz_.pushIntoStore(store, part, result, partFile);
                                partsProcessed += 1;
                            });
                            deferredFileList.push(deferred);
                        }
                    }
                } else {
                    thiz_.log.warning("Importing error: Missing 'uri' parameter in ["+part+"]["+partFile+"]");
                    // ignore, skip...
                }

                progress += progressPartFileIncrement;
                thiz_.dispatchEvent(new DataImportProgress(progress));
            });

//            console.log('deferredFileList',deferredFileList);
            var deferredList = new goog.async.DeferredList(deferredFileList);
            deferredList.addCallback(function(results){
                if (partsProcessed == totalParts) {
                    thiz_.dispatchEvent(new DataImportDone(partsProcessed, "Finished import of "+totalParts+" data files."));
                }
                // TODO, if doing FileList import it can happen that manifest refers to more
                // files then is available in FileList (user did not select all files).
                // We need to detect this case and fire ImportDone event as well.
//                else if (false) {

//                }
            });

        });

    }
//    else {
        // TODO fire event: did not find any data to import
//    }

};

/**
 * @param {!org.bigdesk.store.Store} store
 * @param {!String} part
 * @param {!String} fileContent
 * @param {!String} fileName
 * @private
 */
org.bigdesk.store.share.importing.ImportingHandler.prototype.pushIntoStore = function(store, part, fileContent, fileName) {

    var json;
    try {
        json = goog.json.parse(fileContent);
    } catch (e) {
        this.log.warning('Failed to parse file ['+fileName+'] content.');
        // TODO consider firing some error event so that we can reflect this on UI level
        return;
    }

    var StorePart = org.bigdesk.store.share.importing.StorePart;
    /** @type {function(number, !Object):boolean} */ var addFunction;
    switch (part) {
        case StorePart.NODES_STATS:
            addFunction = goog.bind(store.addNodesStats, store);
            break;
        case StorePart.NODES_INFO:
            addFunction = goog.bind(store.addNodesInfo, store);
            break;
        default:
            this.log.info('Unsupported data part ['+part+']');
            return;
            break;
    }

    if (json['type'] == 'plain') {
        goog.array.forEach(json['data'], function(item){
            /** @type {number} */ var timestamp = goog.string.parseInt(goog.object.getKeys(item)[0]);
            var data = item[timestamp];
            if (goog.isObject(data)) {
                addFunction(timestamp, data);
            }
        });
    }
};

/**
 * @param {!string} name
 * @param {FileList=} fileList
 * @return {File|null} file found in fileList having this name
 * @private
 */
org.bigdesk.store.share.importing.ImportingHandler.prototype.findFileByName = function(name, fileList) {
    if (!goog.isDefAndNotNull(fileList)) { return null; }
    // just in case browser passes full path
    var p_ = Math.max(name.lastIndexOf('/'), name.lastIndexOf('\\'));
    if (p_ > -1) {
        name = name.slice(p_ + 1);
    }
    for (var i = 0; i < fileList.length; i++) {
        var f_ = fileList[i]
        if (f_.name == name) {
            return f_;
        }
    }
    return null;
};


/**
 * Supported types of store types.
 * @enum {string}
 */
org.bigdesk.store.share.importing.StoreSourceType = {
    FILE_LIST: "FileList"
};

/**
 * Parts of store that we try to import.
 * @enum {string}
 */
org.bigdesk.store.share.importing.StorePart = {
    NODES_STATS: "nodes_stats",
    NODES_INFO : "nodes_info"
};

/**
 * Events fired by the ImportingHandler.
 * @enum {string}
 */
org.bigdesk.store.share.importing.ImportingHandler.EventType = {
    DATA_IMPORT_DONE     : goog.events.getUniqueId('data_import_done'),
    DATA_IMPORT_PROGRESS : goog.events.getUniqueId('data_import_progress')
};
