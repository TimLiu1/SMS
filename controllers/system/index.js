var auth = require('../../lib/auth');
var Logger = require('../../lib/logger');
var Menu = require('../../models/system/Menu');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var clientHelper = require('../../lib/clientHelper');
var _ = require('underscore');

module.exports = function(router) {
	router.get('/', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var model = {
			redirect: '/system/menus'
		};
		res.json(model);
	});
}