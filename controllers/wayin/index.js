var auth = require('../../lib/auth');
var Party = require('../../models/Party');
var Plan = require('../../models/Plan');
var firstpage = require('../../models/firstpage');
var Special = require('../../models/Special');
var News = require('../../models/News');
var Notice = require('../../models/Notice');
var _ = require('underscore');
var Logger = require('../../lib/logger');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var NodeRSA = require('node-rsa');
var crypto = require('crypto');

module.exports = function(router) {
    var roleList = ['ROLE_ADMIN'];

    router.get('/', auth.isAuthenticated(roleList), function (req, res, next) {
        var model = {
            redirect: '/wayin/index'
        };
        res.json(model);
    });


    router.get('/index', auth.isAuthenticated(roleList), function(req, res, next) {

        Special.find({}, function(err, specials) {
            var model = {
                specials: specials
            }
            Notice.find({},function (err, notices) {
                model.notices = notices;
                News.find({}, function (err,news) {
                    model.news = news
                    model.view = 'wayin.index';
                    res.json(_.extend(model, res.locals.menuInit));
                })
            });
        });
    });

    router.get('/special', auth.isAuthenticated(roleList), function(req, res, next) {
        var page = 1;
        var id=req.query.id;
        Special.findById(id, function(err,items) {
            console.log("are you coming")
            var model = {
                items:items
            }
            model.view = 'wayin.special';
            res.json(_.extend(model, res.locals.menuInit));
        })
        });
    router.get('/:id/info', auth.isAuthenticated(roleList), function(req, res, next) {
        var id = req.params.id;
        var model = {
            message: 'ok'
        };

            News.findById(id, function(err, item2) {

                    model.item = item2;

                console.log(model);
                res.json(model);

            })

    });




}
