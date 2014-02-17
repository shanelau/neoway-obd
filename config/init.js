/**
 * Created by liu.xing on 14-1-11.
 *
 * Initialize the application
 */
var db = require('../config/db').redisClient;

module.exports = function (app) {
    try {
        var config = require('./config.json');
    } catch (err) {
        console.log("Failed to load file config.json %j", err);
    }
    app.set('config', config);
}

