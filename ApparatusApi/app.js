/**
 * Created by admin on 2017/3/31.
 */

(function(){
    "use strict";
    //加载配置
    //定义服务器接口
    const HTTP_PORT = process.env.HTTP_PORT || 4701;
    var RESTful = require("restify");

    //创建sever的服务
    (function(){
        var server = RESTful.createServer({
            name:"Test-API"
        });

        server.use(RESTful.queryParser());
        //是用来解析HTTP查询字符串（/jobs？skills=java，muysql），解析后面的内容将会在req.query里可用
        server.use(RESTful.bodyParser());
        //会在服务器上自动将请求数据转换为javascript对象
        server.use(RESTful.CORS());
        //配置应用程序中的CORS支持

        const BASEPATH = "/api";
        //定义一个常量地址

        /**
         * 卫星平台监视区域
         */
        require("./routes/state-handler.js")(server,BASEPATH);

        /**
         *地面系统综合监视区域
         */
        require("./routes/ground-handler.js")(server,BASEPATH);

        /**
         *各仪器任务综合信息显示区域
         */
        require("./routes/apparatus-handler.js")(server,BASEPATH);

        server.listen(HTTP_PORT,function(){
           console.log("%s listening at %s",server.name,server.url);
        });


    })();

})();