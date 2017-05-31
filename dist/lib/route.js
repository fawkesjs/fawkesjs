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
var path = require("path");
var _ = require("underscore");
var config_1 = require("../config");
var helper_1 = require("../lib/helper");
var Route = (function () {
    function Route() {
    }
    Route.activate = function (app, routes, prefix, routesConfig) {
        var _loop_1 = function (route) {
            var remote = route.remote;
            remote = remote.replace("{", ":").replace("}", "");
            app.route(prefix + remote)[route.method](function (req, res, next) {
                var preCtrls = [];
                var errHandler = helper_1.Helper.errCb;
                if (route.errHandler) {
                    errHandler = route.errHandler;
                }
                else if (routesConfig.errHandler) {
                    errHandler = routesConfig.errHandler;
                }
                else {
                    for (var _i = 0, _a = helper_1.Helper.globFiles(config_1.Config.get().outDir
                        + config_1.Config.get().middlewareDir + "/index" + config_1.Config.get().extension); _i < _a.length; _i++) {
                        var o = _a[_i];
                        var tmp = require(path.resolve(o));
                        if (tmp.errHandler) {
                            errHandler = tmp.errHandler;
                        }
                    }
                }
                if (routesConfig.preCtrls) {
                    preCtrls = routesConfig.preCtrls;
                }
                else {
                    for (var _b = 0, _c = helper_1.Helper.globFiles(config_1.Config.get().outDir
                        + config_1.Config.get().middlewareDir + "/index" + config_1.Config.get().extension); _b < _c.length; _b++) {
                        var o = _c[_b];
                        var tmp = require(path.resolve(o));
                        if (tmp.preCtrls) {
                            preCtrls = tmp.preCtrls;
                        }
                    }
                }
                function doSequence() {
                    return __awaiter(this, void 0, void 0, function () {
                        var data, _i, preCtrls_1, preCtrl, ctrl, err_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 5, , 6]);
                                    data = { route: route, req: req };
                                    _i = 0, preCtrls_1 = preCtrls;
                                    _a.label = 1;
                                case 1:
                                    if (!(_i < preCtrls_1.length)) return [3 /*break*/, 4];
                                    preCtrl = preCtrls_1[_i];
                                    return [4 /*yield*/, preCtrl(data)];
                                case 2:
                                    data = _a.sent();
                                    _a.label = 3;
                                case 3:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 4:
                                    delete data.route;
                                    data.res = res;
                                    ctrl = data;
                                    return [2 /*return*/, route.func(ctrl)];
                                case 5:
                                    err_1 = _a.sent();
                                    errHandler(err_1, res);
                                    return [3 /*break*/, 6];
                                case 6: return [2 /*return*/];
                            }
                        });
                    });
                }
                doSequence();
            });
        };
        for (var _i = 0, routes_1 = routes; _i < routes_1.length; _i++) {
            var route = routes_1[_i];
            _loop_1(route);
        }
    };
    Route.swagger = function (routes, prefix) {
        var path = {};
        for (var _i = 0, routes_2 = routes; _i < routes_2.length; _i++) {
            var route = routes_2[_i];
            if (route.swagger === false) {
                continue;
            }
            var remote = route.remote;
            if (!path[prefix + remote]) {
                path[prefix + remote] = {};
            }
            var tmp = (remote[0] === "/") ? remote.substr(1) : remote;
            var tmp2 = (prefix[0] === "/") ? prefix.substr(1) : prefix;
            tmp = tmp.substr(0, tmp.indexOf("/"));
            var tag = tmp.length ? tmp2 + "/" + tmp : tmp2;
            tag = tag.replace("/", "_");
            path[prefix + remote][route.method] = {
                consumes: [
                    "application/json",
                ],
                produces: [
                    "application/json",
                ],
                responses: {
                    200: {
                        description: "Success",
                    },
                    400: {
                        description: "Bad Param",
                    },
                    401: {
                        description: "Authorization Required",
                    },
                },
                tags: [tag],
            };
            if (route.parameters) {
                path[prefix + remote][route.method].parameters = route.parameters;
            }
            if (route.swagger) {
                _.extend(path[prefix + remote][route.method], route.swagger);
            }
        }
        return path;
    };
    return Route;
}());
exports.Route = Route;
