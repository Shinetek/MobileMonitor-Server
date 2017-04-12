/**
 * Created by FanTaSyLin on 2017/3/27.
 */

(function () {
    "use strict";
    var mongoose = require("mongoose");
    var _ = require("lodash");
    var Schema = mongoose.Schema;
    var ApkSchema = new Schema({
        /*应用名*/
        name: {type: String},
        /*标题 应用功能描述*/
        title: {type: String},
        /*历代版本*/
        tags: [{
            /*版本号*/
            version: {type: String},
            /*发布时间*/
            varDate: {type: Date},
            /*版本描述*/
            content: {type: String},
            /*apk存放路径*/
            filePath: {type: String}
        }]
    });
    ApkSchema.methods.initData = function (body) {
        var self = this;
        self.name = body.name;
        self.title = body.title;
        self.tags = [];
        self.tags.push({
            version: body.version,
            varDate: body.varDate,
            content: body.content,
            filePath: body.filePath
        });
    };
    module.exports = mongoose.model('AndroidPackage', ApkSchema)
})();
