/**
 * Created by liu.xing on 14-2-13.
 */
var redis = require("../config/db").redisClient;
redis.on("ready",function(){
    multDelet("location:",37);
});

function multDelet(name,maxVal){
    var ayy = new Array();
    for(var i = 0;i<maxVal;i++){
        ayy[i] = name+i;
    }
    redis.del(ayy,function(e,r){
        console.log(r);
    });
}