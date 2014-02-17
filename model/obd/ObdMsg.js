/**
 * Created by liu.xing on 14-1-9.
 * 模块发过来的消息结构
 */
function ObdMsg(identyHead,msgHead,msgBody,checkCode,identyFoot){
    //标志位
    this.identyHead = identyHead;  //  1byte
    this.msgHead = msgHead;  //消息头 12byte
    this.msgBody = msgBody;  //消息体
    this.checkCode =checkCode ;//校验码  1bytes
    this.identyFoot = identyFoot;//消息尾  1bytes
}

module.exports = ObdMsg;
