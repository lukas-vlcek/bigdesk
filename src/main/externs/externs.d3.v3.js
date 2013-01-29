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
 * @fileoverview Externs for d3 (3.0.4)
 * @author Lukas Vlcek (lukas.vlcek@gmail.com)
 * @externs
 */

// see https://github.com/iplabs/closure-compiler/tree/master/contrib/externs

/**
 * @type {Object}
 * @const
 */
var d3 = {};

/**
 * @see https://github.com/mbostock/d3/wiki/Selections#wiki-d3_select
 * @param {!(string|Node)} selector
 * @return {Array.<HTMLElement>}
 */
d3.select = function(selector) {};

/**
 * @see https://github.com/mbostock/d3/wiki/Selections#wiki-d3_selectAll
 * @param {!(string|Node)} selector
 * @return {Array.<HTMLElement>}
 */
d3.selectAll = function(selector) {};

/**
 * @see https://github.com/mbostock/d3/wiki/Selections#wiki-data
 * @param {(Array|function(...): Array)=} opt_value is an array of data values
 * @param {Function=} opt_key
 * @return {Array.<HTMLElement>}
 */
d3.data = function(opt_value, opt_key) {};

d3.enter = function() {};
d3.append = function() {};
d3.text = function() {};

/**
 * @see https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_transition
 * @param {Array.<HTMLElement>} opt_selection
 * @return {Array.<HTMLElement>}
 */
d3.transition = function(opt_selection) {};

/**
 * Transition.
 * @interface */
function transition() {};

// @see https://github.com/mbostock/d3/wiki/Transitions#wiki-delay
transition.prototype.delay;

// @see https://github.com/mbostock/d3/wiki/Transitions#wiki-duration
transition.prototype.duration;

// @see https://github.com/mbostock/d3/wiki/Transitions#wiki-ease
transition.prototype.ease;

// @see https://github.com/mbostock/d3/wiki/Transitions#wiki-attr
transition.prototype.attr;

// @see https://github.com/mbostock/d3/wiki/Transitions#wiki-attrTween
transition.prototype.attrTween;
