"use strict";
var Helper = (function () {
    function Helper() {
    }
    Helper.transactionCommit = function (t, data) {
        var p1 = Promise.resolve(data);
        var p2 = t.commit();
        return Promise.all([p1, p2])
            .then(function (datas) {
            return Promise.resolve(datas[0]);
        });
    };
    Helper.transactionRollback = function (t, err) {
        return t.rollback()
            .then(function (data) {
            return Promise.reject(err);
        });
    };
    Helper.errCb = function (err, res) {
        var statusCode = err.statusCode ? err.statusCode : 500;
        delete err.statusCode;
        res.status(statusCode).json(err);
    };
    return Helper;
}());
exports.Helper = Helper;
