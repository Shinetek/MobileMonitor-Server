/**
 * Created by lenovo on 2017/6/2.
 * 遥测分组
 */
(function () {
    'use strict';
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var satellitegroupSchema = new Schema({
        level: {type: String},
        url_date: {type: String},
        Numbers: [{
            ycname: {type: String},
            ycvalue: {type: String},
            level: {type: String},
            state: {type: String},
            selected: {type: Boolean},
            ycname_En: {type: String}
        }]
    });
    satellitegroupSchema.methods.initData = function (body) {
        var self = this;
        for (var prop in body) {
            self[prop] = body[prop];
        }

    };
    module.exports = mongoose.model('satellitegroup', satellitegroupSchema);

})();
