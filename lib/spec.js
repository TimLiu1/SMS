'use strict';
var db = require('../lib/database');
var logger = require('../lib/logger');
var cronJob = require('../lib/cronJob');
var passport = require('passport');
var auth = require('../lib/auth');
var User = require('../models/system/User');
var auditHelper = require('../lib/auditHelper');
var cacheHelper = require('../lib/cacheHelper');
var showMenuMiddleware = require('../lib/middlewear/showMenu');
var menuHelper = require('../lib/menuHelper');
var restClient = require('../lib/restClient/restClient');

module.exports = function spec(app) {
    app.on('middleware:after:session', function configPassport(eventargs) {
        passport.use('local-login', auth.localStrategy());
        passport.serializeUser(function(user, done) {
            done(null, user.id);
        });
        // used to deserialize the user
        passport.deserializeUser(function(id, done) {
            User.findById(id).populate('userInfo').exec(function(err, user) {
                done(err, user);
            });
        });
        app.use(passport.initialize());
        app.use(passport.session());
    });
    app.on('middleware:before:router', function configAfterRouter(eventargs) {
        auditHelper.init();
        menuHelper.refresh();
        app.use(auth.injectUser());
        app.use(showMenuMiddleware());

    });
    app.on('middleware:after:router', function configAfterRouter(eventargs) {

    });
    return {
        onconfig: function(config, next) {

            //初始化数据库连接
            var dbConfig = config.get('databaseConfig');
            db.config(dbConfig);

            //配置日志级别
            logger.init(config.get('loggerLevel'));

            var cacheConfig = config.get('cacheConfig');
            cacheHelper.config(cacheConfig);

            //初始化定时任务
            var cronConfig = config.get('cronConfig');
            cronJob.configJob(cronConfig);

            //初始化rest client
            restClient.config(config.get('restUrl'));

            next(null, config);
        }
    };

};
