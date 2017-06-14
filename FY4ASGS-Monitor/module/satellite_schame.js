/**
 * Created by lenovo on 2017/5/24.
 * 卫星遥测数据 http://10.24.240.76:8888/RSMS/api/rest/mcs/capability/satellite?date=20170522
 */
(function () {
    'use strict';
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var satelliteSchema = new Schema({
        ycname: {type: String},
        ycvalue: {type: String},
        up_date: {type: String},
        url_date: {type: String}
    });
    satelliteSchema.methods.initData = function (body) {
        var self = this;
        for (var prop in body) {
            self[prop] = body[prop];
        }
    };
    module.exports = mongoose.model('satellite', satelliteSchema);

})();
