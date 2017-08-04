/**
 * Created by liuyp on 2017/8/4.
 * 通过 时间表 返回用于 显示的SVG
 */


(function () {
    "use strict";

    var TimeTableSchema = require("./../module/timetable_schame.js");

    module.exports = function (server, BASEPATH) {
        //http://10.24.240.76:8888/RSMS/api/rest/mcs/list/agri?date=20170718

        server.get({
            path: BASEPATH + "/rsms/api/rest/timetablesvg/:sys/:width/:height",
            version: "0.0.1"
        }, _getTaskTables_svg);
    };

    function _getTaskTables_svg(req, res, next) {
        //console.log("_getTaskTables_svg");
        var _sys = req.params["sys"];
        var _width = req.params["width"];
        var _height = req.params["height"];
        TimeTableSchema
            .find({
                sys: _sys
            })
            .sort({"ScanBeginTime": 1})
            .exec(function (err, doc) {
                if (!err) {
                    var m_svg = drawSvg(doc, _width, _height, _sys);
                    //console.log(m_svg);
                    res.end(m_svg);
                }
                next();
            });
    }

    function drawSvg(DataJosn, Svg_width, Svg_Height, SysName) {

        var m_SysName_ch = "";

        switch (SysName.toString().toLocaleUpperCase()) {
            case 'AGRI':
            {
                m_SysName_ch = "成像仪";
                break;
            }
            case 'LMI':
            {
                m_SysName_ch = "闪电仪";
                break;
            }
            case 'GIIRS':
            {
                m_SysName_ch = "成像仪";
                break;
            }
            default:
            {
                break;
            }
        }
        var m_TimeStr;
        if (DataJosn.length > 0) {
            var m_item = DataJosn[0];
            m_TimeStr = m_item.datastr;
            var m_TimeStrsp = m_TimeStr.split(" ");
            if (m_TimeStrsp.length > 0) {
                m_TimeStr = m_TimeStrsp[0];
            } else {
                m_TimeStr = '';
            }
        }

        //时间表
        var m_timetableJson = DataJosn;

        //日期线边距
        var SCREEM_WIDTH = Svg_width;
        var SCREEM_HEIGHT = Svg_Height;

        var BASELINE = 62;
        //文字和line 之间的距离
        var TEXT_SPACE = 14;

        var COLOR_BASE = ['#FFCE27', '#00CCFF', '#FF0000', '#009966'];

        //计算24h 线间距
        var LINESPACE = Math.round((SCREEM_HEIGHT - BASELINE) / 24, 0) - 1;
        //5min
        var MINUTESPACE = Math.round((SCREEM_WIDTH - BASELINE ) / 12, 0) - 1;

        //初始化 svg 头
        var m_innersvg = '<svg width="' + SCREEM_WIDTH + '" height="' + SCREEM_HEIGHT + '"' +
            'version="1.1" xmlns="http://www.w3.org/2000/svg" ' +
            'xmlns:xlink="http://www.w3.org/1999/xlink">' +
            '<g id="TimeTable">';
        //上方标题
        var m_title_svg = '<text x="25%" y="1em" font-size="2em">' + m_SysName_ch + '观测任务时间表-' + m_TimeStr + '</text>';
        //时间轴参数

        m_innersvg = m_innersvg + m_title_svg;
        //循环绘制 时间轴
        var m_hoursLine_svg = ' <rect width="' + SCREEM_WIDTH + '" height="1" y="3.5em" x="0" style="fill:black;"></rect>';
        m_innersvg = m_innersvg + m_hoursLine_svg;
        for (var i = 0; i <= 12; i++) {
            var m_MiniteLine_svg = '';
            var m_Minute_x = i * MINUTESPACE + BASELINE;
            if (i % 3 == 0) {
                m_MiniteLine_svg = ' <rect width="1" height="15" y="3.5em" x="' + m_Minute_x + '" style="fill:black;"></rect>';
            } else {
                m_MiniteLine_svg = ' <rect width="1" height="5" y="3.5em" x="' + m_Minute_x + '" style="fill:black;"></rect>';
            }
            m_innersvg = m_innersvg + m_MiniteLine_svg;
        }

        //循环绘制 时间线
        for (var time = 0; time < 24; time++) {
            //计算时间线边距
            var m_line_y = (LINESPACE * time + LINESPACE + BASELINE);
            //计算每一个时间线上的距离
            var m_text_y = m_line_y - TEXT_SPACE;


            var m_timestr = time;
            if (time < 10) {
                m_timestr = "0" + m_timestr;
            }
            var m_timeShow = '<text x="5" y="' + m_text_y + '" font-size="2em" >' + m_timestr + '</text>';
            var m_lineShow = ' <rect width="' + SCREEM_WIDTH + '" height="1" y="' + m_line_y + '" x="0" style="fill:black;"></rect>';
            m_innersvg = m_innersvg + m_timeShow + m_lineShow;
        }

        //循环绘制 时间表具体内容
        for (var m_num = 0; m_num < m_timetableJson.length; m_num++) {

            var m_json = m_timetableJson[m_num];

            //任务号 用于 tag
            // "TaskCode": "GRS20170718000000",
            var m_TaskCode = m_json.TaskCode;

            //      "TaskNumber": "1",
            var m_TaskNumber = parseInt(m_json.TaskNumber);

            var m_Task_en = m_json.TaskName;
            var m_Task_ch = EnglishConvert(m_Task_en);
            //      "TaskName": "RegionScan",
            var m_TaskName = m_TaskNumber + ":" + m_Task_ch;
            //扫描开始结束时间
            //  "ScanBeginTime": "20170718000000"
            var m_ScanBeginTime = m_json.ScanBeginTime;
            //获取时分秒
            var m_timebegin_hour = parseInt(m_ScanBeginTime.substr(8, 2));
            var m_timebegin_minute = parseInt(m_ScanBeginTime.substr(10, 2));
            var m_timebegin_second = parseInt(m_ScanBeginTime.substr(12, 2));

            //console.log('BEGIN:' + m_timebegin_hour + ":" + m_timebegin_minute + ":" + m_timebegin_second);
            //"ScanEndTime": "20170718001049",
            var m_ScanEndTime = m_json.ScanEndTime;

            var m_timeend_hour = parseInt(m_ScanEndTime.substr(8, 2));
            var m_timeend_minute = parseInt(m_ScanEndTime.substr(10, 2));
            var m_timeend_second = parseInt(m_ScanEndTime.substr(12, 2));
            //console.log('END  :' + m_timeend_hour + ":" + m_timeend_minute + ":" + m_timeend_second);
            //同一行绘制
            if (m_timebegin_hour === m_timeend_hour) {

                var m_rectheight = LINESPACE - 5 * 2;
                //通过小时计算  y 的位置

                var m_task_y = (LINESPACE * m_timebegin_hour + BASELINE) + 6;
                //通过开始时间计算 x的位置
                //var m_Minute_x = i * MINUTESPACE + BASELINE - 1;

                var m_task_x = (m_timebegin_minute + m_timebegin_second / 60) * (MINUTESPACE / 5) + BASELINE;
                //通过结束时间计算 rect 的宽度（即结束位置）
                var m_task_width = ( m_timeend_minute - m_timebegin_minute
                    + ( m_timeend_second - m_timebegin_second  ) / 60) * (MINUTESPACE / 5);


                //通过任务编号 获取一个颜色

                //  var m_color = '#FFCE27';
                var m_color = COLOR_BASE[1];
                //var m_color = COLOR_BASE[m_TaskNumber % COLOR_BASE.length];
                var m_taskNum_svg = '<text x=' + (m_task_x + 3) + ' y="' + (m_task_y + LINESPACE / 2 + 3)
                    + '" font-size="1.5em" style="overflow: hidden;width: ' + m_task_width + '">'
                    + m_TaskName + '</text>';
                var m_task_svg = ' <rect width="' + m_task_width + '" height="' + m_rectheight + '" y="' + m_task_y + '" x="' + m_task_x + '" style="fill:' + m_color + ';">'

                    + '</rect>';

                m_innersvg = m_innersvg + m_task_svg + m_taskNum_svg;
            }
            else {
                //不同行绘制
                var hour_num = m_timeend_hour - m_timebegin_hour - 1;

                //1 绘制开始时段的 剩下部分
                var m_svg_beginhour = drawLine(m_timebegin_hour, m_timebegin_minute, m_timebegin_second, 60, 0, COLOR_BASE[1], m_TaskName);
                m_innersvg = m_innersvg + m_svg_beginhour;
                //2 绘制中间时段 *n
                for (var h = 1; h <= hour_num; h++) {
                    var m_svg_hour = drawLine(m_timebegin_hour + h, 0, 0, 60, 0, COLOR_BASE[1], m_TaskName);
                    m_innersvg = m_innersvg + m_svg_hour;
                }
                //3 绘制结束时间段

                var m_svg_endhour = drawLine(m_timeend_hour, 0, 0, m_timeend_minute, m_timeend_second, COLOR_BASE[1], m_TaskName);
                m_innersvg = m_innersvg + m_svg_endhour;
            }
        }

        //添加svg 尾
        m_innersvg = m_innersvg +
            '</g>' +
            '</svg>';
        //console.log(m_innersvg);

        /**
         *
         * @param HourNum 小时数
         * @param BeginMinute 开始 分钟
         * @param BeginSec 开始 秒
         * @param EndMinute 结束 分钟
         * @param EndSec 结束秒
         * @param Color
         * @param Svg_Text 用于显示 的txt
         * @returns {string}
         */
        function drawLine(HourNum, BeginMinute, BeginSec, EndMinute, EndSec, Color, Svg_Text) {
            var m_rectheight = LINESPACE - 5 * 2;
            //通过小时计算  y 的位置

            var m_task_y = (LINESPACE * HourNum + BASELINE) + 6;
            //通过开始时间计算 x的位置
            //var m_Minute_x = i * MINUTESPACE + BASELINE - 1;

            var m_task_x = (BeginMinute + BeginSec / 60) * (MINUTESPACE / 5) + BASELINE;
            //通过结束时间计算 rect 的宽度（即结束位置）
            var m_task_width = ( EndMinute - BeginMinute
                + ( EndSec - BeginSec  ) / 60) * (MINUTESPACE / 5);


            //通过任务编号 获取一个颜色 设置
            var m_color = Color;
            //var m_color = COLOR_BASE[m_TaskNumber % COLOR_BASE.length];
            //文字
            var m_tasktext_svg = '<text x=' + (m_task_x + 3) + ' y="' + (m_task_y + LINESPACE / 2 + 3) + '" font-size="1.5em"' +
                'style="overflow: hidden;width: ' + m_task_width + '">'
                + Svg_Text + '</text>';
            //底色
            var m_task_svg = ' <rect width="' + m_task_width + '" height="' + m_rectheight + '" y="' + m_task_y
                + '" x="' + m_task_x + '" style="fill:' + m_color + ';">' + '</rect>';

            return m_task_svg + m_tasktext_svg;
        }

        return m_innersvg;

    }

    //英文转化部分 参照杨勇刚给的 任务列表
    function EnglishConvert(TypeName_en) {
        var TypeName_ch = TypeName_en;
        var Convert = {
            "FulldiskNormal": "全圆盘常规",
            "FulldiskHigh": "全圆盘高灵敏",
            "NorthdiskNormal": "北半球常规",
            "NorthdiskHigh": "北半球高灵敏",
            "SouthdiskNormal": "南半球常规",
            "SouthdiskHigh": "南半球高灵敏",
            "RegionScan": "区域",
            "RegionscanNormal": "区域常规",
            "RegionscanHigh": "区域高灵敏",
            "MoonscanNormal": "月球常规",
            "MoonscanHigh": "月球高灵敏",
            "LandscanNormal": "地标常规",
            "LandscanHigh": "地标高灵敏",
            "ChinascanNormal": "中国区域常规",
            "ChinascanHigh": "中国区域高灵敏",
            "StarScan": "恒星",
            "BlackbodyScan": "黑体",
            "DiffuseReflect": "漫反射",
            "InfraredBackground": "红外背景数据获取",
            "sPaceScan": "冷空探测",
            "MoonScan": "月球探测",
            "LandScan": "地标探测",
            "DiMianJiGuang": "地面激光光谱定标和地理定位",
            "QingKong": "晴空大气光谱定标探测",
            "LightingView": "闪电探测",
            "LandMarkView": "地标",
            "Reset": "闪电仪复位"
        };

        //console.log(Convert[TypeName_en]);
        if (Convert[TypeName_en]) {
            TypeName_ch = Convert[TypeName_en];
        }
        return TypeName_ch;
    }


})();