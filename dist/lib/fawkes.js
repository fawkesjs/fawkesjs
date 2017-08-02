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
var bodyParser = require("body-parser");
var express = require("express");
var fs = require("fs");
var path = require("path");
var _ = require("underscore");
var config_1 = require("../config");
var helper_1 = require("../lib/helper");
var route_1 = require("../lib/route");
/**
 * This is the main class to do config initiation.
 */
var Fawkes = (function () {
    function Fawkes() {
    }
    /**
     * express routing base on our route folder
     */
    Fawkes.activateRoute = function (app) {
        var config = new config_1.Config();
        var preRoute = config.outDir + config.routeDir;
        var postRoute = "/index" + config.extension;
        for (var _i = 0, _a = helper_1.Helper.globFiles(preRoute + "/**" + postRoute); _i < _a.length; _i++) {
            var route = _a[_i];
            var theRoute = require(path.resolve(route));
            route = route.substring(preRoute.length);
            route = route.substring(route.length - postRoute.length, -1);
            var routesConfig = theRoute.config || {};
            route_1.Route.activate(app, theRoute.routes, route, routesConfig);
        }
    };
    /**
     * initializing our config and orm and returning express app
     */
    Fawkes.app = function () {
        var app = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        return app;
    };
    /**
     * for generating swagger document, which is triggered when we call fawkesjs -s ./swagger/swagger.json
     */
    Fawkes.generateSwaggerAsync = function (location) {
        return __awaiter(this, void 0, void 0, function () {
            var config, preRoute, postRoute, sj, env, _i, _a, o, tmp, _b, _c, o, tmp, _d, _e, route, theRoute;
            return __generator(this, function (_f) {
                config = new config_1.Config();
                preRoute = config.outDir + config.routeDir;
                postRoute = "/index" + config.extension;
                sj = {
                    consumes: [
                        "application/json",
                    ],
                    definitions: {},
                    info: {
                        contact: {
                            name: "Swagger API Team",
                        },
                        description: "A sample API that uses swagger-2.0 specification",
                        license: {
                            name: "MIT",
                        },
                        termsOfService: "http://swagger.io/terms/",
                        title: "Swagger",
                        version: "1.0.0",
                    },
                    paths: {},
                    produces: [
                        "application/json",
                    ],
                    schemes: [
                        "http",
                    ],
                    securityDefinitions: {
                        api_scheme_name: {
                            in: "header",
                            name: "Authorization",
                            type: "apiKey",
                        },
                    },
                    swagger: "2.0",
                };
                env = process.env.NODE_ENV || "development";
                for (_i = 0, _a = helper_1.Helper.globFiles(config.outDir
                    + config.configDir + "/swagger" + config.extension); _i < _a.length; _i++) {
                    o = _a[_i];
                    tmp = require(path.resolve(o));
                    _.extend(sj, tmp);
                }
                for (_b = 0, _c = helper_1.Helper.globFiles(config.outDir + config.configDir
                    + "/swagger." + env + config.extension); _b < _c.length; _b++) {
                    o = _c[_b];
                    tmp = require(path.resolve(o));
                    _.extend(sj, tmp);
                }
                for (_d = 0, _e = helper_1.Helper.globFiles(preRoute + "/**" + postRoute); _d < _e.length; _d++) {
                    route = _e[_d];
                    theRoute = require(path.resolve(route));
                    route = route.substring(preRoute.length);
                    route = route.substring(route.length - postRoute.length, -1);
                    if (theRoute.config && typeof theRoute.config.swagger !== "undefined" && theRoute.config.swagger === false) {
                        continue;
                    }
                    _.extend(sj.paths, route_1.Route.swagger(theRoute.routes, route));
                }
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        fs.writeFile(location, JSON.stringify(sj), function (err) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve({ location: location });
                            }
                        });
                    })];
            });
        });
    };
    return Fawkes;
}());
exports.Fawkes = Fawkes;
