/**
 * Created by lenovo on 2017/7/20.
 * 时间表
 */
(function () {

    'use strict';

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var _ = require('lodash');

    var TimeTableSchema = new Schema({
        sys: {type: String},
        TaskCode: {type: String},
        ScanEndTime: {type: String},
        TaskName: {type: String},
        TaskNumber: {type: String},
        Params: [{
            RegionNo: {type: String},
            RegionType: {type: String},
            MirrorShift: {type: String},
            EWDirection: {type: String},
            TargetPosDuration: {type: String},
            StartLineNo: {type: String},
            NSDirection: {type: String},
            EndColumnNo: {type: String},
            IsReturn: {type: String},
            ReserveNum: {type: String},
            SunAvoid: {type: String},
            StartColumnNo: {type: String},
            InRegionSum: {type: String},
            InRegionNumber: {type: String},
            EndLineNo: {type: String},
            EWWalkMode: {type: String},


            TransmissionMode: {type: String},
            IsInjection: {type: String},

            AreaNum: {type: String},
            IsWind: {type: String}


        }],
        ScanBeginTime: {type: String},
        datastr: {type: String}
    });

    TimeTableSchema.methods.initData = function (body) {
        var self = this;
        for (var prop in body) {
            self[prop] = body[prop];
        }
    };

    //判断值域是否正确

    TimeTableSchema.methods.reportVerify = function (body) {

        return reportVerify(body);
    };
    module.exports = mongoose.model('timetables', TimeTableSchema);

    //是否存在各个必须字段 update使用
    function reportVerify(body) {

        if (_.isNull(body) || _.isUndefined(body)) {
            return false;
        }
        //校验update
        if (_.isUndefined(body.sys)) {
            console.log("必须值为空！");
            return true;
        } else {
            return true;
        }

    }
})();