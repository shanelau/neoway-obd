/**
 * Created by liu.xing on 14-1-14.
 */
var util = require('./../config/Util');
/***
 * 平台通用应答 body
 * @param msgHead
 * @param result 0为成功，1为失败 2 为不支持 3为错误
 * @param msgHeadBuf
 * @returns {Buffer}
 */
var obdCommonReply = function(obdMsg,result,msgHeadBuf){
    var msgHead = obdMsg.msgHead;
    var buf = messageHead(msgHead,msgHeadBuf,20,13);
    buf.writeUInt8(result,17);   //应答结果
    buf.writeUInt8(getCheckCode(buf),18);  //校验码

    return util.encodeMsg(buf);
}
/**
 *  拼接消息头部
 * @param msgHead 消息头对象
 * @param msgHeadBuf 消息头Buf
 * @param length   应答消息的长度
 * @serializOffet length  消息流水号的位置
 * @returns {Buffer} 应答消息体
 */
function messageHead(msgHead,msgHeadBuf,length,serializOffet){
    var buf = new Buffer(length);
    buf.writeUInt8(0x7e,0);
    buf.writeUInt8(0x7e,length-1);
    msgHeadBuf.copy(buf,1);  //拷贝到的消息头
    var checkCode = msgHeadBuf[1];
    msgHead.headId.copy(buf,15);
    buf.writeUInt16BE(0x8001,1);   //应答消息体属性
    buf.writeUInt16BE(length-15,3);   //应答消息体属性

    var serializ = msgHead.headMsgSerialNum.readUInt16BE(0)+1;  //消息流水号+1
    buf.writeUInt16BE(serializ,serializOffet);
    return buf;
}
function getCheckCode(buf){
    var checkCode;
    for(var i = 1; i<buf.length-2;i++){
        checkCode = checkCode ^ buf[i];   //求校验码
    }
    return checkCode;
}
/**
 * result == 0 时 才有鉴权码
 * @param obdMsg
 * @param result
 * @param msgHeadBuf
 */
var regResponse = function(obdMsg,msgHeadBuf,verifyCode){
    var msgHead = obdMsg.msgHead;
    var bodyLength;
    if(verifyCode === 1 || verifyCode === 3 ){  //注册失败
        bodyLength = 18;
    }else{
        bodyLength = 24;
    }
    var buf = getRegResponseBody(msgHead,msgHeadBuf,bodyLength,verifyCode);
    return util.encodeMsg(buf);
}
function getRegResponseBody(msgHead,msgHeadBuf,length,verifyCode){
    var buf = messageHead(msgHead,msgHeadBuf,length,13);
    buf.writeUInt16BE(0x8100,1);  //注册应答消息头
    buf.writeUInt16BE(length-15,3);  //注册应答消息体属性
    buf.writeUInt8(0x03,15);   //应答结果
    if(length === 24){
        buf.writeUInt8(0x00,15);   //应答结果
        verifyCode.copy(buf,16); //成功时  6个字节 写入鉴权码
    }
    buf.writeUInt8(getCheckCode(buf),length-2);  //校验码
    return buf;
}
exports.obdCommonReply = obdCommonReply;
exports.regResponse = regResponse;