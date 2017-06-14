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

    var faultlevelFSchema = new Schema({
        category: {type: String},
        code: {type: String},
        deal_dt: {type: String},
        layType: {type: String},
        deal_plan: {type: String},
        describe: {type: String},
        fault_level: {type: String},
        happen_dt: {type: String},
        memo: {type: String},
        person: {type: String},
        status: {type: String},
        sys: {type: String}
    });

    faultlevelFSchema.methods.initData = function (body) {
        var self = this;
        for (var prop in body) {
            self[prop] = body[prop];
        }
    };
    faultlevelFSchema.methods.reportVerify = function (body) {

        return reportVerify(body);
    };
    module.exports = mongoose.model('FaultLevelFInfo', faultlevelFSchema);

    //是否存在各个必须字段 update使用
    function reportVerify(body) {

        if (_.isNull(body) || _.isUndefined(body)) {
            return false;
        }
        //校验update
        if (_.isUndefined(body.category) ||
            _.isUndefined(body.code) ||
            _.isUndefined(body.describe) ||
            _.isUndefined(body.fault_level) ||
            _.isUndefined(body.layType) ||
            _.isUndefined(body.happen_dt) ||
            _.isUndefined(body.status)) {
            console.log("必须值为空！");
            return true;
        } else {
            return true;
        }

    }
})();