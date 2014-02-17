/**
 * Created by liu.xing on 14-2-13.
 */

var ObdMsgAnalysis = require('../service/obdMsgAnalysis');
var msgRoute = require('../service/msgRoute');
var HashMap = require('hashmap').HashMap;
var shortId = require('shortId');
var map = new HashMap();

exports.clientConnected = function(socket){
    socket.connID = shortId.generate();
    map.set(socket.connID,socket);

    console.log(socket.remoteAddress+' is connected!'+" sessionID:"+socket.connID);
    console.log("current client count:"+map.count());
}
exports.clientDisconnect = function(socket){
    map.remove(socket.connID);

    console.log(socket.remoteAddress+' is disconnected!'+" sessionID:"+socket.connID);
    console.log("current client count:"+map.count());
}
exports.clientData = function (data,socket){
    console.log(data);
    var odbServer = new ObdMsgAnalysis(data,socket);

    odbServer.decodeMsg(data,function(buf,err){
        if(err != null){
            console.log(err.stack);
            return ;
        }
        var obdMsg = odbServer.getMsgObject(buf);  //拼装成对象
        console.log(obdMsg.msgHead.toString());
        console.log("消息体："+obdMsg.msgBody.toString('hex')+"   校验码："+obdMsg.checkCode.toString('hex'));
        msgRoute.msgRoute(socket,obdMsg,buf);  //消息分发处理
    });
}