/**
 * Created by admin on 2017/4/27.
 */
(function(){
    "use strict";

    var faultlevelESchema = require("./../module/fault_level_E_schame.js");

    module.exports = function(server, BASEPATH){
       // http://10.24.240.73:8080/_ds/mcs/faultlog/list/dts?status=undeal&fault_level=E&start_index=1&end_index=50 分系统的二级故障状态

        server.get({
            path:BASEPATH + "/faultlog/list/dtse/:status/:start/:end",
            version:"0.0.1"
        },_getFaultLeveE);
    };

    function _getFaultLeveE(req, res, next){
        console.log(6);
        var status = req.params["status"];
        var startNum = Number(req.params["start"]);
        var pageSize = Number(req.params["end"]);
        faultlevelESchema
            .find({
                status:status
            })
            .skip(startNum - 1)
            .limit(pageSize)
            .sort({"happen_dt":-1})
            .exec(function(err, doc){
                res.end(JSON.stringify(doc));
            });
    }
})();