/**
 * Created by admin on 2017/7/21.
 */

(function(){
    "use strict";

    var TimeTableSchema = require("./../module/timetable_schame.js");

    module.exports = function(server, BASEPATH){
        //http://10.24.240.76:8888/RSMS/api/rest/mcs/list/agri?date=20170718

        server.get({
            path:BASEPATH + "/rsms/api/rest/:sys",
            version:"0.0.1"
        },_getTaskTables);
    };

    function _getTaskTables(req, res, next){
        var _sys = req.params["sys"];
        TimeTableSchema
            .find({
                sys:_sys
            })
            .sort({"ScanBeginTime":1})
            .exec(function(err, doc){
                res.end(JSON.stringify(doc));
            });
    }
})();