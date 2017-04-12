/**
 * Created by FanTaSyLin on 2017/3/27.
 */


(function () {
    
    angular.module("AutoUpdate")
        .config(AutoUpdateConfig);

    AutoUpdateConfig.$inject = ["$httpProvider"];

    function AutoUpdateConfig($httpProvider) {
         $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
         delete $httpProvider.defaults.headers.common['X-Requested-With'];
         $httpProvider.defaults.headers.common = {};
    }
    
})();