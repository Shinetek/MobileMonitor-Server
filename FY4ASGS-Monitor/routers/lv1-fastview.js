(function () {

    "use strict";

    var Router = require("express").Router;
    
    module.exports = function () {
        var router = new Router();
        router.route("/api/:inst/:date/:fileName").get(_downloadL1FastView);
        return router;
    };

    function _downloadL1FastView(req, res, next) {
        
    }

})();