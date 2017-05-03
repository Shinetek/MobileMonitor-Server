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

    var TaskDetailSchema = new Schema({

        /**
         *  "end_err": null,
         "end_status": "全部完成",
         "key_job": [],
         "name": "NRS",
         "plan_end_dt": "20170426061929",
         "plan_input": "0",
         "plan_output": "0",
         "plan_start_dt": "20170426061500",
         "ready_err": null,
         "ready_status": null,
         "ready_time": null,
         "real_end_dt": "20170426061748",
         "real_input": "0",
         "real_output": "0",
         "real_start_dt": "20170426061500",
         "start_err": null,
         "status": "success",
         "task_oper": "N"
         */
        task_id            : {type: String},
        order: {type: String},
        sys: [{
            end_err: {type: String},
            end_status: {type: String},
            key_job: {type: Array},
            name: {type: String},
            plan_end_dt: {type: String},
            plan_input: {type: String},
            plan_output: {type: String},
            plan_start_dt: {type: String},
            ready_err: {type: String},
            ready_status: {type: String},
            ready_time: {type: String},
            real_end_dt: {type: String},
            real_input: {type: String},
            real_output: {type: String},
            real_start_dt: {type: String},
            start_err: {type: String},
            status: {type: String},
            task_oper: {type: String}
        }]
    });

    TaskDetailSchema.methods.initData = function (body) {
        var self = this;
        for (var prop in body) {
            self[prop] = body[prop];
        }
    };
    TaskDetailSchema.methods.reportVerify = function (body) {

        return reportVerify(body);
    };
    module.exports = mongoose.model('TaskDetailInfo', TaskDetailSchema);

    //是否存在各个必须字段 update使用
    function reportVerify(body) {

        if (_.isNull(body) || _.isUndefined(body)) {
            return false;
        }
        //校验update
        if (_.isUndefined(body.order)) {
            console.log("必须值为空！");
            return true;
        } else {
            return true;
        }
    }
})();