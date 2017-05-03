/**
 * Created by admin on 2017/4/26.
 */

(function(){
    "use strict";
    var subDasStateSchema = require("./../module/subdasstate-schema.js");
    module.exports = function(server, BASEPATH){
        //http://10.24.240.73:8080/_ds/mcs/resource/dts_station?date=20170426&time=031417 分系统的设备状态
        server.get({
            path: BASEPATH + "/resource/dts_station",
            version:"0.0.1"
        },_getSubdassState);
    };

    function _getSubdassState(req, res, next){
        //console.log(1);
        console.log(req.params.date);
        subDasStateSchema
            .find()
            .exec(function (err, doc){
                /*var result = {
                   data:doc
                };*/
                res.end(JSON.stringify(doc));
            });
    }
})();