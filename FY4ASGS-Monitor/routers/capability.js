/**
 * Created by fantasylin on 5/11/17.
 */

(function () {

    "use strict";

    var CapabilitySchame = require("../module/capability_schame.js");

    module.exports = function (server) {
        const BASEPATH = "/RSMS/api/rest/mcs/capability";
        server.get({
            path: BASEPATH + "/:sys"
        }, _getSysCapability);
    };

    function _getSysCapability(req, res, next) {
        var system = req.params["sys"];

        CapabilitySchame.find({
            sys: system
        }).exec(function (err, doc) {
            if (err) {
                return next(new Error(err.stack));
            } else {
                var result = {
                    data: doc
                };
                res.end(JSON.stringify(result));
            }
        });
    }

})();
