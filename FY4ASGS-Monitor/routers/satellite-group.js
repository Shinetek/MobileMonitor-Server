/**
 * Created by admin on 2017/6/2.
 */

(function(){
    "use strict";
    var satellite = require("./../module/satellite_group_schema.js");
    module.exports = function(server, BASEPATH){
        //http://10.24.240.76:8888/RSMS/api/rest/mcs/capability/satellite?date=20170524 遥测数据
        server.get({
            path: BASEPATH + "/capability/satellitegroup",
            version:"0.0.1"
        },_getSatellite);
    };

    function _getSatellite(req, res, next){
        satellite
            .find()
            .exec(function (err, doc){
                res.end(JSON.stringify(doc));
            });
    }
})();