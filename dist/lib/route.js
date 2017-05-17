"use strict";
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
                var sequence = Promise.resolve({ route: route, req: req });
                for (var _d = 0, preCtrls_1 = preCtrls; _d < preCtrls_1.length; _d++) {
                    var preCtrl = preCtrls_1[_d];
                    sequence = sequence.then(preCtrl);
                }
                sequence
                    .then(function (data) {
                    delete data.route;
                    data.res = res;
                    var ctrl = data;
                    return route.func(ctrl);
                })
                    .catch(function (err) {
                    errHandler(err, res);
                });
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
