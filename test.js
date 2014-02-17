var db = require('./config/db');
db.hget("obdInfos:02030405060700",'obdId',function(e,r){
    console.log(r);
});

