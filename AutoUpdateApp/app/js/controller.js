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
        self.selectedAPKModule = {};
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
                // if (self.selectedAPKModule === null || self.selectedAPKModule.name === undefined || self.selectedAPKModule.name === "") {
                //     alert("请先填写应用名称");
                //     return;
                // }
                // if (self.selectedAPKModule === null || self.selectedAPKModule.version === undefined || self.selectedAPKModule.version === "") {
                //     alert("请先填写版本号");
                //     return;
                // }
                // if (!_checkVersion(self.selectedAPKModule.version)) {
                //     return;
                // }

                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    // var fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1);
                    // var newFileName = self.selectedAPKModule.name + self.selectedAPKModule.version.replace(".", "_") + "." + fileExtension;
                    // self.uploadFiles.push({
                    //     progressPercentage: 0,
                    //     name: item.name
                    // });
                    (function (i) {                
                        return  Upload.upload({                  
                            url:   'http://123.56.135.196:4102/api/uploading',
                            fields:  {
                                'username':  $scope.username
                            },
                            file:  file              
                        }).progress(function  (evt)  {                
                            $scope.showProgress  =  true;                
                            var  progressPercentage  =  parseInt(100.0  *  evt.loaded  /  evt.total); //上传百分比
                            for (var i = 0; i < self.uploadFiles.length; i++) {
                                if (self.uploadFiles[i].name === evt.config.file.name) {
                                    self.uploadFiles[i].progressPercentage  = progressPercentage;
                                }
                            }
                            console.log('progress: '  +  progressPercentage  +  '% '  +  evt.config.file.name);              
                        }).success(function  (data,  status,  headers,  config)  {                
                            $scope.showProgress  =  true;
                            self.selectedAPKModule.filePath = data.url;
                            console.log('file '  +  config.file.name  +  'uploaded. Response: ',  data);                
                            console.log("size:"  +  (config.file.size / 1000).toFixed(2)); //一个文件上传成功
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
                    if (self.selectedAPKModule.tags[i].version === version) {
                        alert('该版本号已存在');
                        return false;
                    } else if (self.selectedAPKModule.tags[i].version > version) {
                        alert('该版本号小于已存在的版本号');
                        return false;
                    }
                }
                return true;
            }
        }

        function _refreshApkList(data) {
            self.apkModuleList.splice(0, self.apkModuleList.length);
            for (var i = 0; i < data.length; i++) {
                self.apkModuleList.push(data[i]);
            }
        }

        function _initData() {
            // self.apkModuleList.push({
            //     name: "Shinetek-View",
            //     title: "全球图像浏览服务",
            //     tags: [{
            //         version: "v0.0.1",
            //         varDate: new Date("2017-01-03 20:00"),
            //         content: "",
            //         filePath: ""
            //     }, {
            //         version: "v0.0.2",
            //         varDate: new Date("2017-03-03 20:00"),
            //         content: "",
            //         filePath: ""
            //     }, {
            //         version: "v0.0.3",
            //         varDate: new Date("2017-04-05 3:00"),
            //         content: "",
            //         filePath: ""
            //     }]
            // });

            // self.apkModuleList.push({
            //     name: "ShinetekView-SnapshotServer",
            //     title: "ShinetekView-App的快照服务",
            //     tags: [{
            //         version: "v0.0.1",
            //         varDate: new Date("2017-01-03 20:00"),
            //         content: "",
            //         filePath: ""
            //     }, {
            //         version: "v0.0.2",
            //         varDate: new Date("2017-04-03 15:00"),
            //         content: "",
            //         filePath: ""
            //     }]
            // });
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
            }
            self.selectedAPKModule = apkModule;
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