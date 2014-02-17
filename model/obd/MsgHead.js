/**
 * Created by liu.xing on 14-1-13.
 */
function MsgHead(headId,headBoydAttr,headPhone,headMsgSerialNum,headMsgPackAttr){
    //消息头
    this.headId = headId; //消息ID 0-2
    this.headBoydAttr=headBoydAttr;  //消息体属性  2-4
    this.headPhone = headPhone;//终端号码 4-10
    this.headMsgSerialNum = headMsgSerialNum;//消息流水号 10-12
    //this.headMsgPackAttr =headMsgPackAttr; //消息包封装项 12-n  暂无
}
module.exports = MsgHead;
MsgHead.prototype.toString = function(){
    return this.headId.toString('hex')+"  "+this.headBoydAttr.toString('hex')+"  "+this.headPhone.toString('hex')+"  "+this.headMsgSerialNum.toString('hex');
}