// "use strict";
// var Branch = require('../../../models/system/Branch');
// var BranchCounter = require('../../../models/system/BranchCounter');
// var baseCode = require('../../../lib/baseCode');
// var mongoose = require('mongoose');
// var ObjectId = mongoose.Types.ObjectId;
// var auth = require('../../../lib/auth');
// var csv = require('fast-csv');
// var fs = require('fs');
// var iconv = require('iconv-lite');
// var async = require('async');
// var branchHelper= require('../../../lib/branchHelper');
// var Logger = require('../../../lib/logger');
// module.exports = function(app) {
// 	app.get('/',function(req, res, next) {
// 		var page = 1;
// 		if (req.query.page) {
// 			page = req.query.page;
// 		}

// 		var condition = {};
//                               /////////

//                               var con = req.query.condition;                              /////////

//                               if(!con){
//                                     condition={parent:'top'};
//                               }else{
//                                   if(con['name']){
//                                        condition['name']={
//                                             $regex:con['name'],
//                                             $options:'i'
//                                        };
//                                   }
//                               }
//                               console.log("condition is "+ condition);
//                               auth.branchCondition(condition, req.user, 'code');

//                               var parent=req.query.parent;
//                               if(parent){
//                                              condition['parent']=parent;
//                               }
//                               ///
// 		//查询各个总公司
//                               console.log("condition is "+ condition);
// 		Branch.paginate(condition, page, 10, function(err, pageCount, branches) {
// 			if (err) {
// 				return next(err);
// 			}
// 			var model = {
// 				title: '机构列表',
// 				isAdmin: true,
// 				branches: branches,
// 				page: page,
// 				pageCount: pageCount,
// 				condition: con,
// 				showMessage: req.flash('showMessage')
// 			};
// 			res.render('system/branches/index', model);
// 		}, {
// 			sortBy: {
// 				code: 1
// 			}
// 		});
// 	});

// 	app.get('/add', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
// 		var model = {};
// 		model.branch = {
// 			levelId: '0'
// 		};
// 		res.render('system/branches/add', model);
// 	});
// 	app.post('/add', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
// 		var branchInput = req.body.branch;
// 		branchInput.parent = 'top';
// 		branchInput.status = '1';
// 		var branchModel = new Branch(branchInput);
// 		var accountNo = req.body.accountNo
// 		if (accountNo) {
// 			branchModel.receiveAccount = {
// 				accountNo: accountNo.replace(/ /g, ''),
// 				bankPayType: req.body.bankPayType,
// 				cardType: req.body.cardType,
// 				payeeBankAccountName: req.body.payeeBankAccountName,
// 				payeeBankCode: req.body.payeeBankCode,
// 				bankBranchName: req.body.bankBranchName,
// 				payeeRelateCode: req.body.payeeRelateCode,
// 				payeeBankName: req.body.payeeBankName,
// 				payeeBankCityCode: req.body.payeeBankCityCode,
// 				bankBranchCode: req.body.bankBranchCode,
// 				payeeMobile: req.body.payeeMobile
// 			};
// 		}
// 		branchModel.save(function(err, branch) {
// 			if (err) {
// 				var model = {
// 					branch: branchInput
// 				};
// 				res.locals.err = err;
// 				res.locals.view = 'system/branches/add';
// 				res.locals.model = model;
// 				//console.log(err);
// 				Logger.error('err', err);
// 				next(); //调用下一个错误处理middlewear
// 			} else {
// 				req.flash('showMessage', '创建成功');
//                 branchHelper.refresh();
// 				res.redirect('/system/branches');
// 			}
// 		});
// 	});
// 	app.get('/:parentId/addSub', auth.isAuthenticated('ROLE_ADMIN, ROLE_BRANCH_ADMIN'), function(req, res, next) {
// 		var parentId = req.params.parentId;
// 		Branch.findById(new ObjectId(parentId), 'name code levelId typeId', function(err, parent) {
// 			if (err) {
// 				return next(err);
// 			}
// 			var model = {
// 				title: '新增机构',
// 				isAdmin: true,
// 				branch: {
// 					levelId: (new Number(parent.levelId) + 1).toString()
// 				},
// 				parent: {
// 					abbrName: parent.name + '-' + parent.code,
// 					code: parent.code,
// 					typeId: parent.typeId,
// 					id: parent.id
// 				}
// 			};
// 			res.render('system/branches/addSub', model);
// 		});
// 	});

