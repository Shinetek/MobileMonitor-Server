/**
 * Created by FanTaSyLin on 2017/3/30.
 */


(function () {

    "use strict";

    var app = angular.module("AutoUpdate");

    app.filter("to_trusted", toTrusted);

    app.filter("getUpdatedTime", getUpdatedTime);

    function getUpdatedTime() {
        return function (items) {
            items.sort(function (a, b) {
                return a.version < b.version;
            });
            return moment(items[0].varDate).format("YYYY-MM-DD HH:mm");
        }
    }

    toTrusted.$inject = ["$sce"];
    function toTrusted($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }

})()