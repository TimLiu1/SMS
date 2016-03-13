"use strict";
var BaseDataType = require('../../../models/system/BaseDataType');
var BaseInfo = require('../../../models/system/BaseInfo');
var menuHelper = require('../../../lib/menuHelper');
var clientHelper = require('../../../lib/clientHelper');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var auth = require('../../../lib/auth');
var Logger = require('../../../lib/logger');
var _ = require('underscore');
var async = require('async');
module.exports = function(router) {
	router.get('/', function(req, res, next) {
		var model = {
			view: 'system.data.base'
		};
		res.json(_.extend(model, res.locals.menuInit));
	});
	router.get('/getBase', auth.isAuthenticated(''), function(req, res, next) {
		async.series([
				function(callback) {
					BaseDataType.find({}, function(err, items) {
						if (err) {
							Logger.error('获取BaseDataType基础信息出错');
							return callback(null, []);
						}
						callback(null, items);
					});

				},
				function(callback) {
					BaseInfo.find({}, function(err, items) {
						if (err) {
							Logger.error('获取BaseInfo基础信息出错');
							return callback(null, []);
						}
						callback(null, items);
					});
				}
			],
			// optional callback
			function(err, results) {
				var model = {};
				model.baseDataType = results[0];
				model.baseInfos = results[1];
				res.json(model);
			});
	});

	router.post('/baseDataType/new', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var baseDataType = req.body.baseDataType;
		var baseDataTypeModel = new BaseDataType(baseDataType);
		baseDataTypeModel.save(function(err) {
			var model = {
				message: 'ok'
			};
			if (err) {
				model.err = err;
				return res.json(model);
			}
			model.showMessage = '创建成功',
			model.redirect = '/system/data';
			res.json(model);
		})
	});

    router.get('/baseDataType/:key/delete', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
        var key = req.params.key;

        BaseDataType.findOneAndRemove({
                key: key
            }, function(err) {
                var model = {
                    message: 'ok'
                };
                if (err) {
                	model.err = err;
                    return res.json(model);
                }
                res.json(model);
            })
            //todo:该数据类型的所有数据信息也同时删除
    });

    router.get('/baseInfo/baseDataType/:baseDataType/', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
        var baseDataType = req.params.baseDataType;

        BaseInfo.find({
            baseDataType: baseDataType
        }).sort('code').select('code name').exec(function(err, baseInfos) {
            var model = {
                message: 'ok',
                baseInfos: baseInfos
            };
            if (err) {
                model.err = err.toString();
                return res.json(model);
            }
            res.json(model);
        });
    });

    router.post('/baseInfo/baseDataType/:baseDataType/newInfo', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
        var baseDataType = req.params.baseDataType;
        var baseInfo = req.body.baseInfo;
        baseInfo.baseDataType = baseDataType;
        var model = {
            message: 'ok'
        };

        var baseInfoModel = new BaseInfo(baseInfo);

        baseInfoModel.save(function(err) {
            if (err) {
                model.err = err.toString();
                return res.json(model);
            }
            BaseInfo.find({
                baseDataType: baseDataType
            }).sort('code').select('code name').exec(function(err, baseInfos) {
                model.baseInfos = baseInfos;
                if (err) {
                    model.err = err.toString();
                }
                res.json(model);
            });
        });
    });
    router.get('/baseInfo/baseDataType/:baseDataType/code/:code/remove', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
        var baseDataType = req.params.baseDataType;
        var code = req.params.code;
        var model = {
            message: 'ok'
        };
        BaseInfo.findOneAndRemove({
            code: code,
            baseDataType: baseDataType
        }, function(err) {
            if (err) {
                model.err = err.toString();
                return res.json(model);
            }
            BaseInfo.find({
                baseDataType: baseDataType
            }).sort('code').select('code name').exec(function(err, baseInfos) {
                var model = {
                    message: 'ok',
                    baseInfos: baseInfos
                };
                if (err) {
                    model.err = err.toString();
                }
                res.json(model);
            });
        });
    });

    router.get('/baseInfo/baseDataType/:baseDataType/code/:code/values', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
        var baseDataType = req.params.baseDataType;
        var code = req.params.code;
        var model = {
            message: 'ok'
        };
        BaseInfo.findOne({
            code: code,
            baseDataType: baseDataType
        }).select('values').exec(function(err, infos) {
            if (err) {
                model.err = err.toString();
                return res.json(model);
            }
            model.baseInfoValues = infos.values;
            res.json(model);
        })
    });

    router.post('/baseInfo/baseDataType/:baseDataType/code/:code/values/new', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
        var baseDataType = req.params.baseDataType;
        var code = req.params.code;
        var value = req.body.value;
        var model = {
            message: 'ok'
        };
        BaseInfo.findOneAndUpdate({
            code: code,
            baseDataType: baseDataType
        }, {
            $addToSet: {
                values: value
            }
        }, function(err) {
            if (err) {
                model.err = err.toString();
                return res.json(model);
            }
            BaseInfo.findOne({
                code: code,
                baseDataType: baseDataType
            }).select('values').exec(function(err, infos) {
                if (err) {
                    model.err = err.toString();
                    return res.json(model);
                }
                model.baseInfoValues = infos.values;
                res.json(model);
            })
        });
    });

    router.get('/baseInfo/baseDataType/:baseDataType/code/:code/value/:value/remove', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
        var baseDataType = req.params.baseDataType;
        var code = req.params.code;
        var key = req.params.value;
        var model = {
            message: 'ok'
        };

        BaseInfo.findOneAndUpdate({
            code: code,
            baseDataType: baseDataType
        }, {
            $pull: {
                values: {
                    key: key
                }
            }
        }, function(err) {
            if (err) {
                model.err = err.toString();
                return res.json(model);
            }
            BaseInfo.findOne({
                code: code,
                baseDataType: baseDataType
            }).select('values').exec(function(err, infos) {
                if (err) {
                    model.err = err.toString();
                    return res.json(model);
                }
                model.baseInfoValues = infos.values;
                res.json(model);
            })
        });

    });

};