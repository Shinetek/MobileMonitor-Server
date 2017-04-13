/**
 * Created by FanTaSyLin on 2017/3/27.
 */

(function () {

    "use strict";

    var Router = require("express").Router;
    var multipart = require("multiparty");
    var fs = require("fs");
    var path = require("path");
    var util = require("util");
    var ApkSchema = require("../modules/apkModule.js");
    

    module.exports = function () {
        var router = new Router();
        router.route("/autoupdate").get(_autoUpdate);
        router.route("/api/uploading").post(_uploading);
        router.route("/api/release").post(_submitRelease);
        router.route("/api/release").get(_getApkList);
        router.route("/api/updating").get(_updatingRelease);
        router.route("/uploading/apk/:apkName").get(_downloadRelease);
        return router;
    };

    function _downloadRelease(req, res, next) {
        //var apkName = req.params['apkName'];
        var filePath = ".." + req.url;
        filePath = path.join(__dirname, filePath);
        fs.exists(filePath, function (existFlg) {
            if (!existFlg) {
                res.writeHead(404, {
                    'Content-Type': 'text/plain'
                });
                res.write("This request URL " + req.url + " was not found on this server.");
                res.end();
            } else {
                fs.readFile(filePath, "binary", function (err, file) {
                    if (err) {
                        res.writeHead(500, {
                            'Content-Type': 'text/plain'
                        });
                        res.end(err);
                    } else {
                        res.writeHead(200, {
                            'Content-Type': 'text/plain'
                        });
                        res.write(file, "binary");
                        res.end();
                    }
                });

            }
        });
    }

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
                    path: ""
                }));
            }
            var versionList = doc[0].tags;
            versionList.sort(function (a, b) {
                return b.version > a.version;
            });
            if (versionList[0].version > version) {
                return res.end(JSON.stringify({
                    latestVersion: versionList[0].version,
                    path: "http://123.56.135.196:4102" + versionList[0].filePath,
                    size: versionList[0].size
                }));
            } else {
                return res.end(JSON.stringify({
                    latestVersion: "",
                    path: ""
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
                            filePath: body.filePath,
                            size: body.size
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
                res.end(JSON.stringify(err));
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
                        res.end(JSON.stringify(err));
                    } else {
                        res.writeHead(200, {
                            'content-type': 'text/plain;charset=utf-8'
                        });
                        //res.write('received upload:\n\n');
                        res.end(JSON.stringify({
                            url: '/uploading/apk/' + inputFile.originalFilename
                        }));
                    }
                });
            }
        });

    }

    function _autoUpdate(req, res, next) {
        res.sendfile("app/index.html");
    }

})();