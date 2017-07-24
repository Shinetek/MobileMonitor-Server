/**
 * Created by admin on 2017/4/26.
 */

(function () {
    "use strict";

    //加载配置
    var Config = require("./config.json");
    const HTTP_PORT = process.env.HTTP_PORT || 4202;
    const MONGOOSE_URI = process.env.MONGOOSE_URI || Config.MongodbUrl;

    var mongoose = require("mongoose");
    var RESTful = require("restify");

    (function () {
        //设置连接池
        var opt_Mongoose = {
            server: {
                auto_reconnect: true,
                poolSize: 100
            }
        };
        //设置数据库连接
        mongoose.connect(MONGOOSE_URI, opt_Mongoose);

        //连接成功
        mongoose.connection.on("connected", function () {
            console.log("Mongoose connection open to" + MONGOOSE_URI);
        });

        //连接失败
        mongoose.connection.on("error", function (err) {
            console.log("Mongoose connection error" + err);
        });

    })();

    //创建服务
    (function () {
        var server = RESTful.createServer({
            name: "fy4-api"
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

        //任务状态
        require("./routers/taskstate.js")(server, BASEPATH);

        //任务的当前 已完成 下一个的状态
        require("./routers/tasknear.js")(server, BASEPATH);

        //任务列表
        require("./routers/task.js")(server, BASEPATH);

        //单个任务流程
        require("./routers/taskdetail.js")(server, BASEPATH);

        //分系统的一级故障状态
        require("./routers/faultlevele.js")(server, BASEPATH);

        //分系统的二级故障状态
        require("./routers/faultlevelf.js")(server, BASEPATH);

        //卫星遥测
        require("./routers/satellite.js")(server,BASEPATH);

        //卫星遥测分组数据
        require("./routers/satellite-group.js")(server,BASEPATH);

        //任务观测数据表
        require("./routers/timetables.js")(server,BASEPATH);

        //分系统性能参数
        require("./routers/capability.js")(server);

        //1级数据图像获取
        //require("./routers/lv1fastview.js")(server, BASEPATH);

        server.listen(HTTP_PORT, function () {
            console.log("%s listening at %s", server.name, server.url);
        });

    })();

})();