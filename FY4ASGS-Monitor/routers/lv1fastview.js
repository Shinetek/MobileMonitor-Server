/**
 * Created by fanli on 2017/4/27.
 */
(function() {

	'use strict';

	var path = require('path');
	var fs = require('fs');
	var sharp = require('sharp');

	module.exports = function(server, BASEPATH) {

		/**
		 * @param {String} taskid 任务编号
		 * @param {String} btime 任务开始时间
		 * @param {String} etime 任务结束时间
		 */
		server.get({
			path: '/fastview/lv1/:satid/:inst/:chnl/:resolution',
		}, _downloadfastview);

	};

	function _downloadfastview(req, res, next) {
		// FY4A-_AGRI--_N_DISK_0995E_L1A_GEO-_C001_NUL_20170426081500_20170426082750_4000M_00000_AFN20170426081500.JPG
		var satID = req.params['satid'];
		var inst = req.params['inst'];
		var chnl = req.params['chnl'];
		var resolution = req.params['resolution'];
		var taskID = req.params['taskid'];
		var bTime = req.params['btime'];
		var eTime = req.params['etime'];

		while (satID.length < 5) {
			satID += '-';
		}
		console.log(satID);
		while (inst.length < 6) {
			inst += '-';
		}
		console.log(inst);
		var filePath = satID + '_' + inst + '_' + 'N_DISK_0995E_L1A_GEO-'
			+ '_' + chnl + '_' + 'NUL' + '_' + bTime + '_' + eTime + '_' +
			resolution + '_' + '00000' + '_' + taskID + '.JPG';

		var filePath = path.join('/shinetek/fy4mcs', filePath);
		console.log(filePath);
		fs.exists(filePath, function(isExistFlg) {
			console.log(isExistFlg);
			if (!isExistFlg) {
				res.writeHead(404, {
					'Content-Type': 'text/plain',
				});
				res.write('This request URL ' + req.url +
					' was not found on this server.');
				res.end();
			} else {
				var buffer = sharp(filePath).
					resize(1100, 1100).
					jpeg().
					toBuffer(function(err, data, info) {
						res.writeHead(200, {
							'Content-Type': 'image/jpeg',
						});
						res.write(data);
						res.end();
					});
				// fs.readFile(filePath, function(err, file) {
				// 	if (err) {
				// 		res.writeHead(500, {
				// 			'Content-Type': 'text/plain',
				// 		});
				// 		res.end(err);
				// 	} else {
				// 		res.writeHead(200, {
				// 			'Content-Type': 'image/jpeg'
				// 		});
				// 		res.write(file);
				// 		res.end();
				// 	}
				// });
			}
		});

	}

})();