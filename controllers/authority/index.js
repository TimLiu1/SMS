var auth = require('../../lib/auth');
var Party = require('../../models/Party');
var firstpage = require('../../models/firstpage');
var Classroom = require('../../models/Classroom');
var Audit = require('../../models/Audit');
var Auth = require('../../models/Auth');
var Activityroom = require('../../models/Activityroom');
var Announce = require('../../models/Announce');
var Playground = require('../../models/Playground');
var _ = require('underscore');
var Logger = require('../../lib/logger');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var NodeRSA = require('node-rsa');
var crypto = require('crypto');

module.exports = function(router) {
    var roleList = ['ROLE_ADMIN', 'ROLE_USER'];

    router.get('/', auth.isAuthenticated(roleList), function (req, res, next) {
        console.log("okokokok");
        var model = {
            redirect: '/authority/index'
        };
        res.json(model);
    });

          //响应权限申请请求
    router.get('/index', auth.isAuthenticated(roleList), function (req, res, next) {
        Auth.find({}, function (err,items) {
            if (err) {
                console.log("查询出错");
                return;
            }
            console.log(items)
            var model = {
                items:items,
            };
            model.view = 'authority.index';
            res.json(_.extend(model, res.locals.menuInit));
        });
    });
    router.get('/authTransfer', auth.isAuthenticated(roleList), function (req, res, next) {
        Auth.find({}, function (err,items) {
            if (err) {
                console.log("查询出错");
                return;
            }
            console.log("oooooo")
            var model = {};
            model.view = 'authority.authTransfer';
            res.json(_.extend(model, res.locals.menuInit));
        });
    });

}
