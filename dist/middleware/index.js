"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var validator = require("validator");
var _ = require("underscore");
var ref_1 = require("../ref");
var numberTypes = ["integer", "number"];
var notSupportError = {
    statusCode: 400,
    errorCode: ref_1.ErrorCode.REST_PARAM_NOT_SUPPORTED
};
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
        else if (fmt.format === 'email' && !validator.isEmail(v)) {
            errs.push({ field: fmt.name, type: "email" });
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
    if (fmt.type === 'object') {
        throw notSupportError;
    }
    if (fmt.type === 'array') {
        if (!Array.isArray(v)) {
            errs.push({ field: fmt.name, type: "array" });
        }
        else if (!fmt.items || !fmt.items.properties) {
            throw notSupportError;
        }
        else {
            if (fmt.items.required && fmt.items.required.length) {
                var requires = fmt.items.required;
                for (var i = 0; i < requires.length; i++) {
                    var require_1 = requires[i];
                    for (var j = 0; j < v.length; j++) {
                        if (typeof v[j][require_1] === 'undefined') {
                            errs.push({ field: fmt.name + '.' + require_1, type: "required" });
                        }
                    }
                }
            }
            for (var prop in fmt.items.properties) {
                errs = errs.concat(verifyArg(v[prop], v[prop], fmt.items.properties[prop]));
            }
        }
    }
    if (fmt.type === 'boolean' && typeof v !== 'boolean') {
        errs.push({ field: fmt.name, type: "boolean" });
    }
    return errs;
}
function verifyBodySchema(body, schema) {
    var errs = [];
    var arg = {};
    var properties = schema.properties || [];
    if (schema.type !== 'object') {
        throw notSupportError;
    }
    if (schema.required) {
        for (var i = 0; i < schema.required.length; i++) {
            var prop = schema.required[i];
            if (typeof body[prop] === 'undefined') {
                errs.push({ field: prop, type: "required" });
            }
        }
        for (var prop in properties) {
            if (typeof body[prop] === 'undefined' && typeof properties[prop].default !== 'undefined') {
                body[prop] = properties[prop].default;
            }
            else if (typeof body[prop] === 'undefined') {
                continue;
            }
            arg[prop] = body[prop];
            // since is using json, we dont do type convertion here
            // should use another function, probably
            properties[prop].name = prop;
            errs = errs.concat(verifyArg(body[prop], body[prop], properties[prop]));
        }
    }
    return { arg: arg, errs: errs };
}
var RestMiddleware = (function () {
    function RestMiddleware() {
    }
    RestMiddleware.processArgAsync = function (preCtrl) {
        return __awaiter(this, void 0, void 0, function () {
            var sequence, route, req;
            return __generator(this, function (_a) {
                sequence = Promise.resolve();
                route = preCtrl.route;
                req = preCtrl.req;
                return [2 /*return*/, sequence.then(function () {
                        var arg = {};
                        var errs = [];
                        if (route.parameters) {
                            for (var i = 0; i < route.parameters.length; i++) {
                                var param = route.parameters[i];
                                var q = void 0, de = void 0;
                                if (param.in === 'path' && typeof (req.params[param.name]) !== 'undefined') {
                                    de = req.params[param.name];
                                    arg[param.name] = convertion(de, param);
                                }
                                if (param.in === 'query' && typeof (req.query[param.name]) !== 'undefined') {
                                    de = req.query[param.name];
                                    arg[param.name] = convertion(de, param);
                                }
                                if (param.in === 'formData' && typeof (req.body[param.name]) !== 'undefined') {
                                    de = req.body[param.name];
                                    arg[param.name] = convertion(de, param);
                                }
                                if (param.in === 'body') {
                                    // if dont define properties, use req.body in controller
                                    if (param.required && typeof req.body === 'undefined') {
                                        errs.push({ field: param.name, type: 'required' });
                                    }
                                    else if (!param.schema || !param.schema.properties) {
                                        throw notSupportError;
                                    }
                                    else {
                                        var tmp = verifyBodySchema(req.body, param.schema);
                                        _.extend(arg, tmp.arg);
                                        errs = errs.concat(tmp.errs);
                                    }
                                    continue;
                                }
                                errs = errs.concat(verifyArg(arg[param.name], de, param));
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
                    })];
            });
        });
    };
    return RestMiddleware;
}());
exports.RestMiddleware = RestMiddleware;
