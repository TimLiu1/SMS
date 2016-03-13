var _ = require('underscore');


module.exports = function(router) {

	router.get('/menus', function(req, res, next) {
		var model = res.locals.menuInit;
		model.view = 'header';
		res.json(model);
	});

};
