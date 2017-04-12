/**
 * Created by FanTaSyLin on 2017/3/27.
 */

(function () {

    "use strict";

    var Router = require("express").Router;
    var multipart = require("multiparty");
    var fs = require("fs");
    var util = require("util");
    var ApkSchema = require("../modules/apkModule.js");

    module.exports = function () {
        var router = new Router();
        router.route("/autoupdate").get(_autoUpdate);
        router.route("/api/uploading").post(_uploading);
        router.route("/api/release").post(_submitRelease);
        router.route("/api/release").get(_getApkList);
        router.route("/api/updating").get(_updatingRelease);
        return router;
    };

    function _updatingRelease(req, res, next) {
        var apkName = req.query["name"];
        var version = req.query["version"];
        ApkSchema.find({
            name: apkName
        }, function (err, doc) {
            if (err) {
                return next(new Error(err.stack));
            }
            if (doc.length === 0) {
                return res.end(JSON.stringify({
                    latestVersion: "",
                    filePath: ""
                }));
            }
            var versionList = doc[0].tags;
            versionList.sort(function (a, b) {
                return b.version > a.version;
            });
            if (versionList[0].version > version) {
                return res.end(JSON.stringify({
                    latestVersion: versionList[0].version,
                    filePath: versionList[0].filePath
                }));
            }
        })
    }

    function _getApkList(req, res, next) {
        ApkSchema.find().exec(function (err, doc) {
            if (err) {
                return next(new Error(err.stack));
            } else {
                var result = {
                    data: doc
                };
                res.end(JSON.stringify(result));
            }
        })
    }

    function _submitRelease(req, res, next) {
        var body = req.body;
        if (body === null || body === undefined) {
            return;
        }
        ApkSchema.find({
            name: body.name
        }, function (err, doc) {
            if (err) {
                return next(new Error(err.stack));
            }
            if (doc === undefined || doc.length === 0) {
                //添加新的记录
                var _apkSchema = new ApkSchema();
                _apkSchema.initData(body);
                _apkSchema.save(function (err) {
                    if (err) {
                        return next(new DBOptionError(415, err));
                    } else {
                        res.end();
                    }
                });
            } else {
                //向原有条目中追加内容
                ApkSchema.update({
                    name: body.name
                }, {
                    $set: {
                        title: body.title
                    },
                    $push: {
                        tags: {
                            version: body.version,
                            varDate: body.varDate,
                            content: body.content,
                            filePath: body.filePath
                        }
                    }
                }, function (err) {
                    if (err) {
                        return next(new DBOptionError(415, err));
                    } else {
                        res.end();
                    }
                });
            }
        });
    }

    function _uploading(req, res, next) {
        var form = new multipart.Form({
            uploadDir: './uploading/apk/'
        });

        form.parse(req, function (err, fields, files) {
            var filesTmp = JSON.stringify(files, null, 2);
            if (err) {
                console.log('parse error: ' + err);
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                res.end(err);
            } else {
                console.log('parse files: ' + filesTmp);
                var inputFile = files.file[0];
                var uploadedPath = inputFile.path;
                var dstPath = './uploading/apk/' + inputFile.originalFilename;
                fs.rename(uploadedPath, dstPath, function (err) {
                    if (err) {
                        console.log('rename error: ' + err);
                        res.writeHead(500, {
                            'Content-Type': 'text/plain'
                        });
                        res.end(err);
                    } else {
                        res.writeHead(200, {
                            'content-type': 'text/plain;charset=utf-8'
                        });
                        //res.write('received upload:\n\n');
                        res.end(util.inspect(dstPath));
                    }
                });
            }
        });

    }

    function _autoUpdate(req, res, next) {
        res.sendfile("app/index.html");
    }

})();