/**
 * Created by admin on 2017/3/31.
 */

(function(){
    "use strict";
    var Router = require("express").Router;
    var mysql = require('mysql');
    var test_database = "hh";
    var test_table = "zebra";

    module.exports = function(){
        var router = new Router();
        router.route("/api/groundsystem").get(_downloadGroundSystem);
        return router;
    };

    function _downloadGroundSystem(){
        var client = mysql.createConnection({
             host:"localhost",
             user:"root",
             password:"",
             database:test_database
        });

        client.connect();
        //client.query("use " + test_database);
        client.query(
             "SELECT * FROM " + test_table,
             function selectCb(err, resulte, fields){
             if(err){throw err;}
             if(resulte){
             console.log(JSON.stringify(resulte));
             }
             client.end();
             }
         )
    }



    /*var client = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:test_database
    });

    client.connect();
    //client.query("use " + test_database);
    client.query(
        "SELECT * FROM " + test_table,
        function selectCb(err, resulte, fields){
            if(err){throw err;}
            if(resulte){
                console.log(JSON.stringify(resulte));
            }
            client.end();
        }
    )*/
})();