/**
 * Created by lmarkus on 1/5/14.
 */
"use strict";
// Load the MomentJS Library
var moment = require('moment');
// Load the project's configuration
var baseCode = require('./baseCode');
var util = require('util');
//We require that dustjs, and the dustjs-helpers have been loaded. The way we invoke this function will ensure that.
(function (dust) {

    //Create a helper called 'formatDate'
    dust.helpers.baseCode = function (chunk, context, bodies, params) {

        //Retrieve the fallback language from the configuration
        //var fallbackLang = nconf.get('i18n').fallback || 'en-US';

        //Dig the current language out of the context, or go to the fallback.
//        var lang = (context && context.stack && context.stack.head && context.stack.head.context && context.stack.head.context.locality) 
//            || (context.stack && context.stack.tail && context.stack.tail.head.context && context.stack.tail.head.context.locality)
//            || (context.stack && context.stack.tail && context.stack.tail.tail && context.stack.tail.tail.head.context && context.stack.tail.tail.head.context.locality)
//            || fallbackLang;

        //Retrieve the date value from the template parameters.
        var code = dust.helpers.tap(params.code, chunk, context);
        var base = dust.helpers.tap(params.base, chunk, context);
        var filter = dust.helpers.tap(params.filter, chunk, context);
        //Parse the date object using MomentJS
        var output = '';
        if (code || code == '') {
            if (code != '') {
                output = baseCode[base](code, filter);
            }
        } else {
        	var objs = baseCode[base](null, filter);
        	var id = dust.helpers.tap(params.id, chunk, context);
        	var name = dust.helpers.tap(params.name, chunk, context);
        	var blank = dust.helpers.tap(params.blank, chunk, context);
        	var selectValue = dust.helpers.tap(params.selectValue, chunk, context);
        	var required = dust.helpers.tap(params.required, chunk, context);
        	var css = dust.helpers.tap(params.class, chunk, context);
        	var disabled = dust.helpers.tap(params.disabled, chunk, context);
        	var disabledStr = '';
        	if (disabled && new Boolean(disabledStr)) {
        		disabledStr = 'disabled';
        	}
        	var cssStr = '';
        	if (css) {
        		cssStr = util.format('class="%s"', 'form-control ' + css);
        	} else {
        		cssStr = 'class="form-control"';
        	}
        	if(required) {
        		output = util.format('<select %s %s id="%s" name="%s" required>', cssStr, disabledStr, id, name);
        	} else {
        		output = util.format('<select %s %s id="%s" name="%s" >', cssStr, disabledStr, id, name);
        	}
        	
        	if (blank && new Boolean(blank)) {
        		output += util.format('<option value="" />');
        	}
        	for (var i = 0, l = objs.length; i < l; i++) {
        		var obj = objs[i];
        		if (selectValue && selectValue === obj.key) {
        			output += util.format('<option value="%s" selected="true" >%s</option>', obj.key, obj.value);
        		} else {
        			output += util.format('<option value="%s" >%s</option>', obj.key, obj.value);
        		}
        	}
        	output += '</select>';
        }
        return chunk.write(output);
    };

})(typeof exports !== 'undefined' ? module.exports = require('dustjs-helpers') : dust);