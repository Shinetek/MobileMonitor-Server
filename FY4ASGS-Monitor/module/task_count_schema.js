/**
 * Created by LiuYinPing on 2018/2/8.
 */



var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var taskCountSchema = new Schema({
    "allsuccess": {
        type: Number
    },
    "sysid": {
        type: String
    },
    "failure": {
        type: Number
    },
    "success": {
        type: Number
    },
    "run": {
        type: Number
    },
    "psuccess": {
        type: Number
    },
    "plan": {
        type: Number
    },
    "sys": {
        type: String
    }
});
taskCountSchema.methods.initData = function (body) {
    var self = this;
    for (var prop in body) {
        self[prop] = body[prop];
    }
};
module.exports = mongoose.model('taskcount', taskCountSchema);