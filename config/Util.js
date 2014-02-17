/**
 * Created by liu.xing on 14-2-9.
 */
var db = require('../config/db').redisClient;
var iconv = require('iconv-lite');


/**
 * 0x7e <————> 0x7d 后紧跟一个0x02；
 * 0x7d <————> 0x7d 后紧跟一个0x01。
 * 转义
 * @param data  buffer
 */
exports.encodeMsg = function (data){
    var length = data.length;
    var resultBuf = new Buffer(length*2);
    var currentIndex = 0;  //指针位置 默认0
    for (var i = 0; i < length; i++) {
        if(i === 0  || i === length - 1){  //第一个字节和最后一个字节不转义
                resultBuf.writeUInt8(data[i], currentIndex);
                currentIndex++;
        }else {
                if(data[i] === 0x7e){
                    resultBuf.writeUInt8(0x7d,currentIndex);
                    currentIndex++;
                    resultBuf.writeUInt8(0x02,currentIndex);
                    currentIndex++;
                }else if(data[i] === 0x7d){
                    resultBuf.writeUInt8(0x7d,currentIndex);
                    currentIndex++;
                    resultBuf.writeUInt8(0x01,currentIndex);
                    currentIndex++;
                }else{
                    resultBuf.writeUInt8(data[i], currentIndex);
                    currentIndex++;
                }
        }
    }
    return resultBuf.slice(0, currentIndex);
}
exports.auth = function(headPhone,verifyCode,callback){
    db.hget("obdInfos:"+headPhone.toString('hex')+":phoneId",'verifyCode',function(e,r){
       if(e !== null){
           console.log(e);
           callback(false);
       }else{
           var buf = iconv.decode(r, 'utf8');
           console.log('verfityCode 对比');
           console.log(buf == verifyCode);
           if(buf == verifyCode){
               callback(true);
           }else{
               callback(false);
           }
       }
    });
}