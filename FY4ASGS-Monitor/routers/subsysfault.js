/**
 * Created by admin on 2017/4/27.
 */
(function(){
    "use strict";

    var subSysFaultSchema = require("./../module/subsysfault-schema.js");

    module.exports = function(server, BASEPATH){
        //http://10.24.240.73:8080/_ds/mcs/faultlog/stat?date=20170426  分系统的故障状态

        server.get({
            path:BASEPATH + "/faultlog/stat",
            version:"0.0.1"
        },_getSubsysFault);
    };

    function _getSubsysFault(req, res, next){
        console.log(2);
        subSysFaultSchema
        .find()
        .exec(function(err, doc){
            res.end(JSON.stringify(doc));
        });
    };

})();