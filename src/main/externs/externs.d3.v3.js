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
 * @see https://github.com/mbostock/d3/wiki/API-Reference
 * @const
 */
var d3 = {};

d3.prototype.transition;
d3.prototype.layout;
d3.prototype.scale;
d3.prototype.svg;

/**
 * Selection.
 * @see https://github.com/mbostock/d3/wiki/Selections
 * @interface */
function selection() {}

// @see https://github.com/mbostock/d3/wiki/Selections#wiki-d3_select
selection.prototype.select;

// @see https://github.com/mbostock/d3/wiki/Selections#wiki-d3_selectAll
selection.prototype.selectAll;

// @see https://github.com/mbostock/d3/wiki/Selections#wiki-attr
selection.prototype.attr;

// @see https://github.com/mbostock/d3/wiki/Selections#wiki-classed
selection.prototype.classed;

// @see https://github.com/mbostock/d3/wiki/Selections#wiki-style
selection.prototype.style;

// @see https://github.com/mbostock/d3/wiki/Selections#wiki-property
selection.prototype.property;

// @see https://github.com/mbostock/d3/wiki/Selections#wiki-text
selection.prototype.text;

// @see https://github.com/mbostock/d3/wiki/Selections#wiki-html
selection.prototype.html;

// @see https://github.com/mbostock/d3/wiki/Selections#wiki-append
selection.prototype.append;

// @see https://github.com/mbostock/d3/wiki/Selections#wiki-insert
selection.prototype.insert;

// @see https://github.com/mbostock/d3/wiki/Selections#wiki-remove
selection.prototype.remove;

// @see https://github.com/mbostock/d3/wiki/Selections#wiki-data
selection.prototype.data;

// @see https://github.com/mbostock/d3/wiki/Selections#wiki-enter
selection.prototype.enter;

// @see https://github.com/mbostock/d3/wiki/Selections#wiki-exit
selection.prototype.exit;

// @see https://github.com/mbostock/d3/wiki/Selections#wiki-filter
selection.prototype.filter;

// @see https://github.com/mbostock/d3/wiki/Selections#wiki-sort
selection.prototype.sort;

// @see https://github.com/mbostock/d3/wiki/Selections#wiki-order
selection.prototype.order;

// @see https://github.com/mbostock/d3/wiki/Selections#wiki-on
selection.prototype.on;


/**
 * Transition.
 * @see https://github.com/mbostock/d3/wiki/Transitions
 * @interface */
function transition() {}

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

// @see https://github.com/mbostock/d3/wiki/Transitions#wiki-each
transition.prototype.each;

// @see https://github.com/mbostock/d3/wiki/Transitions#wiki-style
transition.prototype.style;

// @see https://github.com/mbostock/d3/wiki/Transitions#wiki-styleTween
transition.prototype.styleTween;

// @see https://github.com/mbostock/d3/wiki/Transitions#wiki-text
transition.prototype.text;

// @see https://github.com/mbostock/d3/wiki/Transitions#wiki-tween
transition.prototype.tween;

// @see https://github.com/mbostock/d3/wiki/Transitions#wiki-remove
transition.prototype.remove;


/**
 * Scale.
 * @see https://github.com/mbostock/d3/wiki/Scales
 * @interface */
function scale() {}

// @see https://github.com/mbostock/d3/wiki/Ordinal-Scales#wiki-category20
scale.prototype.category20;

/**
 * Layout.
 * @see https://github.com/mbostock/d3/wiki/Layouts
 * @interface */
function layout() {}

layout.prototype.pie;

/**
 * Pie.
 * @see https://github.com/mbostock/d3/wiki/Pie-Layout
 * @interface */
function pie() {}

// @see https://github.com/mbostock/d3/wiki/Pie-Layout#wiki-sort
pie.prototype.sort;


/**
 * SVG.
 * @see https://github.com/mbostock/d3/wiki/SVG-Shapes
 * @interface
 */
function svg() {}

svg.prototype.arc;


/**
 * Arc Shape generator.
 * @see https://github.com/mbostock/d3/wiki/SVG-Shapes#wiki-arc
 * @interface
 */
function arc() {}

// @see https://github.com/mbostock/d3/wiki/SVG-Shapes#wiki-arc_innerRadius
arc.prototype.innerRadius;

// @see https://github.com/mbostock/d3/wiki/SVG-Shapes#wiki-arc_outerRadius
arc.prototype.outerRadius;
