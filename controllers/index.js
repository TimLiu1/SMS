'use strict';


var passport = require('passport');
var auth = require('../lib/auth');
var User = require('../models/system/User');
module.exports = function(router) {

	router.get('/', auth.isAuthenticated(), function(req, res) {
		res.render('index', {});
	});

	router.get('/resetPass', auth.isAuthenticated(), function(req, res) {
		res.render('resetPass', {});
	});

	router.post('/resetPass', auth.isAuthenticated(), function(req, res) {
		var pass1 = req.body.password1;
		var pass2 = req.body.password2;
		var model = {
			password1: pass1,
			password2: pass2
		};
		if (pass1 != pass2) {
			model.message = '两次输入的密码不一致';
			return res.render('resetPass', model);
		}
		User.findOne({
			name: req.user.name
		}, function(err, user) {
			if (err) {
				model.message = err.toString();
				return res.render('resetPass', model);
			}
			if (user.validPassword(pass1)) {
				model.message = '新密码不能和原密码一样';
				return res.render('resetPass', model);
			}
			user.password = pass1;
			console.log(user);
			user.save(function(err) {
				if (err) {
					model.message = err.toString();
					return res.render('resetPass', model);
				}
				res.redirect('/logout');
			})
		});

	});

	router.get('/login', function(req, res) {
		res.render('login', {
			title: '请登陆',
			message: req.flash('error'),
			username: req.flash('username'),
			password: req.flash('password')
		});
	});

	router.post('/login',
		passport.authenticate('local-login', {
			failureRedirect: '/login',
			failureFlash: true
		}),
		function(req, res) {
			res.redirect(req.session.goingTo || '/');
	});

	router.get('/logout', auth.isAuthenticated(), function(req, res, next) {
		req.logout();
		req.session.roleMenuTree = null;
		var redirect = req.query.redirect;
		if (redirect) {
			res.redirect(redirect);
		} else {
			res.redirect('/');
		}
	});
};
