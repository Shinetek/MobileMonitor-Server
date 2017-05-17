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
    var parserAPK = require("apk-parser");
    var ApkSchema = require("../modules/apkModule.js");
    var UpdateLogSchema = require("../modules/apkUpdateLogModule.js");
    var config = require("../config.json");


    module.exports = function () {
        var router = new Router();
        router.route("/autoupdate").get(_autoUpdate);
        router.route("/api/uploading").post(_uploading);
        router.route('/setup').get(_setupApp);
        router.route("/api/release").post(_submitRelease);
        router.route("/api/release").get(_getApkList);
        router.route("/api/updating").get(_updatingRelease);
        router.route("/uploading/apk/:apkName").get(_downloadRelease);
        return router;
    };

    function _downloadRelease(req, res, next) {
        var url = req.url;
        var apkName = req.query["name"];
        var version = req.query["version"];
        var body = undefined;
        if (req.url.indexOf("?") !== -1) {
            url = req.url.substring(0, req.url.indexOf("?"));
        }
        var filePath = config.uploadPath + url;
        console.log(filePath);
        fs.exists(filePath, function (existFlg) {
            if (!existFlg) {
                body = {
                    name: apkName,
                    version: version,
                    result: "failed",
                    log: filePath + " is not exist"
                };
                var _updateLogSchema = new UpdateLogSchema();
                _updateLogSchema.initData(body);
                _updateLogSchema.save(function (err) {
                    if (err) {
                        return next(new Error(415, err));
                    } else {
                        res.end();
                    }
                });
                res.writeHead(404, {
                    'Content-Type': 'text/plain'
                });
                res.write("This request URL " + req.url + " was not found on this server.");
                res.end();
            } else {
                fs.readFile(filePath, "binary", function (err, file) {
                    if (err) {

                        body = {
                            name: apkName,
                            version: version,
                            result: "failed",
                            log: JSON.stringify(err)
                        };
                        var _updateLogSchema = new UpdateLogSchema();
                        _updateLogSchema.initData(body);
                        _updateLogSchema.save(function (err) {
                            if (err) {
                                return next(new Error(415, err));
                            } else {
                                res.end();
                            }
                        });
                        res.writeHead(500, {
                            'Content-Type': 'text/plain'
                        });
                        res.end(JSON.stringify(err));
                    } else {

                        body = {
                            name: apkName,
                            version: version,
                            result: "success",
                            log: ""
                        };
                        var _updateLogSchema = new UpdateLogSchema();
                        _updateLogSchema.initData(body);
                        _updateLogSchema.save(function (err) {
                            if (err) {
                                return next(new Error(415, err));
                            } else {
                                res.end();
                            }
                        });
                        res.writeHead(200, {
                            'Content-Type': 'text/plain',
                            'Content-Length': file.length
                        });
                        res.write(file, "binary");
                        res.end();
                    }

                });
            }
            // var _updateLogSchema = new UpdateLogSchema();
            // _updateLogSchema.initData(body);
            // _updateLogSchema.save(function (err) {
            //     if (err) {
            //         return next(new Error(415, err));
            //     } else {
            //         res.end();
            //     }
            // });
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
                return _compareVersion(b.version, a.version);
            });
            if (_compareVersion(versionList[0].version, version) === 1) {
                return res.end(JSON.stringify({
                    latestVersion: versionList[0].version,
                    path: "http://" + config.host + versionList[0].filePath + "?name=" + apkName + "&version=" + versionList[0].version,
                    size: versionList[0].size
                }));
            } else {
                return res.end(JSON.stringify({
                    latestVersion: "",
                    path: ""
                }));
            }
        });
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
                        return next(new Error(415, err));
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
                        return next(new Error(415, err));
                    } else {
                        res.end();
                    }
                });
            }
        });
    }

    function _uploading(req, res, next) {
        var form = new multipart.Form({
            uploadDir: config.uploadPath + '/uploading/apk/'
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
                var dstPath = config.uploadPath + '/uploading/apk/' + inputFile.originalFilename;
                fs.rename(uploadedPath, dstPath, function (err) {
                    if (err) {
                        console.log('rename error: ' + err);
                        res.writeHead(500, {
                            'Content-Type': 'text/plain'
                        });
                        res.end(JSON.stringify(err));
                    } else {
                        parserAPK(dstPath, function (err, data) {
                            var body = {};
                            body.url = '/uploading/apk/' + inputFile.originalFilename;
                            if (!err) {
                                var manifest = data["manifest"][0];
                                if (manifest !== undefined) {
                                    body.versionName = manifest["@android:versionName"];
                                }
                            }
                            res.writeHead(200, {
                                'content-type': 'text/plain;charset=utf-8'
                            });
                            //res.write('received upload:\n\n');
                            res.end(JSON.stringify(body));
                        });
                    }
                });
            }
        });

    }

    function _autoUpdate(req, res, next) {
        res.sendfile("app/index.html");
    }

    function _setupApp(req, res, next) {
        var apkName = req.query["name"];
        ApkSchema.find({
            name: apkName
        }, function (err, doc) {
            if (err) {
                return next(new Error(err.stack));
            }
            if (doc.length === 0) {
                return res.end();
            }
            var versionList = doc[0].tags;
            versionList.sort(function (a, b) {
                return _compareVersion(b.version, a.version);
            });
            var filePath = ".." + versionList[0].filePath;
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
                                'Content-Type': 'application/vnd.android.package-archive',
                                'Content-Length': file.length,
                                'Content-Disposition': 'attachment; filename=' + apkName + '.apk'
                            });
                            res.write(file, "binary");
                            res.end();
                        }
                    });

                }
            });

        });
    }

    function _compareVersion(a, b) {
        var aList = a.replace("v", "").split(".");
        var bList = b.replace("v", "").split(".");
        var majorV_a = Number(aList[0]);
        var minorV_a = Number(aList[1]);
        var revisionV_a = Number(aList[2]);
        var majorV_b = Number(bList[0]);
        var minorV_b = Number(bList[1]);
        var revisonV_b = Number(bList[2]);
        if (majorV_a === majorV_b) {
            if (minorV_a === minorV_b) {
                if (revisionV_a === revisonV_b) {
                    return 0;
                } else if (revisionV_a < revisonV_b) {
                    return -1;
                } else {
                    return 1;
                }
            } else if (minorV_a < minorV_b) {
                return -1;
            } else {
                return 1;
            }
        } else if (majorV_a < majorV_b) {
            return -1;
        } else {
            return 1;
        }
    }

})();