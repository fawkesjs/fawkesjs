"use strict";
var validator = require("validator");
var ref_1 = require("../ref");
var stringTypes = ["email", "uuid", "string", "password"];
var numberTypes = ["integer", "number"];
function isInt(n) {
    return n % 1 === 0;
}
var RestMiddleware = (function () {
    function RestMiddleware() {
    }
    RestMiddleware.processArgAsync = function (preCtrl) {
        var sequence = Promise.resolve();
        var route = preCtrl.route;
        var req = preCtrl.req;
        return sequence.then(function () {
            var arg = {};
            var errs = [];
            if (route.parameters) {
                for (var i = 0; i < route.parameters.length; i++) {
                    var tmp = route.parameters[i];
                    if (tmp.in === 'path' && typeof (req.params[tmp.name]) !== 'undefined') {
                        var q = req.params[tmp.name];
                        if (typeof q === 'string' && tmp.type === 'integer') {
                            q = parseInt(q);
                        }
                        else if (typeof q === 'string' && tmp.type === 'number') {
                            q = parseFloat(q);
                        }
                        if (q != req.body[tmp.name]) {
                            errs.push({ field: tmp.name, type: tmp.type });
                        }
                        arg[tmp.name] = q;
                    }
                    if (tmp.in === 'query' && typeof (req.query[tmp.name]) !== 'undefined') {
                        var q = req.query[tmp.name];
                        if (typeof q === 'string' && tmp.type === 'integer') {
                            q = parseInt(q);
                        }
                        else if (typeof q === 'string' && tmp.type === 'number') {
                            q = parseFloat(q);
                        }
                        if (q != req.body[tmp.name]) {
                            errs.push({ field: tmp.name, type: tmp.type });
                        }
                        arg[tmp.name] = q;
                    }
                    if (tmp.in === 'formData' && typeof (req.body[tmp.name]) !== 'undefined') {
                        var q = req.body[tmp.name];
                        if (typeof q === 'string' && tmp.type === 'integer') {
                            q = parseInt(q);
                        }
                        else if (typeof q === 'string' && tmp.type === 'number') {
                            q = parseFloat(q);
                        }
                        if (q != req.body[tmp.name]) {
                            errs.push({ field: tmp.name, type: tmp.type });
                        }
                        arg[tmp.name] = q;
                    }
                    var v = arg[tmp.name];
                    if (tmp.default && typeof v === 'undefined') {
                        v = tmp.default;
                    }
                    if (tmp.required && typeof v === 'undefined') {
                        errs.push({ field: tmp.name, type: "required" });
                    }
                    if (typeof v !== 'undefined') {
                        var lengthOpt = {
                            min: tmp.minLength ? 0 : tmp.minLength,
                            max: tmp.maxLength ? 0 : tmp.maxLength
                        };
                        if (stringTypes.indexOf(tmp.type) !== -1 && typeof v !== 'string') {
                            errs.push({ field: tmp.name, type: "string" });
                        }
                        else if (tmp.type === 'uuid' && !validator.isUUID(v)) {
                            errs.push({ field: tmp.name, type: "uuid" });
                        }
                        else if (stringTypes.indexOf(tmp.type) !== -1 && !validator.isLength(v, lengthOpt)) {
                            errs.push({ field: tmp.name, type: "strlen" });
                        }
                        if (numberTypes.indexOf(tmp.type) !== -1 && typeof v !== 'number') {
                            errs.push({ field: tmp.name, type: "number" });
                        }
                        else if (tmp.type === 'integer' && !isInt(v)) {
                            errs.push({ field: tmp.name, type: "integer" });
                        }
                        else if (typeof tmp.maximum !== 'undefined' && v >= tmp.maximum) {
                            errs.push({ field: tmp.name, type: "maximum" });
                        }
                        else if (typeof tmp.minimum !== 'undefined' && v <= tmp.minimum) {
                            errs.push({ field: tmp.name, type: "minimum" });
                        }
                    }
                }
            }
            if (errs.length) {
                var err = {
                    statusCode: 400,
                    errorCode: ref_1.ErrorCode.REST_PARAM_ERROR,
                    data: errs
                };
                throw err;
            }
            preCtrl.arg = arg;
            return Promise.resolve(preCtrl);
        }).catch(function (err) {
            return Promise.reject(err);
        });
    };
    return RestMiddleware;
}());
exports.RestMiddleware = RestMiddleware;
