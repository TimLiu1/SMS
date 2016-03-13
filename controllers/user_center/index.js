var auth = require('../../lib/auth');
var Party = require('../../models/Party');
var _ = require('underscore');
var Audit = require('../../models/Audit');
var Logger = require('../../lib/logger');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var NodeRSA = require('node-rsa');
var crypto = require('crypto');

module.exports = function(router) {
    var roleList = ['ROLE_ADMIN','ROLE_USER'];

    router.get('/', auth.isAuthenticated(roleList), function(req, res, next) {
        var model = {
            redirect: '/user_center/index'
        };
        res.json(model);
    });

    router.get('/index', auth.isAuthenticated(roleList), function(req, res, next) {
        var page = 1;
        var condition = {};
        Audit.paginate(condition, page, 10, function (err, pageCount, item) {
            if (err) {
                return res.json({
                    err: err
                });
            }
            var model = {
                title: '接口列表',
                item: item,
                page: page

            };

            model.view = 'user_center.index';
            res.json(_.extend(model, res.locals.menuInit));

        });
    });


};
