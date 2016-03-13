'use strict';

var express = require('express');
var kraken = require('kraken-js');


var options, app;

/*
 * Create and configure application. Also exports application instance for use by tests.
 * See https://github.com/krakenjs/kraken-js#options for additional configuration options.
 */


app = module.exports = express();
options = require('./lib/spec')(app),
app.use(kraken(options));
app.on('start', function () {
    var port = process.env.PORT || app.kraken.get('port');
    app.listen(port, function(err) {
        global.env = app.settings.env;
        global.port = port;
        console.log('[%s] Listening on http://localhost:%d', app.settings.env, port);
    });
});
