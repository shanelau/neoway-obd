/**
 * Created by liu.xing on 14-1-11.
 */
var net = require('net');
var OdbService = require('../service/obdService');

/**
 * Expose Sockets initialization
 */

module.exports = ServerSocket;

var clients = [];

function ServerSocket(app){
    var config = app.get('config');
    var client = app.get('redisClient');
    var odbServerport = config.obdServer.port;
    var server = net.createServer(function(socket){
        clients.push(socket);
        console.log(socket.remoteAddress+' is connected!');
        socket.write('hello client');
        console.log("current client count:"+clients.length);


        socket.on('end', function() {
            //do something
        });

        socket.on('data',function(data){
            var odbServer = new OdbService(data,socket);
            //odbServer.print();
            try{
                console.log(data);
                var buf = odbServer.decodeMsg(data);
                console.log(buf);
                var obdMsg = odbServer.getMsgObject(buf);
                console.log(obdMsg.getMsgHead().toString('hex')+"   " +obdMsg.getMsgBody().toString('hex')+"   "+obdMsg.getCheckCode().toString('hex'));
            }catch(e){
                socket.write("your message is error!");
                console.log(e.stack);
                console.error("错误："+e.message);
            }
        });

    });
    server.listen(odbServerport,function(){
        console.log('server is run on port %d',odbServerport);
    });
    server.on('listening',function(){
        console.log('server on port %d success',odbServerport);
    });
    server.on('error', function (e) {
        if (e.code == 'EADDRINUSE') {
            console.log('地址被占用，重试中...');
            setTimeout(function () {
                server.close();
                server.listen(config.obdServer.port);
            }, 5000);
        }
    });

}



function SendToAll(fromSocket,data){
    for(var i = 0; i < clients.length;i++){
        var toSocket = clients[i];
        if(toSocket !== fromSocket){
            toSocket.write(data);
        }
    }
}


