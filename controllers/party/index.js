var auth = require('../../lib/auth');
var Party = require('../../models/Party');
var _ = require('underscore');
var Logger = require('../../lib/logger');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var NodeRSA = require('node-rsa');
var crypto = require('crypto');

module.exports = function(router) {
	var roleList = 'ROLE_ADMIN';

    router.get('/', auth.isAuthenticated(roleList), function(req, res, next) {
		var model = {
			redirect: '/party/index'
		};
		res.json(model);
	});

    router.get('/index', auth.isAuthenticated(roleList), function(req, res, next) {
		var page = 1;
		if (req.query.page) {
			page = req.query.page;
		}
        var condition = {};
        if(req.query.name){
            condition["name"]=req.query.name;
        }
        if(req.query.branch){
            condition["branch"]=req.query.branch;
        }
        Logger.debug('condition:'+JSON.stringify(condition));
		Party.paginate(condition, page, 10, function(err, pageCount, items) {
			if (err) {
				return res.json({
					err: err
				});
			}
			var model = {
				title: '第三方列表',
				items: items,
				page: page,
				pageCount: pageCount
			};
			model.view = 'party.index';
			res.json(_.extend(model, res.locals.menuInit));
		}, {
			sortBy: {
				name: 1
			}
		});
	});

    /***
     * 更新保存信息
     */
    router.post('/:id/save',auth.isAuthenticated(roleList),function(req,res,next){
		var classroom = req.body.classroom;
		var id = req.params.id;
		console.log(classroom);
		Classroom.findById(id, function(err, item) {
			var model = {
				message: 'ok'
			};
			if (err || !classroom) {
				model.err = '更新出错';
				return res.json(model);
			}
			_.extendOwn(item, classroom);
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

    /**
     * 生成签名串
     */
    router.get('/:id/createSign',auth.isAuthenticated(roleList),function(req,res,next){
        var id = req.params.id;

    });

	router.post('/new', auth.isAuthenticated(roleList), function(req, res, next) {
		var party = req.body.party;
		var partyModel = new Party(party);
		partyModel.save(function(err) {
			var model = {
				message: 'ok'
			};
			if (err) {
				model.err = err;
				return res.json(model);
			}
			var page = 1;
			Party.paginate({}, page, 10, function(err, pageCount, items) {
				if (err) {
					return res.json({
						err: err
					});
				}
				model.title = '第三方列表';
				model.items = items;
				model.page = page;
				model.pageCount = pageCount;
				model.view = 'party.index';
				model.showMessage = '创建成功';
				res.json(model);
			}, {
				sortBy: {
					name: 1
				}
			});
		})
	});

	router.get('/:id/delete', auth.isAuthenticated(roleList), function(req, res, next) {
		var id = req.params.id;
		Party.findByIdAndRemove(id, function(err) {
			var model = {
				message: 'ok'
			};
			if (err) {
				model.err = err;
				return res.json(model);
			}
			var page = 1;
			Party.paginate({}, page, 10, function(err, pageCount, items) {
				if (err) {
					return next(err);
				}

				model.title = '第三方列表';
				model.items = items;
				model.page = page;
				model.pageCount = pageCount;
				model.showMessage = '删除成功';
				res.json(model);
			}, {
				sortBy: {
					name: 1
				}
			});
		})
	});

	router.get('/:id/info', auth.isAuthenticated(roleList), function(req, res, next) {
		var id = req.params.id;
		Party.findById(id).populate('interfaces').exec(function(err, item) {
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
	router.get('/:id/createKeyPair', auth.isAuthenticated(roleList), function(req, res, next) {
		var id = req.params.id;
		var key = new NodeRSA({
			b: 512
		});
		var publicKey = key.exportKey('pkcs1-public');
		var privateKey = key.exportKey('pkcs1');
		Party.findByIdAndUpdate(id, {
			$set: {
				"security.publicKey": publicKey,
				"security.privateKey": privateKey

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
		})
	});
	router.get('/:id/deleteKeyPair', auth.isAuthenticated(roleList), function(req, res, next) {
		var id = req.params.id;
		Party.findByIdAndUpdate(id, {
			$unset: {
				'security.publicKey': '',
				'security.privateKey': 'privateKey'
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
		})
	});
	router.get('/:id/:salt/createKey', auth.isAuthenticated(roleList), function(req, res, next) {
		var id = req.params.id;
		var salt = req.params.salt;
		var hash = crypto.createHash('sha256');
		var key = hash.update(salt).digest('hex');

		Party.findByIdAndUpdate(id, {
			$set: {
				'security.hmacKey': key
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
		})
	});
	router.get('/:id/addInterface/:interface', auth.isAuthenticated(roleList), function(req, res, next) {
		var id = req.params.id;
		var interface = req.params.interface;
		Party.findByIdAndUpdate(id, {
				$addToSet: {
					interfaces: new ObjectId(interface)
				}
			},
			function(err, item) {
				var model = {};
				if (err) {
					model.err = err.toString();
					return res.json(model);
				}
				Party.findById(item.id).populate('interfaces').exec(function(err, newItem) {
					if (err) {
						model.err = err.toString();
						return res.json(model);
					}
					model.item = newItem;
					model.message = '添加成功';
					res.json(model);
				})

			}
		)
	});
	router.get('/:id/deleteInterface/:interface', auth.isAuthenticated(roleList), function(req, res, next) {
		var id = req.params.id;
		var interface = req.params.interface;
		Party.findByIdAndUpdate(id, {
				$pull: {
					interfaces: new ObjectId(interface)
				}
			},
			function(err, item) {
				var model = {};
				if (err) {
					model.err = err.toString();
					return res.json(model);
				}
				Party.findById(item.id).populate('interfaces').exec(function(err, newItem) {
					if (err) {
						model.err = err.toString();
						return res.json(model);
					}
					model.item = newItem;
					model.message = '去除成功';
					res.json(model);
				})

			}
		)
	});
};
