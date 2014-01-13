/**
 * Created by liu.xing on 14-1-11.
 *
 * Initialize the application
 */
var redis  = require("redis");



module.exports = Config;
/**
 *
 * @param {Express} app
 * @constructor
 */
function Config (app) {

    console.log("Attempt to load from config.json")
    try {
        var config = require('./config.json');
        console.log('Loaded from config.json %j', config);
    } catch (err) {
        console.log("Failed to load file config.json %j", err);
    }
    var redisClient = configRedis(config);
    app.set('config', config);
    app.set('redisClient', redisClient);
    //app.set('liux', 'hello world');
}
function configRedis(config){
    var redisClient = redis.createClient(config.redis.port, config.redis.url);

    redisClient
        .on('error', function(err) {
            console.log('Error connecting to redis %j', err);
        }).on('connect', function() {
            console.log('Connected to redis.');
        }).on('ready', function() {
            console.log('Redis client ready.');
        });

    redisClient.auth(config.redis.auth);
    return redisClient;
}