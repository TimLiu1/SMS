/**
 * A custom library to establish a database connection
 */
'use strict';
var mongoose = require('mongoose');
var Logger = require('../lib/logger');
require('mongoose-paginate');
mongoose.Error.messages.general.required = "{PATH}必须录入";
mongoose.Error.messages.String.enum = "{PATH}输入的不是可用值";
mongoose.Error.messages.String.match = "{PATH}输入的值格式不正确";
mongoose.Error.messages.Number.min = "项`{PATH}`的值 ({VALUE}) 不能小于最小值 ({MIN})";
mongoose.Error.messages.Number.max = "项`{PATH}`的值 ({VALUE}) 不能大于最大值 ({MAX})";

var db = function() {
    return {

        /**
         * Open a connection to the database
         * @param conf
         */
        config: function(conf) {
            var uri = '';
            if (global.env === 'production') {
                uri = conf.host;
            } else {
                uri = 'mongodb://' + conf.host + '/' + conf.database;
            }
            var opts = conf.options;

            if (global.env === 'production') {
                opts.db = {
                    save: {
                        j: 1,
                        w: 2
                    }
                };
            }

            mongoose.connect(uri, opts);

            var db = mongoose.connection;
            db.on('error', console.error.bind(console, 'connection error:'));
            db.once('open', function callback() {
                //console.log('db connection open');
                Logger.debug('db connection open');
            });
        }
    };
};

module.exports = db();
