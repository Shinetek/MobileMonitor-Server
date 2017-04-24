/**
 * Created by admin on 2017/3/31.
 */

(function(){
    "use strict";
    var Json = require(".././json/apparatus.json");
    var JsonCxy = require(".././json/cxy.json");
    var JsonTcy = require(".././json/tcy.json");
    var JsonSdy = require(".././json/sdy.json");
    var JsonGdy = require(".././json/gdy.json");
    var JsonCxyTasklist = require(".././json/JsonCxyTasklist.json");
    var JsonTcyTasklist = require(".././json/JsonTcyTasklist.json");
    var JsonSdyTasklist = require(".././json/JsonSdyTasklist.json");



    module.exports = function(server,BASEPATH){
        //总仪器数据
        server.get({
            path:BASEPATH + "/apparatus",
            version:"0.0.1"
        },_getApparatus);

        //成像仪数据
        server.get({
            path:BASEPATH + "/apparatus/cxy",
            version:"0.0.1"
        },_getCxy);

        //探测仪数据
        server.get({
            path:BASEPATH + "/apparatus/tcy",
            version:"0.0.1"
        },_getTcy);

        //闪电仪数据
        server.get({
            path:BASEPATH + "/apparatus/sdy",
            version:"0.0.1"
        },_getSdy);

        //成像仪状态监视数据
        server.get({
            path:BASEPATH + "/apparatus/cxy/tasklist",
            version:"0.0.1"
        },_getCxyTasklist);

        //探测仪状态监视数据
        server.get({
            path:BASEPATH + "/apparatus/tcy/tasklist",
            version:"0.0.1"
        },_getTcyTasklist);

        //闪电仪状态监视数据
        server.get({
            path:BASEPATH + "/apparatus/sdy/tasklist",
            version:"0.0.1"
        },_getSdyTasklist);

        //轨道确定与预报数据
        server.get({
            path:BASEPATH + "/apparatus/gdy",
            version:"0.0.1"
        },_getGdy);


        //返回整体仪器json数据
        function _getApparatus(req, res, next){

            //res.setHeader('content-type', 'text/html; charset=UTF-8');
            var testReturn = Json;
            res.end(JSON.stringify(testReturn));
            return next();
        };

        //返回成像仪观测任务表json数据
        function _getCxy(req, res, next){
            var testReturn = JsonCxy;
            res.end(JSON.stringify(testReturn));
            return next();
        };

        //返回探测仪观测任务表json数据
        function _getTcy(req, res, next){
            var testReturn = JsonTcy;
            res.end(JSON.stringify(testReturn));
            return next();
        };

        //返回闪电仪观测任务表json数据
        function _getSdy(req, res, next){
            var testReturn = JsonSdy;
            res.end(JSON.stringify(testReturn));
            return next();
        };

        //返回轨道确定与预报任务表json数据
        function _getGdy(req, res, next){
            var testReturn = JsonGdy;
            res.end(JSON.stringify(testReturn));
            return next();
        };

        //返回成像仪状态监视数据
        function _getCxyTasklist(req, res, next){
            var testReturn = JsonCxyTasklist;
            res.end(JSON.stringify(testReturn));
            return next();
        };

        //返回探测仪状态监视数据
        function _getTcyTasklist(req, res, next){
            var testReturn = JsonTcyTasklist;
            res.end(JSON.stringify(testReturn));
            return next();
        };

        //闪电仪状态监视数据
        function _getSdyTasklist(req, res, next){
            var testReturn = JsonSdyTasklist;
            res.end(JSON.stringify(testReturn));
            return next();
        };
    };
})();