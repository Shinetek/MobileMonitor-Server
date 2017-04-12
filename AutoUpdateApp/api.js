/**
 * Created by FanTaSyLin on 2017/3/24.
 */
(function () {

    "use strict";
    const HTTP_PORT = process.env.HTTP_PORT || 4001;
    var RESTful = require("restify");
    var morgan = require("morgan");
    var mongoose = require("mongoose");

    var config = require("./config.json");
    var ApkSchema = require("./modules/apkModule.js");

    console.log("Connect MongoDB");
    mongoose.connect(config.mongodbUrl, {
        server: {
            auto_reconnect: true,
            poolSize: 100
        }
    });
    mongoose.on("error", function (err) {
       console.error("Mongoose connection error: %s", err.stack)
    });
    mongoose.on("open", function () {
        console.log("Mongoose connected to the AutoUpdateDB");
    });
    
    mongoose.Promise = global.Promise;

    console.log("Create RESTful Server");
    var server = RESTful.createServer({
        name: "Auto Update App Server"
    });

    server.use(morgan("dev"));
    server.use(RESTful.queryParser());
    server.use(RESTful.bodyParser());
    server.use(RESTful.CORS());

    const BASEPATH = "/api/autoupdate";

    server.get({
        path: BASEPATH + "/:appName/:versionNum"
    }, _updateApp);

    server.post({
        path: BASEPATH + "/uploading"
    }, _uploading)

    server.listen(HTTP_PORT, function () {
       console.log("%s listening at %s", server.name, server.url);
    });

    function _uploading(req, res, next) {
        var form = new multiparty.Form({
            uploadDir: "uploads/apks/"
        });        
        form.parse(req, function (err, fields, files) {
            if (err) {
                res.writeHead(400, {'content-type': 'text/plain'});
                res.end("invalid request: " + err.message);
                return;
            } 

        });
    }

    function _updateApp(req, res, next) {
        var appName = req.params["appName"];
        var versionNum = req.params["versionNum"];
        ApkSchema.findOne({
            appName: appName
        }, function (err, doc) {
            if (err) {
                return next(new Error(err.stack))
            }
            if (doc === undefined) {
                var o = {
                    latestNum: "",
                    filePath: ""
                }
                return res.end(JSON.stringify(o));
            }
            var latestVersionNum = doc.version;
            if (latestVersionNum > versionNum) {
                var o = {
                    latestNum: latestVersionNum,
                    filePath: doc.filePath
                }
                return res.end(JSON.stringify(o));
            }

            return next();
        })
    }

})();