/**
 * Created by admin on 2017/4/27.
 */
(function(){
    "use strict";

    var TaskDetailSchema = require("./../module/task_detail_schame.js");

    module.exports = function(server, BASEPATH){
        //http://10.24.240.73:8080/_ds/mcs/task/detail/giirs?task_id=GLS20170426061500&date=20170426 单个任务的流程

        server.get({
            path:BASEPATH + "/task/detail/:inst/:task_id",
            version:"0.0.1"
        },_getTaskDetail);
    };

    function _getTaskDetail(req, res, next){
        var _inst = req.params["inst"];
        var _task_id = req.params["task_id"];
        TaskDetailSchema
            .find({
                inst:_inst,
                task_id:_task_id
            })
            .exec(function(err, doc){
                res.end(JSON.stringify(doc));
            });
    }
})();