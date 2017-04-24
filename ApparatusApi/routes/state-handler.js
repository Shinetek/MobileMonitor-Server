/**
 * Created by admin on 2017/3/31.
 */

(function(){
    "use strict";
    var Json = require(".././json/state.json");
    module.exports = function(server,BASEPATH){
        /**
        *获取数据
        */
        server.get({
            path:BASEPATH + "/state",
            verison:"0.0.1"
        },_getTerrace);

        function _getTerrace(req, res, next){
           //res.setHeader('content-type', 'text/html; charset=UTF-8');
            var testReturn = Json;
            res.end(JSON.stringify(testReturn));
            return  next();
        };
    };
})();