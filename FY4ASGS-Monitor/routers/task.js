/**
 * Created by admin on 2017/4/27.
 */
(function () {
    "use strict";

    var TaskSchema = require("./../module/task_schame.js");

    module.exports = function (server, BASEPATH) {
        //http://10.24.240.73:8080/_ds/mcs/task/list/giirs?date=20170426&time=062147 任务列表

        server.get({
            path: BASEPATH + "/task/list/:inst",
            version: "0.0.1"
        }, _getTask);
    };

    function _getTask(req, res, next) {
        var _inst = req.params["inst"];
        TaskSchema
            .find({
                inst: _inst
            })
            .sort({"time":1})
            .exec(function (err, doc) {
                res.end(JSON.stringify(doc));
            });
    }
})();
