/**
 * Created by liuyp on 2017/4/26.
 *  1级故障
 *
 */
(function () {

    'use strict';

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var _ = require('lodash');

    var TaskSchema = new Schema({
        name: {type: String},
        status: {type: String},
        task_id: {type: String},
        time: {type: String},
        inst: {type: String}
        /*   "name": "冷空观测",
         "status": "success",
         "task_id": "GPS20170426000000",
         "time": "000000",
         "inst":agri,giirs,lmi*/

    });

    TaskSchema.methods.initData = function (body, inst) {
        var self = this;
        for (var prop in body) {
            self[prop] = body[prop];
        }
        self.inst = inst;
    };
    TaskSchema.methods.reportVerify = function (body) {

        return reportVerify(body);
    };
    module.exports = mongoose.model('TaskInfo', TaskSchema);

    //是否存在各个必须字段 update使用
    function reportVerify(body) {

        if (_.isNull(body) || _.isUndefined(body)) {
            return false;
        }
        //校验update
        /*   "name": "冷空观测",
         "status": "success",
         "task_id": "GPS20170426000000",
         "time": "000000"*/
        if (_.isUndefined(body.name) ||
            _.isUndefined(body.status) ||
            _.isUndefined(body.task_id) ||
            _.isUndefined(body.time)) {
            console.log("必须值为空！");
            return true;
        } else {
            return true;
        }

    }
})();