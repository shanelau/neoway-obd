/**
 * Created by liu.xing on 14-1-24.
 */
var config = require('./config.json');
var redis  = require("redis");

var redisClient = redis.createClient(config.redis.port, config.redis.url);

redisClient
    .on('error', function(err) {
        console.error(err);
    }).on('connect', function() {
        console.log('Connected to redis.');
    }).on('ready', function() {
        console.log('Redis client ready.');
    });
redisClient.auth(config.redis.auth);
exports.redisClient = redisClient;
//redisClient.hexists("location:1",function(e,r){});