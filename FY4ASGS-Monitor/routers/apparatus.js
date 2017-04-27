/**
 * Created by admin on 2017/3/31.
 */

(function(){
    "use strict";
    var Router = require("express").Router;
    var mysql = require("mysql");
    var config = require("../config.json");

    module.exports = function(){
        var router = new Router();
        router.route("/api/apparatus/:date/:inst").get(_downloadApparatus);
        return router;
    };

    function _downloadApparatus(req, res, next){
        console.log(1);
       /*if(_.isUndefined(req.params.date)
            || _.isUndefined(req.params.inst)){
            res.end("输入有误");
            next();
       }*/

        var m_SQL = " SELECT * FROM IDBTaskFlow " +
        " WHERE Tdate ='" + req.params.date
        + "'AND InstrumentId = '"+ req.params.inst;
        console.log(2);


        var client = mysql.createConnection({
            host:config.host,
            user:config.user,
            password:config.password,
            database:"fy4mcs"
        });
        console.log(2);
        client.connect();
        client.query(m_SQL,function selectCb(err, results, fields){
           if(err){throw err;}
           if(results){
               console.log(results);
               res.end(results);
           }
            client.end();
        });
    }
})();