// 	app.post('/:parentId/addSub', auth.isAuthenticated('ROLE_ADMIN, ROLE_BRANCH_ADMIN'), function(req, res, next) {
// 		var parentId = req.params.parentId;
// 		var parent = req.body.parent;
// 		parent.id = parentId;
// 		var branchInput = req.body.branch;
// 		branchInput.parent = parent.code;
// 		branchInput.typeId = parent.typeId;
// 		//添加其它信息省略
// 		//...
// 		BranchCounter.getNextSeq(parent.code, branchInput.levelId, function(err, nextSeq) {
// 			if (err) {
// 				return next(err);
// 			} else {
// 				branchInput.code = parent.code + nextSeq;
// 				var branchModel = new Branch(branchInput);
// 				var accountNo = req.body.accountNo
// 				if (accountNo) {
// 					branchModel.receiveAccount = {
// 						accountNo: accountNo.replace(/ /g, ''),
// 						bankPayType: req.body.bankPayType,
// 						cardType: req.body.cardType,
// 						payeeBankAccountName: req.body.payeeBankAccountName,
// 						payeeBankCode: req.body.payeeBankCode,
// 						bankBranchName: req.body.bankBranchName,
// 						payeeRelateCode: req.body.payeeRelateCode,
// 						payeeBankName: req.body.payeeBankName,
// 						payeeBankCityCode: req.body.payeeBankCityCode,
// 						bankBranchCode: req.body.bankBranchCode,
// 						payeeMobile: req.body.payeeMobile
// 					};
// 				}
// 				branchModel.save(function(err, branch) {
// 					if (err) {
// 						var model = {
// 							branch: branchInput,
// 							parent: parent
// 						};
// 						res.locals.err = err;
// 						res.locals.view = 'system/branches/addSub';
// 						res.locals.model = model;
// 						next(); //调用下一个错误处理middlewear
// 					} else {
// 						Branch.findByIdAndUpdate(parentId, {
// 							$inc: {
// 								subs: 1
// 							}
// 						}, function(err, parent) {
// 							if (err) {
// 								next(err);
// 							} else {
//                                 branchHelper.refresh();
// 								req.flash('showMessage', '创建成功');
// 								res.redirect('/system/branches?parent=' + parent.parent);
// 							}
// 						});
// 					}
// 				});
// 			}
// 		});
// 	});

