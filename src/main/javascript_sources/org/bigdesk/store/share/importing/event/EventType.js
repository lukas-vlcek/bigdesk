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

goog.provide('org.bigdesk.store.share.importing.event.EventType');

goog.require('goog.events');

/**
 * Events fired by the ImportingHandler.
 * @enum {string}
 */
org.bigdesk.store.share.importing.event.EventType = {
    DATA_IMPORT_DONE     : goog.events.getUniqueId('data_import_done'),
    DATA_IMPORT_PROGRESS : goog.events.getUniqueId('data_import_progress')
};
