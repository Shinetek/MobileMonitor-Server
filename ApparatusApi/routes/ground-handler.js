/**
 * Created by admin on 2017/3/31.
 */

(function(){
    "use strict";
    var Json = require(".././json/ground.json");
    module.exports = function(server,BASEPATH){
        server.get({
            path:BASEPATH + "/ground",
            version:"0.0.1"
        },_getGround);

        function _getGround(req, res, next){

           //res.setHeader('content-type', 'text/html; charset=UTF-8');
            var testReturn = Json;
            res.end(JSON.stringify(testReturn));
            return next();
        };
    };
})();