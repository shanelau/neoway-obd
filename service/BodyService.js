var obdMsgReply = require('../service/obdMsgReply');
var GpsInfo = require('./../model/obd/GpsInfo');
var RegModel = require('./../model/obd/RegModel');
var util = require('./../config/Util');

exports.location =  function(socket,obdMsg,buf){
    console.log('locaotion report','utf-8');

    var body = obdMsg.msgBody;
    var headPhone = obdMsg.msgHead.headPhone;  //消息头的标识
    var sosSign = body.slice(0,4);
    var status = body.slice(4,8);
    var pointX = body.slice(8,12);
    var pointY = body.slice(12,16);
    var height = body.slice(16,18);
    var speed = body.slice(18,20);
    var orient = body.slice(20,22);
    var currentDate = body.slice(22,28);
    var fujia = body.slice(28,buf.length-14);

    var gpsInfo = new GpsInfo(headPhone,sosSign,status,pointX,pointY,height,speed,orient,currentDate,fujia);

    gpsInfo.save(function(r){
        var result = 0x00;
        var resultBuf =  obdMsgReply.obdCommonReply(obdMsg,result,buf.slice(1,13));  //获取通用应答
        console.log(resultBuf);
        socket.write(resultBuf);

    });
}
exports.reg = function(socket,obdMsg,buf){
    var body = obdMsg.msgBody;
    var headPhone = obdMsg.msgHead.headPhone;  //消息头的标识
    var shengId = body.slice(0,3);
    var xianId =  body.slice(3,5);
    var maker = body.slice(5,10);
    var obdType = body.slice(10,30);
    var obdId = body.slice(30,37);
    var carColor = body.slice(37,38);
    var carId = body.slice(38,39);
    var regModel = new RegModel(headPhone,shengId,xianId,maker,obdType,obdId,carColor,carId);

    regModel.save(function(result){ //保存obd信息到数据库
        console.log(result);
        var resultBuf =  obdMsgReply.regResponse(obdMsg,buf.slice(1,13),result);
        console.log('注册应答:');
        console.log(resultBuf);
        socket.write(resultBuf);
    });
}

exports.auth = function(socket,obdMsg,buf){
    util.auth(obdMsg.msgHead.headPhone,obdMsg.msgBody,function(result){
        var statusCode ;
        if(result){  //鉴权成功
            statusCode = 0x00;
        }else{
            statusCode = 0x01;
        }
        var resultBuf =  obdMsgReply.obdCommonReply(obdMsg,statusCode,buf.slice(1,13));  //获取通用应答
        console.log('认证应答:');
        console.info(resultBuf);

        socket.write(resultBuf);
    });
}