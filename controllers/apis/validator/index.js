var validator = require('is-my-json-valid')
var _ = require('underscore');


module.exports = function(router) {
	var schema = {
		"title": "Example Schema",
		"type": "object",
		"properties": {
			"firstName": {
				"type": "string"
			},
			"lastName": {
				"type": "string"
			},
			"age": {
				"description": "Age in years",
				"type": "integer",
				"minimum": 0
			}
		},
		"required": ["firstName", "lastName"]
	};
	router.post('/', function(req, res, next) {
		var message = req.body;
		if (_.isEmpty(message)) {
			return res.json({
				errors: 'message body empty'
			});
		}
		var validate = validator(schema);
		if (validate(message)) {
			return res.json(message);
		} else {
			return res.json({
				errors: validate.errors
			});
		}
	});

};