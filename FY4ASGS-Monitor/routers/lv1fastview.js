/**
 * Created by fanli on 2017/4/27.
 */
(function () {

    'use strict';

    var path = require('path');
    var fs = require('fs');
    var sharp = require('sharp');

    module.exports = function (server, BASEPATH) {

        /**
         * @param {String} taskid 任务编号
         * @param {String} btime 任务开始时间
         * @param {String} thum 是否缩略  0=false 1=true
         */
        server.get({
            path: '/fastview/lv1/:satid/:inst/:chnl/:resolution',
        }, _downloadfastview);

    };

    function _downloadfastview(req, res, next) {
	    // FY4A-_AGRI--_N_DISK_1047E_L1A_GEO-_C001_NUL_20170426081500_4000M_00000_AFN20170426081500.JPG
	    // FY4A-_GIIRS-_N_REGX_1047E_L1A_GEO-_VIS-_NUL_20170705202236_2000M_00000_GLS20170705202236.JPG
	    // FY4A-_LMI---_N_LAMA_1047E_L1A_GPL-_SING_NUL_20170706070400_7800M_00000_LMV20170706070400.JPG
	    console.log(req.url);
        var satID = req.params['satid'];
        var inst = req.params['inst'];
        var chnl = req.params['chnl'];
        var resolution = req.params['resolution'];
        var taskID = req.params['taskid'];
        var bTime = req.params['btime'];
        var thumFlg = req.params['thum'];

        while (satID.length < 5) {
            satID += '-';
        }
        console.log(satID);
        while (inst.length < 6) {
            inst += '-';
        }
        while (chnl.length < 4) {
            chnl += '-';
        }
        console.log(inst);
	    var filePath = '';
	    if (inst === 'AGRI--') {
		    filePath = satID + '_' + inst + '_' + 'N_DISK_1047E_L1A_GEO-'
			    + '_' + chnl + '_' + 'NUL' + '_' + bTime + '_' +
			    resolution + '_' + '00000' + '_' + taskID + '.JPG';
	    } else if (inst === 'GIIRS-') {
             filePath = satID + '_' + inst + '_' + 'N_REGX_1047E_L1A_GEO-'
			    + '_' + 'VIS-' + '_' + 'NUL' + '_' + bTime + '_' +
			    '2000M' + '_' + '00000' + '_' + taskID + '.JPG';
	    } else if (inst === 'LMI---') {
            filePath = satID + '_' + inst + '_' + 'N_LAMA_1047E_L1A_GPL-'
			    + '_' + 'SING' + '_' + 'NUL' + '_' + bTime + '_' +
			    '7800M' + '_' + '00000' + '_' + taskID + '.JPG';
	    }
        filePath = path.join('/shinetek/fy4mcs', filePath);
        console.log(filePath);
        fs.exists(filePath, function (isExistFlg) {
            console.log(isExistFlg);
            if (!isExistFlg) {
                // res.writeHead(404, {
                // 	'Content-Type': 'text/plain',
                // });
                // res.write('This request URL ' + req.url +
                // 	' was not found on this server.');
                // res.end();
                filePath = path.join(__dirname, '../publics/404.jpg');
                console.log(filePath);
                sharp(filePath).jpeg().toBuffer(function (err, data, info) {
                    res.writeHead(200, {
                        'Content-Type': 'image/jpeg',
                    });
                    res.write(data);
                    res.end();
                });
            } else {
                var w = 1100;
                var h = 1100;
                if (thumFlg === "1") {
                    w = 100;
                    h = 100;
                }
                sharp(filePath).resize(w, h).jpeg().toBuffer(function (err, data, info) {
                    res.writeHead(200, {
                        'Content-Type': 'image/jpeg',
                    });
                    res.write(data);
                    res.end();
                });
            }
        });

    }

})();