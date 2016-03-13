/**
 * Module that will handle our authentication tasks
 */
'use strict';

var User = require('../models/system/User'),
    LocalStrategy = require('passport-local').Strategy;
var menuHelper = require('./menuHelper');

var User = require('../models/system/User');

var auditHelper = require('../lib/auditHelper');
var Logger = require('../lib/logger');
var _expire = 90;
var util = require('util');
exports.config = function(config) {
    _expire = config.expire;
};


/**
 * A helper method to retrieve a user from a local DB and ensure that the provided password matches.
 * @param req
 * @param res
 * @param next
 */
exports.localStrategy = function() {

    return new LocalStrategy(function(username, password, done) {

        //Retrieve the user from the database by login
        User.findOne({
            'name': username
        }).exec(function(err, user) {

            //If something weird happens, abort.
            if (err) {
                return done(err);
            }

            //If we couldn't find a matching user, flash a message explaining what happened
            if (!user) {
                return done(null, false, {
                    message: '用户不存在'
                });
            }
            console.log(JSON.stringify(user));
            //Make sure that the provided password matches what's in the DB.
            if (!user.validPassword(password)) {
                return done(null, false, {
                    message: 'Oops! 错误的密码'
                });
            }

            //If everything passes, return the retrieved user object.
            done(null, user);

        });
    });
};


/**
 * A helper method to retrieve a user from a local DB and ensure that the provided password matches.
 * @param req
 * @param res
 * @param next
 */
exports.localSignup = function() {
    return new LocalStrategy(function(username, password, done) {
        User.findOne({
            'name': username
        }, function(err, user) {
            // if there are any errors, return the error
            if (err) {
                return done(err);
            }
            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, {
                    message: '该用户名已经被注册了'
                });
            } else {

                // if there is no user with that email
                // create the user
                var newUser = new User();
                // set the user's local credentials
                newUser.name = username;
                newUser.password = password;
                newUser.roles = ['ROLE_USER'];
                // save the user
                newUser.save(function(err) {
                    if (err) {
                        throw err;
                    }
                    return done(null, newUser);
                });
            }
        });
    });

};



/**
 * A helper method to determine if a user has been authenticated, and if they have the right role.
 * If the user is not known, redirect to the login page. If the role doesn't match, show a 403 page.
 * @param role The role that a user should have to pass authentication.
 */
exports.isAuthenticated = function(roles) {

    return function(req, res, next) {

        if (!req.isAuthenticated()) {

            //If the user is not authorized, save the location that was being accessed so we can redirect afterwards.
            req.session.goingTo = req.originalUrl;
            res.redirect('/login');
            return;
        }

        //If a role was specified, make sure that the user has it.
        var hasRole = false;
        var user = req.user;
        if (req.originalUrl.indexOf('resetPass') < 0 && (user.audit.passwdModifiedAt || user.createdAt) < new Date(new Date().getTime() - (86400 * 1000 * _expire))) {
            res.status(401);
            res.locals.authErrorTitle = '密码过期'
            res.locals.authErrorMessage = '您的密码已经过期'
            res.render('errors/409');
            return;
        }
        if (roles) {
            // console.log(roles);
            Logger.debug('roles', roles);
            for (var i = 0, l = user.roles.length; i < l; i++) {
                if (roles.indexOf(user.roles[i]) >= 0) {
                    hasRole = true;
                    break;
                }
            }
            if (!hasRole) {
                res.status(401);
                res.locals.authErrorTitle = '没有授权'
                res.locals.authErrorMessage = '您没有权限访问本页面，请联系系统管理员'
                return res.render('errors/401');
            }
        }
        next();
    };
};

/**
 * A helper method to add the user to the response context so we don't have to manually do it.
 * @param req
 * @param res
 * @param next
 */
exports.injectUser = function() {
    return function(req, res, next) {
        if (req.isAuthenticated()) {
            var user = req.user;
            res.locals.logedInUser = user;

            auditHelper.login(user._id);

            if (req.session.roleMenuTree) {
                res.locals.roleMenuTree = req.session.roleMenuTree;
                return next();
            } else {
                menuHelper.getRoleMenuTree('ip', user.roles, function(err, menuTree) {
                    req.session.roleMenuTree = menuTree;
                    res.locals.roleMenuTree = menuTree;
                    return next();
                });
            }
        } else {
            return next();
        }
    }
};

exports.branchCondition = function(condition, user, field) {
    var oprBranches = user.oprBranches;
    var branch = user.branch;
    if (oprBranches.indexOf('ALL') >= 0) {
        return;
    }

    var str = oprBranches.toString();
    str = str.replace(/,/g, '|');
    var reg = new RegExp(str, 'i');
    condition[field] = reg;
};

exports.branchConditionForParents = function(condition, oprBranches, field) {
    var str = '';
    for (var i = 0; i < oprBranches.length; i++) {
        if (str.indexOf(oprBranches[i].parent) < 0) {
            if (i != 0) {
                str += ',';
            }
            str += oprBranches[i].parent;
        }

    }
    str = str.replace(/,/g, '|');
    var reg = new RegExp(str, 'i');
    //console.log(reg);
    Logger.debug('reg', reg);
    condition[field] = reg;
}

