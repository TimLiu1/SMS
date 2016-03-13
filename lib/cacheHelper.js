'use strict';

var redis = require("redis");
var client = null;
var Logger = require('../lib/logger');
var cache = function() {
    return {
        config: function(config) {
            client = redis.createClient(config.port, config.host, config.options);
        },
        put: function(cacheName, key, value, cb) {
            client.hset(cacheName, key, JSON.stringify(value), cb);
        },
        get: function(cacheName, key, cb) {
            client.hget(cacheName, key, function(err, reply) {
                if (err) {
                    return cb(null);
                }
                return cb(JSON.parse(reply));
            });
        },
        clearCache: function(cache, cb) {
            if (cache) {

                Logger.logger().log('debug', '启动时清空%s的缓存', cache);

                client.del(cache, function() {
                    if (typeof cb === 'function') {
                        cb();
                    }
                });
            } else {
                client.keys('*', function(err, keys) {
                    if (!err) {
                        for (var i = 0, l = keys.length; i < l; i++) {
 
                            Logger.logger().log('debug','key:%s',keys[i]);
                            client.del(keys[i], function() {
                                if (typeof cb === 'function') {
                                    cb();
                                }
                            });
                        }
                    }
                });
            }
        }
    }
}
module.exports = cache();