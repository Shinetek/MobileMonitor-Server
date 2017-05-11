/**
 * Created by lenovo on 2017/5/11.
 * dts nrs mrs  性能状态
 *
 */

(function () {

    'use strict';

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var _ = require('lodash');

    var CapabilitySchema = new Schema({
        sys: {type: String},
        instrument: {type: String},
        name: {type: String},
        status: {type: String},
        value: {type: String},
        param: [{
            name: {type: String},
            status: {type: String},
            value: {type: String}
        }],
        datastr:{type: String}
    });

    CapabilitySchema.methods.initData = function (body) {
        var self = this;
        for (var prop in body) {
            self[prop] = body[prop];
        }
    };

    //判断值域是否正确

    CapabilitySchema.methods.reportVerify = function (body) {

        return reportVerify(body);
    };
    module.exports = mongoose.model('capability', CapabilitySchema);

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