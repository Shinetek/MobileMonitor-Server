/**
 * Created by admin on 2017/4/27.
 */

(function(){
    "use strict";

    var faultlevelFSchema = require("./../module/fault_level_F_schame.js");

    module.exports = function(server, BASEPATH){
        //http://10.24.240.73:8080/_ds/mcs/faultlog/list/dts?status=undeal&fault_level=F&start_index=1&end_index=50 分系统的一级故障状态

       server.get({
            path:BASEPATH + "/faultlog/rollistf/:status",
            version:"0.0.1"
        },_getRollAll);



        server.get({
            path:BASEPATH + "/faultlog/allistf/:sys",
            version:"0.0.1"
        },_getFaultAll);



        server.get({
            path:BASEPATH + "/faultlog/codelistf/:status/:start/:end",
            version:"0.0.1"
        },_getFaultCode);


        server.get({
            path:BASEPATH + "/faultlog/listf/:sys/:status/:start/:end",
            version:"0.0.1"
        },_getFaultLeveF);

    };

    //所有未处理数据
    function _getRollAll(req,res,next){
        var _status = req.params["status"];
        faultlevelFSchema
            .find({
                status:_status,
            })
            .exec(function(err, doc){
                res.end(JSON.stringify(doc));
            })
    }


    //所有的仪器数据
    function _getFaultAll(req, res, next){
        var _sys = req.params["sys"];
        faultlevelFSchema
            .find({
                sys:_sys
            })
            .exec(function(err, doc){
                res.end(JSON.stringify(doc));
            })
    }


    //查找处理状态的1-50数据
    function _getFaultCode(req, res, next){
        var _status = req.params["status"];
        var startNum = Number(req.params["start"]);
        var pageSize = Number(req.params["end"]);
        faultlevelFSchema
            .find({
                status:_status,
            })
            .skip(startNum - 1)
            .limit(pageSize)
            .sort({"happen_dt":-1})
            .exec(function(err, doc){
                res.end(JSON.stringify(doc));
            })
    }



    //查找个仪器分组1-50
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