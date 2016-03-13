/**
 * Created by lmarkus on 1/5/14.
 */
"use strict";
// Load the MomentJS Library
var moment = require('moment');
// Load the project's configuration


//We require that dustjs, and the dustjs-helpers have been loaded. The way we invoke this function will ensure that.
(function (dust) {

    //Create a helper called 'formatDate'
    dust.helpers.formatDate = function (chunk, context, bodies, params) {

        //Retrieve the fallback language from the configuration
        //var fallbackLang = nconf.get('i18n').fallback || 'en-US';

        //Dig the current language out of the context, or go to the fallback.
//        var lang = (context && context.stack && context.stack.head && context.stack.head.context && context.stack.head.context.locality) 
//            || (context.stack && context.stack.tail && context.stack.tail.head.context && context.stack.tail.head.context.locality)
//            || (context.stack && context.stack.tail && context.stack.tail.tail && context.stack.tail.tail.head.context && context.stack.tail.tail.head.context.locality)
//            || fallbackLang;

        //Retrieve the date value from the template parameters.
        var date = dust.helpers.tap(params.date, chunk, context);
        var required = dust.helpers.tap(params.required, chunk, context);

        //Retrieve the format string from the template parameters.
        var format = dust.helpers.tap(params.format, chunk, context);

        //Parse the date object using MomentJS
        var output = '';
        var m = null;
        if (date) {
        	m = moment(new Date(date));
        	output = m.format(format);
        } else if (required) {
        	m = moment(new Date());
        	output = m.format(format);
        }
        //Set the language in which the date should be formatted
        //m.lang(lang);

        //Format the string
        

        //Write the final value out to the template
        return chunk.write(output);
    };

})(typeof exports !== 'undefined' ? module.exports = require('dustjs-helpers') : dust);