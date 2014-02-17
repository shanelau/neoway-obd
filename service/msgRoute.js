var bodyService = require('./BodyService');

function msgRoute(socket,obdMsg,buf){
    var msgHead = obdMsg.msgHead; // Buffer
    var headId = msgHead.headId.readUInt16BE(0,true);
    //console.log(headId === 0x0200);
    switch (headId){
        case 0x0001 : ;break;
        case 0x0100 : bodyService.reg(socket,obdMsg,buf);
            break;
        case 0x0102 : bodyService.auth(socket,obdMsg,buf);
            break;
        case 0x0200 : bodyService.location(socket,obdMsg,buf);
            break;
        case 0x0002:
            //socket.write(0x0200+'obd heat data');
             break;
        default:
           //socket.write('not found this Id');
           result = 0x03;
    }
}
exports.msgRoute = msgRoute;