/**
 * Created by FanTaSyLin on 2017/3/27.
 */

(function () {

    "use strict";

    angular.module("AutoUpdate")
        .controller("MainController", MainControllerFn);

    MainControllerFn.$inject = ["AutoUpdateServices", "Upload", "$scope"];

    function MainControllerFn(AutoUpdateServices, Upload, $scope) {
        var self = this;
        var updateModal = angular.element(document.getElementById('updateApkModal'));

        /*当前页签内容*/
        self.theSelectedPageTab = "List";
        /*app列表*/
        self.apkModuleList = [];
        /*传递给模态框的 apkModule*/
        self.selectedAPKModule = {manualVersion: false};
        /*上传文件列表*/
        self.uploadFiles = [];

        /*页面数据初始化*/
        self.initData = _initData;
        /*判断是否页签被选中*/
        self.isSelectedPageTab = _isSelectedPageTab;
        /*选择页签*/
        self.selectPageTab = _selectPageTab;
        /*弹出 UpdateApk 模态框*/
        self.showUpdateApkModal = _showUpdateApkModal;
        /*上传Release*/
        self.submitRelease = _submitRelease;

        /*防止火狐 在拖拽时 自动打开网页*/
        document.body.ondrop = function (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        /*拖拽上传相关事件 start*/
        $scope.$watch('files', function () {
            if ($scope.files !== null && $scope.files !== undefined) {
                $scope.files.forEach(function (item) {
                    self.uploadFiles.splice(0, self.uploadFiles.length);
                    self.uploadFiles.push({
                        progressPercentage: 0,
                        name: item.name
                    });
                });
            }
            $scope.upload($scope.files);
        });

        $scope.$watch("file", function () {
            if ($scope.file != null) {
                $scope.files = [$scope.file];
            }
        })

        $scope.upload = function (files) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    // var fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1);
                    // var newFileName = self.selectedAPKModule.name + self.selectedAPKModule.version.replace(".", "_") + "." + fileExtension;
                    // self.uploadFiles.push({
                    //     progressPercentage: 0,
                    //     name: item.name
                    // });
                    self.selectedAPKModule.size += file.size;
                    (function (i) {
                        return Upload.upload({
                            url: 'http://123.56.135.196:4102/api/uploading',
                            // url: "http://localhost:4102/api/uploading",
                            fields: {
                                'username': $scope.username
                            },
                            file: file
                        }).progress(function (evt) {
                            $scope.showProgress = true;
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total); //上传百分比
                            for (var i = 0; i < self.uploadFiles.length; i++) {
                                if (self.uploadFiles[i].name === evt.config.file.name) {
                                    self.uploadFiles[i].progressPercentage = progressPercentage;
                                }
                            }
                            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                        }).success(function (data, status, headers, config) {
                            $scope.showProgress = true;
                            console.log(data);
                            self.selectedAPKModule.filePath = data.url;
                            if (!data.versionName) {
                                alert("无法获取apk版本号 请手动填写!");
                                self.selectedAPKModule.manualVersion = true;
                            } else {
                                self.selectedAPKModule.version = "v" + data.versionName;
                            }
                            console.log('file ' + config.file.name + 'uploaded. Response: ', data);
                            console.log("size:" + (config.file.size / 1000).toFixed(2)); //一个文件上传成功
                        });
                    })(i);
                }
            }
        };
        /*拖拽上传相关事件 end*/

        function _submitRelease() {
            var apkModule = {};
            apkModule.name = self.selectedAPKModule.name;
            apkModule.title = self.selectedAPKModule.title;
            apkModule.version = self.selectedAPKModule.version;
            apkModule.varDate = self.selectedAPKModule.varDate;
            apkModule.content = self.selectedAPKModule.content;
            apkModule.filePath = self.selectedAPKModule.filePath;
            apkModule.size = self.selectedAPKModule.size;
            if (self.selectedAPKModule === null || self.selectedAPKModule.name === undefined || self.selectedAPKModule.name === "") {
                alert("请先填写应用名称");
                return;
            }
            if (self.selectedAPKModule === null || self.selectedAPKModule.version === undefined || self.selectedAPKModule.version === "") {
                alert("请先填写版本号");
                return;
            }
            if (!_checkVersion(self.selectedAPKModule.version)) {
                return;
            }

            //验证文件是否上传
            if (apkModule.filePath === null || apkModule.filePath === undefined || apkModule.filePath === "") {
                alert('请先上传apk文件');
                return;
            }
            AutoUpdateServices.submitRelease(apkModule, function (res) {
                //关闭模态框
                updateModal.modal('hide');
                //刷新页面数据
                AutoUpdateServices.getAPKList(function (res) {
                    var data = res.data;
                    _refreshApkList(data);
                }, function (err) {

                });
            }, function (err) {

            });
        }

        function _checkVersion(version) {
            //验证version的有效性
            //1 主版本号.次版本号.修订版本号
            //2 version号不可重复
            var reg = /^v\d{1,3}\.\d{1,3}\.\d{1,3}$/
            if (!reg.test(version)) {
                alert('请输入正确的版本号: v主版本号.次版本号.修订版本号');
                return false;
            }
            if (self.selectedAPKModule.tags === null || self.selectedAPKModule.tags === undefined) {
                return true;
            } else {
                for (var i = 0; i < self.selectedAPKModule.tags.length; i++) {
                    // if (self.selectedAPKModule.tags[i].version === version) {
                    if (_compareVersion(self.selectedAPKModule.tags[i].version, version) === 0) {
                        alert('该版本号已存在');
                        return false;
                    } else if (_compareVersion(self.selectedAPKModule.tags[i].version, version) === 1) {
                        alert('该版本号小于已存在的版本号');
                        return false;
                    }
                }
                return true;
            }
        }

        // a > b : 1;
        // a = b : 0;
        // a < b : -1;
        function _compareVersion(a, b) {
            var aList = a.replace("v", "").split(".");
            var bList = b.replace("v", "").split(".");
            var majorV_a = Number(aList[0]);
            var minorV_a = Number(aList[1]);
            var revisionV_a = Number(aList[2]);
            var majorV_b = Number(bList[0]);
            var minorV_b = Number(bList[1]);
            var revisonV_b = Number(bList[2]);
            if (majorV_a === majorV_b) {
                if (minorV_a === minorV_b) {
                    if (revisionV_a === revisonV_b) {
                        return 0;
                    } else if (revisionV_a < revisonV_b) {
                        return -1;
                    } else {
                        return 1;
                    }
                } else if (minorV_a < minorV_b) {
                    return -1;
                } else {
                    return 1;
                }
            } else if (majorV_a < majorV_b) {
                return -1;
            } else {
                return 1;
            }
        }

        function _refreshApkList(data) {
            self.apkModuleList.splice(0, self.apkModuleList.length);
            for (var i = 0; i < data.length; i++) {
                self.apkModuleList.push(data[i]);
            }
        }

        function _initData() {
            AutoUpdateServices.getAPKList(function (res) {
                _refreshApkList(res.data);
            }, function (err) {

            });
        }

        function _showUpdateApkModal(apkModule) {
            if (apkModule === null) {
                apkModule = {
                    name: "",
                    title: "",
                    version: "",
                    varDate: new Date(),
                    content: "",
                    filePath: "",
                    tag: []
                }
            } else {
                apkModule.version = "";
                apkModule.varDate = new Date();
                apkModule.content = "";
                apkModule.filePath = "";
                apkModule.size = 0;
            }
            self.selectedAPKModule = apkModule;
            self.selectedAPKModule.size = 0;
            self.selectedAPKModule.manualVersion = false;
            self.uploadFiles = [];
            updateModal.modal({
                backdrop: 'static',
                keyboard: false
            });
        }

        function _selectPageTab(tabName) {
            self.theSelectedPageTab = tabName;
        }

        function _isSelectedPageTab(tabName) {
            return self.theSelectedPageTab === tabName;
        }
    }

})();