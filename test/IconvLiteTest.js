/**
 * Created by liu.xing on 14-2-10.
 */
var iconv = require('iconv-lite');
var temp = 575082;
var buf = new Buffer(6);
buf.writeUInt8(0x35,0);
buf.writeUInt8(0x38,1);
buf.writeUInt8(0x30,2);
buf.writeUInt8(0x36,3);
buf.writeUInt8(0x34,4);
buf.writeUInt8(0x33,5);

var verifyCode = iconv.decode(buf, 'utf8');
console.log(verifyCode instanceof String);
console.log(verifyCode == 580643);



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