// 	app.get('/:id/edit', auth.isAuthenticated('ROLE_ADMIN, ROLE_BRANCH_ADMIN'), function(req, res, next) {
// 		var id = req.params.id;
// 		Branch.findById(new ObjectId(id), function(err, branch) {
// 			if (err) {
// 				return next(err);
// 			}
// 			Branch.findOne({
// 				code: branch.parent
// 			}, 'abbrName code', function(err, parent) {
// 				//console.log(parent);
// 				Logger.debug('parent', parent);
// 				var model = {
// 					title: '编辑机构信息',
// 					isAdmin: true,
// 					branch: branch,
// 					parent: parent ? parent : branch,
// 					showMessage: req.flash('showMessage')
// 				};
// 				if (branch.receiveAccount && branch.receiveAccount.accountNo) {
// 					model.accountInfo = branch.receiveAccount;
// 				}
// 				res.render('system/branches/edit', model);
// 			});
// 		});
// 	});
// 	app.post('/:id/edit', auth.isAuthenticated('ROLE_ADMIN, ROLE_BRANCH_ADMIN'), function(req, res, next) {
// 		var id = req.params.id;
// 		Branch.findOne({
// 			_id: new ObjectId(id)
// 		}, function(err, branch) {
// 			if (!err) {
// 				var newBranch = req.body.branch;
// 				for (var o in newBranch) {
// 					branch[o] = newBranch[o];
// 				}
// 				var accountNo = req.body.accountNo
// 				if (accountNo) {
// 					branch.receiveAccount = {
// 						accountNo: accountNo.replace(/ /g, ''),
// 						bankPayType: req.body.bankPayType,
// 						cardType: req.body.cardType,
// 						payeeBankAccountName: req.body.payeeBankAccountName,
// 						payeeBankCode: req.body.payeeBankCode,
// 						bankBranchName: req.body.bankBranchName,
// 						payeeRelateCode: req.body.payeeRelateCode,
// 						payeeBankName: req.body.payeeBankName,
// 						payeeBankCityCode: req.body.payeeBankCityCode,
// 						bankBranchCode: req.body.bankBranchCode,
// 						payeeMobile: req.body.payeeMobile
// 					};
// 				}
// 				branch.save(function(err, branch) {
// 					if (err) {
// 						newBranch.id = id;
// 						var model = {
// 							branch: newBranch,
// 							parent: {
// 								id: req.body.parentId,
// 								abbrName: req.body.parentAbbr
// 							}
// 						};
// 						res.locals.err = err;
// 						res.locals.view = 'system/branches/edit';
// 						res.locals.model = model;
// 						//console.log(err);
// 						Logger.error('err', err);
// 						next(); //调用下一个错误处理middlewear
// 					} else {
// 						req.flash('showMessage', '修改成功');
// 						res.redirect('/system/branches/' + branch.id + '/edit');
// 					}
// 				});
// 			}
// 		});
// 	});
// 	app.get('/:id/down', auth.isAuthenticated('ROLE_ADMIN, ROLE_BRANCH_ADMIN'), function(req, res, next) {
// 		var page = 1;
// 		if (req.query.page) {
// 			page = req.query.page;
// 		}
// 		var id = req.params.id;
// 		Branch.findOne({
// 			_id: new ObjectId(id)
// 		}, function(err, branch) {
// 			if (err) {
// 				next(err)
// 			} else {
// 				var condition = {};
// 				condition.parent = branch.code;
// 				condition.levelId = (new Number(branch.levelId) + 1).toString();
// 				Branch.paginate(condition, page, 10, function(err, pageCount, branches) {
// 					var model = {
// 						title: '机构列表',
// 						isAdmin: true,
// 						branches: branches,
// 						page: page,
// 						pageCount: pageCount,
// 						pageUrl: '/system/branches/' + id + '/down',
// 						showMessage: req.flash('showMessage')
// 					};
// 					res.render('system/branches/index', model);
// 				}, {
// 					sortBy: {
// 						code: 1
// 					}
// 				});
// 			}
// 		});
// 	});
// 	app.get('/:id/up', auth.isAuthenticated('ROLE_ADMIN, ROLE_BRANCH_ADMIN'), function(req, res, next) {
// 		var page = 1;
// 		if (req.query.page) {
// 			page = req.query.page;
// 		}
// 		var id = req.params.id;
// 		Branch.findById(new ObjectId(id), function(err, branch) {
// 			if (err) {
// 				return next(err)
// 			}
// 			Branch.findOne({
// 				code: branch.parent
// 			}, function(err, parent) {
// 				if (err) {
// 					return next(err)
// 				}
// 				res.redirect('/system/branches?parent=' + parent.parent);
// 			});
// 		});
// 	});

// 	app.get('/return', auth.isAuthenticated('ROLE_ADMIN, ROLE_BRANCH_ADMIN'), function(req, res, next) {
// 		var id = req.query.id;
// 		//console.log(id);
// 		Logger.debug('id', id);
// 		Branch.findById(new ObjectId(id), 'parent', function(err, branch) {
// 			if (err) {
// 				return next(err);
// 			}
// 			res.redirect('/system/branches?parent=' + branch.parent);
// 		});
// 	});
// 	app.get('/:id/delete', auth.isAuthenticated('ROLE_ADMIN, ROLE_BRANCH_ADMIN'), function(req, res, next) {
// 		var id = req.params.id;
// 		//console.log(id);
// 		Logger.debug('id', id);
// 		Branch.findById(new ObjectId(id), function(err, branch) {
// 			if (err) {
// 				return next(err);
// 			}
// 			//从parent的subs中删掉
// 			Branch.findOneAndUpdate({
// 				code: branch.parent
// 			}, {
// 				$inc: {
// 					subs: -1
// 				}
// 			}, function(err, parent) {
// 				if (err) {
// 					return next(err);
// 				}
// 				//删除子节点
// 				Branch.remove({
// 					code: new RegExp('^' + branch.code)
// 				}, function(err) {
// 					if (err) {
// 						return next(err);
// 					}
// 					//删除自身
// 					branch.remove(function(err) {
// 						if (err) {
// 							return next(err);
// 						}
// 						res.json({
// 							message: 'OK'
// 						});
// 					});
// 				});
// 			});
// 		});
// 	});


