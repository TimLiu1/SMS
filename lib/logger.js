var winston = require('winston');
var lg = function() {
    var _logger = null;
    return {
        init: function(loggerLevel) {
            console.log('logger level = %s', loggerLevel);

            _logger = new(winston.Logger)({
                transports: [
                    new(winston.transports.Console)({
                        level: loggerLevel
                    })
                ]
            });
        },
        debug: function(message, object) {
            if (object) {
                _logger.log('debug', message, object);
            } else {
                _logger.log('debug', message);
            }
        },
        log: function(message, object) {
            if (object) {
                _logger.log('debug', message, object);
            } else {
                _logger.log('debug', message);
            }
        },
        info: function(message, object) {
            if (object) {
                _logger.log('info', message, object);
            } else {
                _logger.log('info', message);
            }
        },
        warn: function(message, object) {
            if (object) {
                _logger.log('warn', message, object);
            } else {
                _logger.log('warn', message);
            }
        },
        error: function(message, object) {
            if (object) {
                _logger.log('error', message, object);
            } else {
                _logger.log('error', message);
            }
        },
        logger: function() {
            return _logger;
        }
    }
};

module.exports = lg();