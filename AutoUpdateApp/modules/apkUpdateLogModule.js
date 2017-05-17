/**
 * Created by fantasylin on 5/17/17.
 */
(function () {
    "use strict";
    var mongoose = require("mongoose");
    var _ = require("lodash");
    var Schema = mongoose.Schema;
    var UpdateLogSchema = new Schema({
        /*应用名*/
        name: {type: String},
        version: {type: String},
        date: {type: Date},
        result: {type: String},
        log: {type: String}
    });
    UpdateLogSchema.methods.initData = function (body) {
        var self = this;
        self.name = body.name;
        self.version = body.version;
        self.date = new Date();
        self.result = body.result;
        self.log = body.log;
    };
    module.exports = mongoose.model('ApkUpdateLog', UpdateLogSchema);
})();