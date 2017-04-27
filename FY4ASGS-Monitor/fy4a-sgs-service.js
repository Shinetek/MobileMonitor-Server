/**
 * Created by admin on 2017/4/26.
 */

(function(){
   "use strict";

    //加载配置
    var Config = require("./config.json");
    const HTTP_PORT = process.env.HTTP_PORT || 4202;
    const MONGOOSE_URI = process.env.MONGOOSE_URI || Config.MongodbUrl;

    var mongoose = require("mongoose");
    var RESTful = require("restify");

    (function(){
        //设置连接池
        var opt_Mongoose = {
            server:{
                auto_reconnect:true,
                poolSize:100
            }
        };
        //设置数据库连接
        mongoose.connect(MONGOOSE_URI, opt_Mongoose);

        //连接成功
        mongoose.connection.on("connected", function(){
           console.log("Mongoose connection open to" + MONGOOSE_URI);
        });

        //连接失败
        mongoose.connection.on("error", function(){
           console.log("Mongoose connection error" + err);
        });
    })();

    //创建服务
    (function(){
        var server = RESTful.createServer({
            name:"fy4-api"
        });

        //设置中间件
        server.use(RESTful.queryParser());
        server.use(RESTful.bodyParser());
        server.use(RESTful.CORS());

        const BASEPATH = "/_ds/mcs";

        //api定义
        //分系统的设备状态
        require("./routers/subdasstate.js")(server, BASEPATH);
        //分系统的故障状态
        require("./routers/subsysfault.js")(server, BASEPATH);  
        //1级数据图像获取
        require("./routers/lv1fastview.js")(server, BASEPATH);

        server.listen(HTTP_PORT, function(){
           console.log("%s listening at %s", server.name, server.url);
        });

    })();

})();