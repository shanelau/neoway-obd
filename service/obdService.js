/**
 * Created by liu.xing on 14-1-13.
 */

var ObdMsg = require('../model/odb/ObdMsg');
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


OdbService.prototype.getMsgObject = function (buf) {
    var msg = new ObdMsg();

    msg.setMsgHead(buf.slice(1, 13));
    msg.setMsgBody(buf.slice(13, -2));
    msg.setCheckCode(buf.slice(-2, -1));
    return msg;
}

OdbService.prototype.iteratorBuffer = function (buffer) {
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
OdbService.prototype.needDecode = function (data,i) {
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
OdbService.prototype.writeToNewBuffer = function (resultBuf, currentIndex,data,i) {
    if (0 < i && i < data.length - 1) {   //除了标志位外 需要转义检测
        var needdecode = OdbService.prototype.needDecode(data,i);
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
OdbService.prototype.decodeMsg = function (data) {
    var length = data.length;
    var resultBuf = new Buffer(length);
    var checkNum1;  //进行异或操作的第一个数
    var oldCheckCode;
    var currentIndex = 0;  //指针位置 默认0
    for (var i = 0; i < length; i++) {    //第一个字节和最后一个字节卜转义
        var addIndex = OdbService.prototype.writeToNewBuffer(resultBuf, currentIndex,data, i); //是否需要转义，1则需要添加到新的buf
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
                if (1 < i && i <= 12) {   //消息头
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
        throw new Error("checkCode error!");
    }
    return resultBuf.slice(0, currentIndex);
}

module.exports = OdbService;