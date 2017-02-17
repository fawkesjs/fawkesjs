"use strict";
var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var _ = require("underscore");
var fs = require("fs");
var helper_1 = require("../lib/helper");
var config_1 = require("../config");
var orm_1 = require("../orm");
var route_1 = require("../lib/route");
var Fawkes = (function () {
    function Fawkes() {
    }
    Fawkes.activateRoute = function (app) {
        var preRoute = config_1.Config.get().outDir + config_1.Config.get().routeDir;
        var postRoute = '/index' + config_1.Config.get().extension;
        for (var _i = 0, _a = helper_1.Helper.globFiles(preRoute + '/**' + postRoute); _i < _a.length; _i++) {
            var route = _a[_i];
            var theRoute = require(path.resolve(route));
            route = route.substring(preRoute.length);
            route = route.substring(route.length - postRoute.length, -1);
            route_1.Route.activate(app, theRoute.routes, route);
        }
    };
    Fawkes.initClass = function () {
        config_1.Config.get();
        orm_1.Orm.get();
    };
    Fawkes.app = function () {
        Fawkes.initClass();
        var app = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        return app;
    };
    Fawkes.generateSwagger = function (location) {
        var preRoute = config_1.Config.get().outDir + config_1.Config.get().routeDir;
        var postRoute = '/index' + config_1.Config.get().extension;
        var sj = {
            "swagger": "2.0",
            "info": {
                "version": "1.0.0",
                "title": "Swagger",
                "description": "A sample API that uses swagger-2.0 specification",
                "termsOfService": "http://swagger.io/terms/",
                "contact": {
                    "name": "Swagger API Team"
                },
                "license": {
                    "name": "MIT"
                }
            },
            "schemes": [
                "http"
            ],
            "consumes": [
                "application/json"
            ],
            "produces": [
                "application/json"
            ],
            "paths": {},
            "definitions": {},
            "securityDefinitions": {
                "api_scheme_name": {
                    "type": "apiKey",
                    "name": "Authorization",
                    "in": "header"
                }
            }
        };
        var env = process.env.NODE_ENV || "development";
        for (var _i = 0, _a = helper_1.Helper.globFiles(config_1.Config.get().outDir + config_1.Config.get().configDir + '/swagger' + config_1.Config.get().extension); _i < _a.length; _i++) {
            var o = _a[_i];
            var tmp = require(path.resolve(o));
            _.extend(sj, tmp);
        }
        for (var _b = 0, _c = helper_1.Helper.globFiles(config_1.Config.get().outDir + config_1.Config.get().configDir + '/swagger.' + env + config_1.Config.get().extension); _b < _c.length; _b++) {
            var o = _c[_b];
            var tmp = require(path.resolve(o));
            _.extend(sj, tmp);
        }
        for (var _d = 0, _e = helper_1.Helper.globFiles(preRoute + '/**' + postRoute); _d < _e.length; _d++) {
            var route = _e[_d];
            var theRoute = require(path.resolve(route));
            route = route.substring(preRoute.length);
            route = route.substring(route.length - postRoute.length, -1);
            _.extend(sj.paths, route_1.Route.swagger(theRoute.routes, route, theRoute.swagger));
        }
        fs.writeFile(location, JSON.stringify(sj));
    };
    return Fawkes;
}());
exports.Fawkes = Fawkes;
