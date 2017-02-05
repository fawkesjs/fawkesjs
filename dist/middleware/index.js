"use strict";
var validator = require("validator");
var ref_1 = require("../ref");
var numberTypes = ["integer", "number"];
function isInt(n) {
    return n % 1 === 0;
}
function convertion(q, tmp) {
    if (typeof q === 'string' && tmp.type === 'integer') {
        q = parseInt(q);
    }
    else if (typeof q === 'string' && tmp.type === 'number') {
        q = parseFloat(q);
    }
    if (typeof q === 'string' && tmp.type === 'boolean') {
        if (q === 'true') {
            q = true;
        }
        else if (q === 'false') {
            q = false;
        }
    }
    return q;
}
function verifyArg(v, de, fmt) {
    var errs = [];
    if (fmt.default && typeof v === 'undefined') {
        v = fmt.default;
    }
    if (fmt.required && typeof v === 'undefined') {
        errs.push({ field: fmt.name, type: "required" });
    }
    if (typeof v === 'undefined') {
        return errs;
    }
    var lengthOpt = {
        min: fmt.minLength ? fmt.minLength : 0,
        max: fmt.maxLength ? fmt.maxLength : undefined
    };
    if (fmt.type === 'string') {
        if (typeof v !== 'string') {
            errs.push({ field: fmt.name, type: "string" });
        }
        else if (fmt.format === 'uuid' && !validator.isUUID(v)) {
            errs.push({ field: fmt.name, type: "uuid" });
        }
        else if (!validator.isLength(v, lengthOpt)) {
            errs.push({ field: fmt.name, type: "strlen" });
        }
    }
    if (numberTypes.indexOf(fmt.type) !== -1) {
        if (typeof v !== 'number') {
            errs.push({ field: fmt.name, type: "number" });
        }
        else if (v != de) {
            errs.push({ field: fmt.name, type: fmt.type });
        }
        else if (!isInt(v)) {
            errs.push({ field: fmt.name, type: "integer" });
        }
        else if (typeof fmt.maximum !== 'undefined' && v > fmt.maximum) {
            errs.push({ field: fmt.name, type: "maximum" });
        }
        else if (typeof fmt.minimum !== 'undefined' && v < fmt.minimum) {
            errs.push({ field: fmt.name, type: "minimum" });
        }
    }
    if (fmt.type === 'boolean' && typeof v !== 'boolean') {
        errs.push({ field: fmt.name, type: "boolean" });
    }
    return errs;
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
                    var q = void 0, de = void 0;
                    if (tmp.in === 'path' && typeof (req.params[tmp.name]) !== 'undefined') {
                        de = req.params[tmp.name];
                        arg[tmp.name] = convertion(de, tmp);
                    }
                    if (tmp.in === 'query' && typeof (req.query[tmp.name]) !== 'undefined') {
                        de = req.query[tmp.name];
                        arg[tmp.name] = convertion(de, tmp);
                    }
                    if (tmp.in === 'formData' && typeof (req.body[tmp.name]) !== 'undefined') {
                        de = req.body[tmp.name];
                        arg[tmp.name] = convertion(de, tmp);
                    }
                    if (tmp.in === 'body') {
                        arg = req.body;
                        continue;
                    }
                    errs = errs.concat(verifyArg(arg[tmp.name], de, tmp));
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
