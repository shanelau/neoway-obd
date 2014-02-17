/**
 * Created by liu.xing on 14-1-11.
 */
var net = require('net');
var iconv = require('iconv-lite');
var logger = require('../app').logger('obdSocket');
var clientUtil = require('../socket/ClientUtil');

/**
 * Expose Sockets initialization
 */

module.exports = ServerSocket;


function ServerSocket(app){
    var config = app.get('config');
    var odbServerport = config.obdServer.port;
    var headLength = config.obd.head_length;  //消息头长度
    var server = net.createServer(function(socket){
        clientUtil.clientConnected(socket);  //客户端连接
        socket.on('end', function() {
            clientUtil.clientDisconnect(socket);
        });

        socket.on('data',function(data){
            clientUtil.clientData(data,socket);
        });
    });
    server.listen(odbServerport,function(){
        console.log('server is run on port %d',odbServerport);
        logger.info('server is run on port %d --log4j',odbServerport);
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


