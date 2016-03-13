"use strict";
module.exports = function () {
    return function (req, res, next) {
    	//console.log(res.locals.err);
		var view = res.locals.view;
		var model = res.locals.model;
    	var err = res.locals.err;
    	var errorMessages = {};
    	var showErrorMessage = [];
        console.log('in error message');
        
    	if (err.name === 'ValidationError') {
            console.log(message);
        	var errors = err.errors;
        	for ( var p in errors ){
        		errorMessages[p + ''] = errors[p].message;
        	}
    	} else if (err.name === 'MongooseError') {
    		errorMessages = JSON.parse(err.message);
    	} else if (err.name === 'MongoError') {
    		errorMessages.err = err.err;
    	} else {

            errorMessages.err = err.toString();
        }

    	for (var p in errorMessages) {
    		showErrorMessage.push(errorMessages[p]);
    	}
    	if (err) {
        	res.locals.errorMessages = errorMessages;
        	res.locals.showErrorMessage = showErrorMessage;
        	res.render(view, model);
            console.log(view);
    	} else {
    		next();
    	}

    };
};