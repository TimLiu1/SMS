var auth = require('../../lib/auth');
var Interface = require('../../models/Interface');
var Audit = require('../../models/Audit');
var _ = require('underscore');
var Logger = require('../../lib/logger');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

module.exports = function(router) {
	var roleList = 'ROLE_ADMIN';

    router.get('/', auth.isAuthenticated(roleList), function(req, res, next) {
        var model = {
            redirect: '/interface/index'
        };
        res.json(model);
    });

	router.get('/index', auth.isAuthenticated(roleList), function(req, res, next) {
		var page = 1;
		if (req.query.page) {
			page = req.query.page;
		}

		var condition = {};
		var category = req.query.category;
		Logger.logger().log('debug', 'category: %s', category);
		if (category) {
			condition.category = category;
		}
		Interface.paginate(condition, page, 10, function(err, pageCount, items) {
			if (err) {
				return res.json({
					err: err
				});
			}
			var model = {
				title: '接口列表',
				items: items,
				page: page,
				pageCount: pageCount
			};
			model.view = 'interface.index';
			res.json(_.extend(model, res.locals.menuInit));
		}, {
			sortBy: {
				category: 1
			}
		});
	});
	router.post('/new', auth.isAuthenticated(roleList), function(req, res, next) {
		var interface = req.body.interface;
		var interfaceModel = new Interface(interface);
		interfaceModel.version = '1.0';
		interfaceModel.save(function(err) {
			var model = {
				message: 'ok'
			};
			if (err) {
				model.err = err;
				return res.json(model);
			}
			var page = 1;
			Interface.paginate({}, page, 10, function(err, pageCount, items) {
				if (err) {
					return res.json({
						err: err
					});
				}

				model.title = '接口列表',
				model.items = items;
				model.page = page;
				model.pageCount = pageCount;
				model.view = 'interface.index';
				model.showMessage = '创建成功';
				res.json(model);
			}, {
				sortBy: {
					category: 1
				}
			});
		})
	});

	router.post('/:id/save', auth.isAuthenticated(roleList), function(req, res, next) {
		var interface = req.body.interface;
		var id = req.params.id;
		Interface.findById(id, function(err, item) {
			var model = {
				message: 'ok'
			};
			if (err || !interface) {
				model.err = '更新出错';
				return res.json(model);
			}
			_.extendOwn(item, interface);
			item.save({
				new: true
			}, function(err, updatedItem) {
				if (err) {
					model.err = err.toString();
					return res.json(model);
				}
				model.showMessage = '更新成功';
				model.item = updatedItem;
				res.json(model);
			});
		});
	});

	router.get('/:id/delete', auth.isAuthenticated(roleList), function(req, res, next) {
		var id = req.params.id;
		Interface.findByIdAndRemove(id, function(err) {
			var model = {
				message: 'ok'
			};
			if (err) {
				model.err = err;
				return res.json(model);
			}
			var page = 1;
			Interface.paginate({}, page, 10, function(err, pageCount, items) {
				if (err) {
					console.log(err);
					return next(err);
				}

				model.title = '接口列表';
				model.items = items;
				model.page = page;
				model.pageCount = pageCount;
				model.view = 'interface.index';
				model.showMessage = '删除成功';
				res.json(model);
			}, {
				sortBy: {
					category: 1
				}
			});
		})
	});

	router.get('/:id/info', auth.isAuthenticated(roleList), function(req, res, next) {
		var id = req.params.id;
		Interface.findById(id, function(err, item) {
			var model = {
				message: 'ok'
			};
			if (err) {
				model.err = err;
				return res.json(model);
			}
			model.item = item;
			res.json(model);
		})
	});

	router.post('/:id/action/new', auth.isAuthenticated(roleList), function(req, res, next) {
		var id = req.params.id;
		var action = req.body.ac;
		console.log(req.body);
		if (action) {
			Interface.findByIdAndUpdate(id, {
				$push: {
					actions: action
				}
			}, {
				new: true
			}, function(err, item) {
				var model = {
					message: 'ok'
				};
				if (err) {
					model.err = err;
					return res.json(model);
				}
				model.item = item;
				res.json(model);
			});
		} else {
			Interface.findById(id, function(err, item) {
				var model = {
					message: 'ok'
				};
				if (err) {
					model.err = err;
					return res.json(model);
				}
				model.item = item;
				res.json(model);
			});
		}
	});

	router.get('/:id/action/:actionID/delete', auth.isAuthenticated(roleList), function(req, res, next) {
		var id = req.params.id;
		var actionID = req.params.actionID;

		Interface.findByIdAndUpdate(id, {
			$pull: {
				actions: {
					_id: new ObjectId(actionID)
				}
			}
		}, {
			new: true
		}, function(err, item) {
			var model = {
				message: 'ok'
			};
			if (err) {
				model.err = err;
				return res.json(model);
			}
			model.item = item;
			res.json(model);
		});

	});

	router.get('/query', auth.isAuthenticated(roleList), function(req, res, next) {
		var category = req.query.category;
		var provider = req.query.provider;
		var condition = {};
		if (category) {
			condition.category = category;
		}
		if (provider) {
			condition.provider = provider;
		}
		Interface.find(condition, function(err, items) {
			var model = {
				message: 'ok'
			};
			if (err) {
				model.err = err;
				return res.json(model);
			}
			model.list = items;
			res.json(model);
		}, {
			sort: 'code'
		});
	});
};
