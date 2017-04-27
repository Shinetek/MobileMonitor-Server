/**
 * Created by lihy on 2017/4/26.
 */
(function () {
    'use strict';
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var taskStateSchema = new Schema({
        "SEMP--": {
            cur_plan: {type: Number},
            day_plan: {type: Number},
            failure: {type: Number},
            instrumentid: {type: String},
            success: {type: Number}
        },
        agri: {
            cur_plan: {type: Number},
            day_plan: {type: Number},
            failure: {type: Number},
            instrumentid: {type: String},
            success: {type: Number}
        },
        giirs: {
            cur_plan: {type: Number},
            day_plan: {type: Number},
            failure: {type: Number},
            instrumentid: {type: String},
            success: {type: Number}
        },
        lmi:{
            cur_plan: {type: Number},
            day_plan: {type: Number},
            failure: {type: Number},
            instrumentid: {type: String},
            success: {type: Number}
        },
        orbit: {
            cur_plan: {type: Number},
            day_plan: {type: Number},
            failure: {type: Number},
            instrumentid: {type: String},
            success: {type: Number}
        },
        satellite: {
            cur_plan: {type: Number},
            day_plan: {type: Number},
            failure: {type: Number},
            instrumentid: {type: String},
            success: {type: Number}
        }
    });
    taskStateSchema.methods.initData = function (body) {
        var self = this;
        for(var prop in body){
            self[prop] = body[prop];
        }
    };
    module.exports = mongoose.model('taskstate', taskStateSchema);

})();