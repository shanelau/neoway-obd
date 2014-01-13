/**
 * Created by liu.xing on 14-1-11.
 */
/**
 * Module dependencies.
 */

var env = process.env;

/**
 * Expose environment configuration
 */

module.exports = {
    "redis":{
    "url":"192.168.2.150",
        "port":6379 || env.PORT,
        "auth":"jsrromteam"
    },
    "obdServer":{
        "port":8010
    }
};