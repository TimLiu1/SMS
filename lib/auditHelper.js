'use strict';
var events = require('events');
var util = require('util');
var User = require('../models/system/User');
var Logger = require('./logger');
var Auditer = function() {

};
util.inherits(Auditer, events.EventEmitter);

var auditer = null;

var helper = function() {
    return {
        init: function() {
            Logger.debug('in audit helper');
            auditer = new Auditer();

            auditer.on('userLogin', function(id) {
                Logger.logger().log('debug', 'in audit helper user id:%s', id.toString());
                User.findByIdAndUpdate(id, {
                    $set: {
                        'audit.lastLoginAt': new Date()
                    },
                    $inc: {
                        'audit.loginTimes': 1
                    }
                }, function(err) {
                    if (err) {
                        logger.err('更新用户最后登录日期时发生错误：' + err);
                    }
                })
            });
        },
        login: function(id) {
            auditer.emit('userLogin', id);
        }
    }
}

module.exports = helper();