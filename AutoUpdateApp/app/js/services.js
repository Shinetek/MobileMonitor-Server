/**
 * Created by FanTaSyLin on 2017/3/27.
 */

(function () {

    "use strict";

    angular.module("AutoUpdate")
        .factory("AutoUpdateServices", AutoUpdateServicesFn);

    AutoUpdateServicesFn.$inject = ["$http"];

    function AutoUpdateServicesFn($http) {
        var services = {
            submitRelease: _submitRelease,
            getAPKList: _getAPKList
        };

        return services;

        function _submitRelease(module, successFn, errorFn) {
            $http.post("http://localhost:4102/api/release", module).success(successFn).error(errorFn);
        }

        function _getAPKList(successFn, errorFn) {
            $http.get("http://localhost:4102/api/release").success(successFn).error(errorFn);
        }
    }

})();