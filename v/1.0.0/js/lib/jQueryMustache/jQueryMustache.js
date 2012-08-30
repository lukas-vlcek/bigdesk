// jQuery Mustache Plug-In 
// Version: 1.0.0, Last updated: 2/17/2011
//
// GitHub       - https://github.com/thinkdevcode/jQuery-Mustache
// Dependancy   - https://github.com/janl/mustache.js/
// Contact      - gin4lyfe@gmail.com (Eugene Alfonso)
// 
// See License.txt for full license
// 
// Copyright (c) 2011 Eugene Alfonso,
// Licensed under the MIT license.

(function ($) {
    $.fn.mustache = function (data, partial, stream) {
    	if (Mustache && data) {
    	    return $(Mustache.to_html(this.text(), data, partial, stream));
        }
    };
})(jQuery);