/**
 *
 * @type {exports|*}
 */
var express = require('express');

/*
 * Create and config server
 */

var app = exports.app = express();
require('./config/init')(app);

require('./socket/obdSocket')(app);




/*
 * Catch uncaught exceptions
 */

process.on('uncaughtException', function(err){
    console.log('Exception: ' + err.stack);
});