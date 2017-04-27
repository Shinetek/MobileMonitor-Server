/**
 * Created by lihy on 2017/4/26.
 */
(function () {
    'use strict';
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var subDasStateSchema = new Schema({
        station_name: {type: String},
        status: {type: String},
        sys_id: {type: String}
    });
    subDasStateSchema.methods.initData = function (body) {
        var self = this;
        for(var prop in body){
            self[prop] = body[prop];
        }
    };
    module.exports = mongoose.model('subdasstate', subDasStateSchema);

})();
