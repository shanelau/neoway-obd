/**
 * Created by liu.xing on 14-1-13.
 */

var ObdMsg = require('./../model/obd/ObdMsg');
var MsgHead = require('./../model/obd/MsgHead');
var Constants = require('../model/Constants');
var iconv = require('iconv-lite');


var OdbService = function (data, socket) {
    this.data = data;
    this.socket = socket;
}
OdbService.prototype.print = function () {
    console.log("data bytes is:" + this.data.length);
    var num1 = this.data.readUInt8(0);
    console.log(num1 + "    " + num1.toString(16));

    this.socket.write(iconv.encode("你好啊", 'gbk'));
    console.log(iconv.decode(this.data, 'gbk'));
}

/**
 * 获取消息对象
 * @param buf  转义后的buffer
 * @param headLength 消息头的长度
 * @returns {ObdMsg}
 */
OdbService.prototype.getMsgObject = function (buf) {
    var msg = new ObdMsg();
    msg.identyHead = buf.slice(0,1);
    msg.msgHead = getMsgHead(buf.slice(1, 13));
    msg.msgBody = buf.slice(13, -2);
    msg.checkCode = buf.slice(-2, -1);
    msg.identyFoot = buf.slice(-1, 0);
    return msg;
}

/**
 * 获取消息头的组成部分
 * @param buf 消息头 目前为12个字节
 * @returns {MsgHead} 消息头封装对象
 */
function getMsgHead(buf){
    var msgHead = new MsgHead();
    msgHead.headId = buf.slice(0,2);
    msgHead.headBoydAttr = buf.slice(2,4);
    msgHead.headPhone = buf.slice(4,10);
    msgHead.headMsgSerialNum = buf.slice(10,12);
    return msgHead;
}

function iteratorBuffer(buffer) {
    for (var i = 0; i < buffer.length; i++) {
        console.log(buffer.readUInt8(i) + "  " + buffer.readUInt8(i).toString(16));
    }
}
/**
 * 检测索引为i 的数据是否需要进行解码
 * 7d02-->7e    7d01--->7d
 * @param data    数组索引
 * @param i    数组索引
 * @returns {*}
 */
function needDecode(data,i) {
    if (Constants.Hex7d === data.readUInt8(i)) {
        var nextData = data.readUInt8(i + 1, true);  //相邻的下一位
        if (Constants.Hex02 === nextData) {
            return Constants.Hex7e;
        } else if (Constants.Hex01 === nextData) {
            return Constants.Hex7d;
        }
    }
    return null;
}
/**
 * 写到新的buffer中
 *
 * @param resultBuf   新的buffer
 * @param currentIndex buffer数据当前位置
 * @param data   检测的数据索引
 * @param i   检测的数据索引
 * @returns {number}  为1 则表示已经转义，下一位数据抛弃。为0则继续检测
 */
function writeToNewBuffer(resultBuf, currentIndex,data,i) {
    if (0 < i && i < data.length - 1) {   //除了标志位外 需要转义检测
        var needdecode = needDecode(data,i);
        if (needdecode !== null) {
            resultBuf.writeUInt8(needdecode, currentIndex, true);
            return 1;
        } else {
            resultBuf.writeUInt8(data[i], currentIndex, true);
            return 0;
        }
    }else{
        return 0;
    }
}

/** 数据接收后，需要进行解码操作，解码规则如下
 * 0x7e <————> 0x7d 后紧跟一个0x02；
 * 0x7d <————> 0x7d 后紧跟一个0x01。
 *
 * 消息组成 参照ObdMsg 对象
 * 标识位  消息头 消息体 校验位 标志位
 * 1       11   n     1    1
 * @param data
 * @returns {*|Buffer}
 */
OdbService.prototype.decodeMsg = function (data,callback) {
    console.log(data);
    var length = data.length;
    var resultBuf = new Buffer(length);
    var checkNum1=0;  //进行异或操作的第一个数
    var oldCheckCode=-1;
    var currentIndex = 0;  //指针位置 默认0
    for (var i = 0; i < length; i++) {    //第一个字节和最后一个字节卜转义
        var addIndex = writeToNewBuffer(resultBuf, currentIndex,data, i); //是否需要转义，1则需要添加到新的buf
        //console.log(i + " " + data[i]);
        switch (i) {
            case 0:
                ;
            case length - 1:
                resultBuf.writeUInt8(data[i], currentIndex, true);
                break;
            case 1:  //第一个异或位
                checkNum1 = data[1];
                break;
            case length - 2:
                i += addIndex;
                oldCheckCode = data[length - 2];   //获取收到的 校验码
                break;
            default :
                if (1 < i && i <= data.length-3) {   //校验码前一位
                    // console.log(checkNum1+"   "+this.data[i])
                    checkNum1 = checkNum1 ^ data[i];   //异或操作
                }
                i += addIndex;
                break;
        }
        currentIndex++;//指针下移  每次会插入一个值
    }
    console.log('异或后checkCode result:%s ! your message String is %s', checkNum1.toString(16), oldCheckCode.toString(16));
    if (oldCheckCode !== checkNum1) {
        callback(resultBuf.slice(0, currentIndex),new Error("checkCode error!"));
    }else{
        console.log(resultBuf);
        callback(resultBuf.slice(0, currentIndex),null);
    }
}




module.exports = OdbService;