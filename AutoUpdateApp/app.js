/**
 * Created by FanTaSyLin on 2017/3/27.
 */

(function () {

    "use strict";

    var express = require("express");
    var morgan = require("morgan");
    var onFinished = require("on-finished");
    var NotFoundError = require('./lib/NotFoundError.js');

    //Connect MongoDB Start
    console.log("Connect MongoDB");    
    var mongoose = require("mongoose");
    //var config = require("./config.json");
    mongoose.connect("mongodb://shk401:68400145@123.56.135.196:6840/AutoUpdate", {
        server: {
            auto_reconnect: true,
            poolSize: 100
        }
    });
    mongoose.connection.on("error", function (err) {
       console.error("Mongoose connection error: %s", err.stack)
    });
    mongoose.connection.on("open", function () {
        console.log("Mongoose connected to the AutoUpdateDB");
    });    
    mongoose.Promise = global.Promise;
    //Connect MongoDB End

    var app = express();
    var bodyParser = require("body-parser");
    app.use(morgan("dev"));
    app.use(express.static("./app"));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
        res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
        res.header("X-Powered-By",' 3.2.1');
        if(req.method=="OPTIONS")
            res.send(200); //让options请求快速返回
        else
            next();
    });
    app.use(function (req, res, next) {
        onFinished(res, function (err) {
            console.log("[%s] finished request", req.connection.remoteAddress);
        });
        next();
    });

    app.use("/", require('./routes/user.js')());

    //其他一切资源均重定位到 404-未找到
    app.all("*", function (req, res, next) {
        next(new NotFoundError("404"));
    });
    // 错误处理中间件 （所有错误应在此处理 而不是在其他中间件中处理）
    app.use(function (err, req, res, next) {
        var code = 500;
        var msg = err.stack || {message: "Internal Server Error 1"};
        switch (err.name) {
            case 'NotFoundError':
                code = err.status;
                msg = err.inner;
                break;
            default:
                break;
        }
        return res.status(code).json(msg);
    });

    require('http').createServer(app).listen(4102, function () {
        console.log("HTTP Server listening on port: %s, in %s mode", 4102, app.get('env'));
    });

})();