/**
 * Created by liu.xing on 14-1-26.
 */
var db = require('./../../config/db').redisClient;
var iconv = require('iconv-lite');

function RegModel(phoneId,shengId,xianId,maker,obdType,obdId,carColor,carId){
    this.phoneId = phoneId;
    this.shengId = shengId;
    this.xianId = xianId;
    this.maker = maker;
    this.obdType = obdType;
    this.obdId = obdId;
    this.carColor = carColor;
    this.carId = carId;
}
RegModel.prototype.save = function(callback){
    var regModel = {
        phoneId:this.phoneId.toString('hex'),
        shengId : this.shengId.toString('hex'),
        xianId : this.xianId.toString('hex'),
        maker : this.maker.toString('hex'),
        obdType :this.obdType.toString('hex'),
        obdId :this.obdId.toString('hex'),
        carColor :this.carColor.toString('hex'),
        carId :this.carId.toString('hex')
    }
    db.hget('obdInfos:'+this.phoneId.toString('hex'),'obdId',function(e,r){
        if(r != null){
             console.log('obd id had been reg');
            callback(3);
         }else{
            regModel.verifyCode = getVerifyCode();
            db.hmset('obdInfos:'+regModel.phoneId.toString('hex')+":phoneId",regModel,function(e,r){
                 if (e) {
                     console.error("error response - " + e);
                     callback(1);
                 }else{
                    //var result =  r?0:1;
                    callback(regModel.verifyCode);
                 }
             });

        }
    });
}
/**
 * 获取6位数的鉴权码
 * @returns {encode|*}
 */
function getVerifyCode(){
    var temp = true;
    while(temp){
        var verifyCode = parseInt(Math.random()*1000000);; // 鉴权码
        var buf = iconv.encode(verifyCode, 'ascii');
        if(buf.length === 6){
            temp = false;
            return buf;
        }
    }
}
module.exports = RegModel;