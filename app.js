/**
 *
 * @type {exports|*}
 */
var express = require('express');
var app = exports.app = express();
var log4js = require('log4js');
require('./config/init')(app);

log4js.configure({
    appenders: [
        {
            type: "file",
            maxLogSize: 1024,
            filename: 'logs/access.log',
            backups:3,
            category: [ 'cheese','console' ]
        },
        {
            type: "console"
        }
    ],
    replaceConsole: true
});
app.use(log4js.connectLogger(log4js.getLogger('normal'), {level:'auto', format:':method :url'}));
exports.logger=function(name){
    var logger = log4js.getLogger(name);
    logger.setLevel('INFO');
    return logger;
}

require('./socket/obdSocket')(app);
process.on('uncaughtException', function(err){
    console.error('Exception: ' + err.stack);
});