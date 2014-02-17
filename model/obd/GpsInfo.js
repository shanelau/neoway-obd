var db = require('../../config/db').redisClient;

function GpsInfo(headPhone,sosSign, status, pointX, pointY, height, speed, orient, currentDate,fujia) {
    this.headPhone = headPhone;
    this.sosSign = sosSign;
    this.status = status;
    this.pointX = pointX;
    this.pointY = pointY;
    this.height = height;
    this.speed = speed;
    this.orient = orient;
    this.currentDate = currentDate;
    this.fujia = fujia;
}
GpsInfo.prototype.save = function (callback) {
    // 存入 redis 的文档
    var gpsInfo = {
        sosSign: this.sosSign.toString('hex'),
        status: this.status.toString('hex'),
        pointX: this.pointX.toString('hex'),
        pointY: this.pointY.toString('hex'),
        height: this.height.toString('hex'),
        speed: this.speed.toString('hex'),
        orient: this.orient.toString('hex'),
        currentDate: this.currentDate.toString('hex'),
        fujia: this.fujia.toString('hex')
    };
    console.log(gpsInfo);
    var  headPhone = this.headPhone.toString('hex');  //obd 标识
    db.incr("gpsCountId", function (e, id) {
        var locationId = "location:" + id+":inrcId";
        gpsInfo.gpsCountId = id;
        db.hmset(locationId,gpsInfo, function (e, r) {
            if(e){
                console.log(e);
                return;
            }
            db.rpush("obd_location:"+headPhone+":obdId",locationId,function(e,r){
                if(e){
                    console.log(e);
                    return;
                }
                console.log('位置ID：'+r);
                callback(r);
            });

        })
    })
}

module.exports = GpsInfo;