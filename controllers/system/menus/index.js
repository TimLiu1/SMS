"use strict";
var Menu = require('../../../models/system/Menu');
var menuHelper = require('../../../lib/menuHelper');
var clientHelper = require('../../../lib/clientHelper');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var auth = require('../../../lib/auth');
var Logger = require('../../../lib/logger');
var _ = require('underscore');
module.exports = function(app) {
	app.get('/', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var page = 1;
		if (req.query.page) {
			page = req.query.page;
		}

		var condition = {
			url: {
				$ne: '/'
			}
		};
		if (req.query.parentId) {
			condition.parentId = new ObjectId(req.query.parentId);
		} else {
			condition.levelId = '1';
		}
		var application = req.query.application;
		Logger.logger().log('debug', 'application: %s', application);
		if (application) {
			condition.application = application;
		}
		Menu.paginate(condition, page, 10, function(err, pageCount, menus) {
			if (err) {
				console.log(err);
				return next(err);
			}
			var list = [];
			for (var i = 0, l = menus.length; i < l; i++) {
				var item = JSON.parse(JSON.stringify(menus[i]));
				item.subs = {
					count: menus[i].subs.count
				};
				list.push(item);
			}
			var model = {
				title: '菜单列表',
				isAdmin: true,
				menus: list,
				page: page,
				pageCount: pageCount,
				clients: clientHelper.getClients(),
				showMessage: req.flash('showMessage')
			};
			model.view = 'system.menu.index';
			res.json(_.extend(model, res.locals.menuInit));
		}, {
			sortBy: {
				sortKey: 1
			}
		});
	});

	app.get('/add', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var model = {};
		model.menu = {
			levelId: '1'
		};
		model.title = '新增一级菜单';
		model.parent = {
			url: '/',
			fullUrl: '/'
		};
		model.clients = clientHelper.getClients();
		model.view = 'system.menu.add';
		res.json(model);
	});
	app.post('/add', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		//找到根菜单
		var menu = req.body.menu;
		Menu.findOne({
			url: '/'
		}, function(err, root) {
			if (err) {
				return next(err);
			}
			if (!root) {
				var model = {
					err : '菜单的根节点还没有建立，请联系管理员！',
					menu: menu,
					parent: {
						url: '/',
						fullUrl: '/'
					}
				};
				return res.json(model);
			}
			var parent = root;
			var menuModel = new Menu(menu);
			menuModel.parentId = parent.id;
			menuModel.parentUrl = parent.url;
			menuModel.application = 'ip';
			menuModel.fullUrl = menuModel.url
			menuModel.save(function(err) {
				if (err) {
					var model = {
						err: err,
						menu: menu,
						parent: parent
					};
					return res.json(model);
				}
				var model = {
					showMessage : '创建成功',
					redirect: '/system/menus'
				}
				res.json(model);
				//rebuild菜单树结构，在返回页面后执行
				Menu.rebuildTree(root, 1, function() {
					//console.log('rebuild tree for % sucess', root.url);
					Logger.debug('rebuild tree for % sucess', root.url);
					//刷新菜单树缓存
					menuHelper.refresh();
				});
			});
		});
	});

	app.get('/:parentId/addSub', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var parentId = req.params.parentId;
		Menu.findById(new ObjectId(parentId), 'fullUrl url levelId', function(err, parent) {
			if (err) {
				return next(err);
			}
			var model = {
				title: '新增菜单',
				isAdmin: true,
				menu: {
					levelId: (new Number(parent.levelId) + 1).toString()
				},
				parent: parent
			};
			Logger.logger().log('model:%s', JSON.stringify(model));
			model.view = 'system.menu.addSub';
			res.json(model);
		});
	});
	app.post('/:parentId/addSubMenu', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var parentId = req.params.parentId;
		Logger.logger().log('parentId: %s', "parentId: %s".parentId);
		Menu.findById(new Object(parentId), function(err, parent) {
			var menuInput = req.body.menu;
			menuInput.parentId = parent.id;
			menuInput.parentUrl = parent.fullUrl;
			var menuModel = new Menu(menuInput);
			menuModel.save(function(err, menu) {
				if (err) {
					var model = {
						menu: menuInput,
						parent: parent
					};
					res.locals.err = err;
					res.locals.view = 'system/menus/addSub';
					res.locals.model = model;
					return next(); //调用下一个错误处理middlewear
				}
				var model = {
					showMessage : '创建成功',
					redirect: '/system/menus?parentId=' + parent.parentId
				}
				res.json(model);
				Menu.rebuildTree(parent, parent.lft, function() {
					//console.log('rebuild tree for % sucess', parent.url);
					//Logger.debug('rebuild tree for % sucess', parent.url);
					Logger.logger().log('debug', 'rebuild tree for % sucess', parent.url);
					//刷新菜单树缓存
					menuHelper.refresh();
				});
			});
		});
	});


	app.get('/:id/edit', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var id = req.params.id;
		//console.log(id);
		Logger.debug('id', id);
		Menu.findById(new ObjectId(id), function(err, menu) {
			if (err) {
				return next(err);
			}
			Menu.findById(menu.parentId, 'fullUrl', function(err, parent) {
				if (err) {
					return next(err);
				}
				if (!parent) {
					parent = {
						url: '/',
						fullUrl: '/'
					};
				}
				var model = {
					title: '编辑菜单信息',
					isAdmin: true,
					menu: menu,
					parent: parent,
					showMessage: req.flash('showMessage')
				};
				if (parent.fullUrl === '/') {
					model.clients = clientHelper.getClients();
				}
				model.view = 'system.menu.edit';
				res.json(model);
			});
		});
	});
	app.post('/:id/edit', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var id = req.params.id;
		var newMenu = req.body.menu;
		Menu.findByIdAndUpdate(new ObjectId(id), newMenu, function(err, menu) {
			if (err) {
				newMenu.id = id;
				var model = {
					err: err,
					menu: newMenu,
					parent: req.body.parent
				};
				return res.json(model);
			}
			//console.log(menu);
			Logger.debug('menu', menu);
			var model = {
				showMessage : '更新成功',
				redirect: '/system/menus/' + menu.id + '/edit'
			}
			res.json(model);
			//刷新菜单树缓存
			menuHelper.refresh();
		});
	});

	app.get('/:id/down', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var page = 1;
		if (req.query.page) {
			page = req.query.page;
		}
		var id = req.params.id;
		Menu.findById(new ObjectId(id), function(err, menu) {
			if (err) {
				return next(err)
			}
			var condition = {
				lft: {
					$gt: menu.lft
				},
				rgt: {
					$lt: menu.rgt
				}
			};
			condition.levelId = (new Number(menu.levelId) + 1).toString();
			Menu.paginate(condition, page, 10, function(err, pageCount, menus) {
				var model = {
					title: '菜单列表',
					isAdmin: true,
					menus: menus,
					page: page,
					pageCount: pageCount,
					showMessage: req.flash('showMessage')
				};
				model.view = 'system.menu.index';
				res.json(model);
			}, {
				sortBy: {
					sortKey: 1
				}
			});
		});
	});

	app.get('/:id/up', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var page = 1;
		if (req.query.page) {
			page = req.query.page;
		}
		var id = req.params.id;
		Menu.findById(new ObjectId(id), function(err, menu) {
			if (err) {
				return next(err)
			}
			res.json({
				redirect: '/system/menus?parentId=' + menu.parentId
			})
		});
	});

	app.get('/return', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var id = req.query.id;
		Menu.findById(new ObjectId(id), 'parentId', function(err, menu) {
			if (err) {
				return next(err);
			}
			res.json({redirect:'/system/menus?parentId=' + menu.parentId});
		});
	});

	app.get('/:id/delete', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var id = req.params.id;
		Menu.findById(new ObjectId(id), function(err, menu) {
			if (err) {
				return next(err);
			}
			Menu.findById(menu.parentId, function(err, parent) {
				if (err) {
					return err;
				}
				Menu.remove({
					lft: {
						$gt: menu.lft
					},
					rgt: {
						$lt: menu.rgt
					},
					parentId: {
						$ne: menu.parentId
					}
				}, function(err) {
					if (err) {
						return next(err);
					}
					menu.remove(function(err, menu) {
						if (err) {
							return next(err);
						}
						res.json({
							message: 'OK'
						});
						Menu.rebuildTree(parent, parent.lft, function() {
							//console.log('rebuild tree for % sucess', parent.url);
							Logger.logger().log('debug', 'rebuild tree for % sucess', parent.url);
							//刷新菜单树缓存
							menuHelper.refresh();
						});
					});
				});
			});
		});
	});
};