// 	app.get('/getBranches', auth.isAuthenticated('ROLE_ADMIN, ROLE_BRANCH_ADMIN'), function(req, res, next) {
// 		var level = req.query.level;
// 		var parent = req.query.parent;
// 		var condition = {};
// 		if (level) {
// 			condition.levelId = level;
// 		}
// 		if (parent) {
// 			condition.parent = parent;
// 		}
// 		auth.branchCondition(condition, req.user, 'code');
// 		Branch.find(condition).
// 		select('code name').
// 		sort('code').
// 		exec(function(err, branches) {
// 			if (err) {
// 				return next(err);
// 			}
// 			res.json({
// 				message: 'ok',
// 				branches: branches
// 			});
// 		});
// 	});

// 	app.post('/:id/upload', auth.isAuthenticated('ROLE_ADMIN, ROLE_BRANCH_ADMIN'), function(req, res, next) {
// 		var id = req.params.id;
// 		var files = req.files;

// 		var model = {
// 			message: '上载成功！',
// 			messageType: 'OK'
// 		};

// 		if (files && files.uploadFile) {
// 			var fileName = files.uploadFile.name;
// 			var stream = fs.createReadStream(files.uploadFile.path);
// 			var datas = [];
// 			var i = fileName.lastIndexOf('.');
// 			if (fileName.substr(i) != '.csv') {
// 				model.message = '请选择.csv文件！';
// 				model.messageType = 'warning';
// 			} else {
// 				Branch.findById(id, function(err, parent) {
// 					if (err) {
// 						return next(err);
// 					}
// 					var csvStream = csv({
// 							headers: true
// 						})
// 						.on("data", function(data) {
// 							data.parent = parent.code;
// 							data.levelId = (Number(parent.levelId) + 1).toString();
// 							data.typeId = parent.typeId;
// 							datas.push(data);
// 							//有可能有数据校验
// 						})
// 						.on("error", function(err) {
// 							//console.log(err);
// 							Logger.error('err',err);
// 						})
// 						.on("end", function() {
// 							var index = 0;
// 							async.eachSeries(datas, function(item, cb) {
// 								BranchCounter.getNextSeq(parent.code, item.levelId, function(err, nextSeq) {
// 									item.code = parent.code + nextSeq;
// 									var branchModel = new Branch(item);
// 									branchModel.save(function(err) {
//                                         branchHelper.refresh();
// 										if (err) {
// 											cb('第' + (index + 1) + '行数据校验出错：' + err + '，请修改数据并重现上载该行及该行以后的数据');
// 										} else {
// 											index++;
// 											cb(null);
// 										}
// 									})
// 								});
// 							}, function(err) {
// 								if (err) {
// 									model.message = '处理出错' + err;
// 									model.messageType = 'warning';
// 								}
// 								Branch.findByIdAndUpdate(parent.id, {
// 									$inc: {
// 										subs: index
// 									}
// 								}, function(err) {
// 									model._csrf = res.locals['_csrf'];
// 									res.json(model);

// 								})

// 							});

// 						});
// 					stream.pipe(iconv.decodeStream('gb2312')).pipe(csvStream);;
// 				});
// 			}

// 		} else {
// 			model.message = '请选择文件！';
// 			model.messageType = 'warning';
// 			res.json(model);
// 		}

// 	});
// };