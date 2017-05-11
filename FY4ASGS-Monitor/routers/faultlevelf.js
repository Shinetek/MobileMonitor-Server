/**
 * Created by admin on 2017/4/27.
 */

(function(){
    "use strict";

    var faultlevelFSchema = require("./../module/fault_level_F_schame.js");

    module.exports = function(server, BASEPATH){
        //http://10.24.240.73:8080/_ds/mcs/faultlog/list/dts?status=undeal&fault_level=F&start_index=1&end_index=50 分系统的一级故障状态

        server.get({
            path:BASEPATH + "/faultlog/listf/:sys/:status/:start/:end",
            version:"0.0.1"
        },_getFaultLeveF);
    };

    function _getFaultLeveF(req, res, next){
        var _sys = req.params["sys"];
        var _status = req.params["status"];
        var startNum = Number(req.params["start"]);
        var pageSize = Number(req.params["end"]);
        faultlevelFSchema
            .find({
                status:_status,
                sys:_sys
            })
            .skip(startNum - 1)
            .limit(pageSize)
            .sort({"happen_dt":-1})
            .exec(function(err, doc){
                res.end(JSON.stringify(doc));
            });
    }
})();