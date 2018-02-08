/**
 * Created by admin on 2018/2/8.
 */

(function(){
    "use strict";

    var TableCountSchema = require("./../module/task_count_schema.js");

    module.exports = function(server, BASEPATH){
        //http://10.24.240.76:8888/RSMS/api/rest/mcs/task/count/agri?date=20180207

        server.get({
            path:BASEPATH + "/task/api/count/:sys",
            version:"0.0.1"
        },_getTaskCount);
    };

    function _getTaskCount(req, res, next){
        var _sys = req.params["sys"];
        TableCountSchema
            .find({
                sys:_sys
            })
            .exec(function(err, doc){
                res.end(JSON.stringify(doc));
            });
    }
})();