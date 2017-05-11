/**
 * Created by admin on 2017/4/27.
 */
(function(){
    "use strict";

    var taskNearSchema = require("./../module/tasknear-schema.js");

    module.exports = function(server, BASEPATH){
        //http://10.24.240.73:8080/_ds/mcs/task/near/agri?date=20170426&time=031033 任务的当前 已完成 下一个的状态

        server.get({
            path:BASEPATH + "/task/near/:inst",
            version:"0.0.1"
        },_getTaskNear);
    };

    function _getTaskNear(req, res, next){
        var _inst = req.params["inst"];
        taskNearSchema
            .find({
                inst:_inst
            })
            .exec(function(err, doc){
                res.end(JSON.stringify(doc));
            });
    };
})();