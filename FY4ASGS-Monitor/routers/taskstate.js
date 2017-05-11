/**
 * Created by admin on 2017/4/27.
 */
(function(){
    "use strict";

    var taskStateSchema = require("./../module/taskstate-schema.js");

    module.exports = function(server, BASEPATH){
        //http://10.24.240.73:8080/_ds/mcs/task/stat?date=20170426&time=031033 任务状态

        server.get({
            path:BASEPATH + "/task/stat",
            version:"0.0.1"
        },_getTaskState);
    };

    function _getTaskState(req, res, next){
        taskStateSchema
        .find()
        .exec(function(err, doc){
            res.end(JSON.stringify(doc));
        });
    }
})();