var codingUtil = require('./../config/Util');

var buf = new Buffer(17);
buf.writeUInt8(0x7e,0);
buf.writeUInt16BE(0x0001,1);
buf.writeUInt16BE(0x7d01,3);
buf.writeUInt16BE(0x7e32,5);
buf.writeUInt16BE(0x7d11,7);
buf.writeUInt16BE(0x00da,9);
buf.writeUInt16BE(0x017e,11);

buf.writeUInt16BE(0x1111,13);

buf.writeUInt8(0x31,15);
buf.writeUInt8(0x7e,16);

console.log(buf);
console.log(codingUtil.encodeMsg(buf));

