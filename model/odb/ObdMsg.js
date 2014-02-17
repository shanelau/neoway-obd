/**
 * Created by liu.xing on 14-1-9.
 * 模块发过来的消息结构
 */
var ObdMsg = function(){
    //标志位
    var identyHead = 0x7e;  //  1byte
    var msgHead;  //消息头 12byte
    var msgBody;  //消息体
    var checkCode ;//校验码  1bytes
    var identyFoot = 0x7e;//消息尾  1bytes
}
ObdMsg.prototype.setMsgHead = function(msgHead){
    this.msgHead = msgHead;
}
ObdMsg.prototype.getMsgHead = function(){
    return this.msgHead;
}
ObdMsg.prototype.setMsgBody = function(msgBody){
    this.msgBody = msgBody;
}
ObdMsg.prototype.getMsgBody = function(){
    return this.msgBody;
}
ObdMsg.prototype.setCheckCode = function(checkCode){
    this.checkCode = checkCode;
}
ObdMsg.prototype.getCheckCode = function(){
    return this.checkCode;
}




module.exports = ObdMsg;
