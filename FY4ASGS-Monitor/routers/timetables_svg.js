/**
 * Created by liuyp on 2017/8/4.
 * 通过 时间表 返回用于 显示的SVG
 */


(function () {
    "use strict";

    var TimeTableSchema = require("./../module/timetable_schame.js");
    //用于遍历
    var _ = require('lodash');

    module.exports = function (server, BASEPATH) {
        //http://10.24.240.76:8888/RSMS/api/rest/mcs/list/agri?date=20170718

        server.get({
            path: BASEPATH + "/rsms/api/rest/timetablesvg/:sys/:width/:height",
            version: "0.0.1"
        }, _getTaskTables_svg);
    };

    function _getTaskTables_svg(req, res, next) {

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
                    res.end(m_svg);
                }
                next();
            });
    }

    function drawSvg(DataJosn, Svg_width, Svg_Height, SysName) {

        //遍历获取名称列表
        var m_NameListAll = [];
        DataJosn.forEach(function (m_Item) {
            m_NameListAll.push(m_Item.TaskName);
        });
        var m_NameList = _.uniq(m_NameListAll);

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
                m_SysName_ch = "探测仪";
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

        var BASELINE = 42;
        //文字和line 之间的距离
        var TEXT_SPACE = 5;

        var COLOR_BASE = ['#00CCFF', '#00FF00', '#FF0000', '#FFFF00'];

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
        var m_title_svg = '<text x="14%" y="1em" font-size="1.2em">' + m_SysName_ch + '观测任务时间表-' + m_TimeStr + '</text>';
        //时间轴参数

        m_innersvg = m_innersvg + m_title_svg;
        //循环绘制 时间轴
        var m_hoursLine_svg = ' <rect width="' + SCREEM_WIDTH + '" height="1" y="2.5em" x="0" style="fill:black;"></rect>';
        m_innersvg = m_innersvg + m_hoursLine_svg;
        for (var i = 0; i <= 12; i++) {
            var m_MiniteLine_svg = '';
            var m_Minute_x = i * MINUTESPACE + BASELINE;
            if (i % 3 == 0) {
                m_MiniteLine_svg = ' <rect width="1" height="15" y="2.5em" x="' + m_Minute_x + '" style="fill:black;"></rect>';
            } else {
                m_MiniteLine_svg = ' <rect width="1" height="5" y="2.5em" x="' + m_Minute_x + '" style="fill:black;"></rect>';
            }
            //上方时间轴文字显示
            if (i % 3 == 0) {

                var m_timeStr_txt = i * 5;
                if (m_timeStr_txt < 10) {
                    m_timeStr_txt = '0' + m_timeStr_txt;
                }
                var m_MiniteLine_text_svg = '<text y="3em" x="' + (m_Minute_x - 10) + '" font-size="0.7em">' + m_timeStr_txt + '</text>';
                m_MiniteLine_svg = m_MiniteLine_svg + m_MiniteLine_text_svg;
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
            var m_timeShow = '<text x="5" y="' + m_text_y + '" font-size="1em" >' + m_timestr + '</text>';
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


            var m_color = COLOR_BASE[0];
            var m_TaskName;
            if (m_SysName_ch === '探测仪') {
                //探测仪 使用 RegionNo 填写 num 使用 RegionType 确定颜色
                //console.log('探测仪');
                //console.log(m_json.Params[0].RegionType);
                m_color = COLOR_BASE[parseInt(m_json.Params[0].RegionType) % 4 - 1];
                m_TaskNumber = m_json.Params[0].RegionNo;
                m_TaskName = m_TaskNumber + ":" + m_Task_ch;
            } else {
                m_TaskName = m_TaskNumber + ":" + m_Task_ch;
                //其他使用 名字确定颜色

                m_color = COLOR_BASE[( _.indexOf(m_NameList, m_Task_en)) % 4];
            }
            //console.log(m_color);
            //      "TaskName": "RegionScan",

            //扫描开始结束时间
            //  "ScanBeginTime": "20170718000000"
            var m_ScanBeginTime = m_json.ScanBeginTime;
            //获取时分秒
            var m_timebegin_hour = parseInt(m_ScanBeginTime.substr(8, 2));
            var m_timebegin_minute = parseInt(m_ScanBeginTime.substr(10, 2));
            var m_timebegin_second = parseInt(m_ScanBeginTime.substr(12, 2));


            //"ScanEndTime": "20170718001049",
            var m_ScanEndTime = m_json.ScanEndTime;

            var m_timeend_hour = parseInt(m_ScanEndTime.substr(8, 2));
            var m_timeend_minute = parseInt(m_ScanEndTime.substr(10, 2));
            var m_timeend_second = parseInt(m_ScanEndTime.substr(12, 2));

            //同一行绘制 开始结束时间在同一个小时
            if (m_timebegin_hour === m_timeend_hour) {

                var m_rectheight = LINESPACE - 3 * 2;
                //通过小时计算  y 的位置

                var m_task_y = (LINESPACE * m_timebegin_hour + BASELINE) + 4;
                //通过开始时间计算 x的位置
                //var m_Minute_x = i * MINUTESPACE + BASELINE - 1;

                var m_task_x = (m_timebegin_minute + m_timebegin_second / 60) * (MINUTESPACE / 5) + BASELINE;
                //通过结束时间计算 rect 的宽度（即结束位置）
                var m_task_width = ( m_timeend_minute - m_timebegin_minute
                    + ( m_timeend_second - m_timebegin_second  ) / 60) * (MINUTESPACE / 5);


                //通过任务编号 获取一个颜色

                //  var m_color = '#FFCE27';


                var m_TaskName_show = m_TaskName;

                if (m_TaskName.length * 14 > m_task_width) {
                    var m_TextLength = Math.round(m_task_width / 14, 0) - 1;
                    var m_TaskName_list = m_TaskName.split(':');
                    m_TaskName_show = m_TaskName_list[1];
                    if (m_TextLength < 2) {
                        m_TextLength = 2;
                    }
                    m_TaskName_show = m_TaskName_show.substr(0, m_TextLength);
                } else {
                    if (m_SysName_ch !== '探测仪') {
                        var m_TaskName_list = m_TaskName.split(':');
                        m_TaskName_show = m_TaskName_list[1];
                    }
                }

                //var m_color = COLOR_BASE[m_TaskNumber % COLOR_BASE.length];
                var m_taskNum_svg = '<text x=' + (m_task_x + 1) + ' y="' + (m_task_y + LINESPACE / 2 + 1)
                    + '" font-size="0.7em" >'
                    + m_TaskName_show + '</text>';
                var m_task_svg = ' <rect width="' + m_task_width + '" height="' + m_rectheight + '" y="' + m_task_y + '" x="' + m_task_x + '" style="fill:' + m_color + ';">'

                    + '</rect>';

                m_innersvg = m_innersvg + m_task_svg + m_taskNum_svg;
            }
            else {
                //不同行绘制
                var hour_num = m_timeend_hour - m_timebegin_hour - 1;

                //1 绘制开始时段的 剩下部分
                var m_svg_beginhour = drawLine(m_timebegin_hour, m_timebegin_minute, m_timebegin_second, 60, 0, m_color, m_TaskName);
                m_innersvg = m_innersvg + m_svg_beginhour;
                //2 绘制中间时段 *n
                for (var h = 1; h <= hour_num; h++) {
                    var m_svg_hour = drawLine(m_timebegin_hour + h, 0, 0, 60, 0, m_color, m_TaskName);
                    m_innersvg = m_innersvg + m_svg_hour;
                }
                //3 绘制结束时间段

                var m_svg_endhour = drawLine(m_timeend_hour, 0, 0, m_timeend_minute, m_timeend_second, m_color, m_TaskName);
                m_innersvg = m_innersvg + m_svg_endhour;
            }
        }

        //添加svg 尾
        m_innersvg = m_innersvg +
            '</g>' +
            '</svg>';


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
            var m_rectheight = LINESPACE - 3 * 2;
            //通过小时计算  y 的位置

            var m_task_y = (LINESPACE * HourNum + BASELINE) + 4;
            //通过开始时间计算 x的位置
            //var m_Minute_x = i * MINUTESPACE + BASELINE - 1;

            var m_task_x = (BeginMinute + BeginSec / 60) * (MINUTESPACE / 5) + BASELINE;
            //通过结束时间计算 rect 的宽度（即结束位置）
            var m_task_width = ( EndMinute - BeginMinute
                + ( EndSec - BeginSec  ) / 60) * (MINUTESPACE / 5);


            //通过任务编号 获取一个颜色 设置
            var m_color = Color;
            //var m_color = COLOR_BASE[m_TaskNumber % COLOR_BASE.length];
            var m_TaskName_show = Svg_Text;
            if (Svg_Text.length * 14 > m_task_width) {
                var m_TextLength = Math.round(m_task_width / 14, 0) - 2;

                if (BeginMinute !== 0 || BeginSec !== 0) {
                    var m_TaskName_list = Svg_Text.split(':');
                    m_TaskName_show = m_TaskName_list[1];

                } else {
                    var m_TaskName_list = Svg_Text.split(':');
                    m_TaskName_show = m_TaskName_list[0];
                    m_TaskName_show = "";
                }
                // m_TaskName_show = m_TaskName_show.substr(0, m_TextLength);
            }

            //文字
            var m_tasktext_svg = '<text x=' + (m_task_x + 1) + ' y="' + (m_task_y + LINESPACE / 2 + 1) + '" font-size="0.7em"' +
                'style="overflow: hidden;width: ' + m_task_width + '">'
                + m_TaskName_show + '</text>';
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
            "FulldiskNormal": "全圆盘",
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

        if (Convert[TypeName_en]) {
            TypeName_ch = Convert[TypeName_en];
        }
        return TypeName_ch;
    }


})();