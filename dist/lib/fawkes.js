"use strict";
var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var _ = require("underscore");
var fs = require("fs");
var config_1 = require("../config");
var route_1 = require("../lib/route");
var Fawkes = (function () {
    function Fawkes() {
    }
    Fawkes.activateRoute = function (app) {
        var preRoute = config_1.Config.outDir + config_1.Config.routeDir;
        var postRoute = '/index' + config_1.Config.extension;
        for (var _i = 0, _a = config_1.Config.globFiles(preRoute + '/**' + postRoute); _i < _a.length; _i++) {
            var route = _a[_i];
            var theRoute = require(path.resolve(route));
            route = route.substring(preRoute.length);
            route = route.substring(route.length - postRoute.length, -1);
            route_1.Route.activate(app, theRoute.routes, route);
        }
    };
    Fawkes.app = function () {
        var app = express();
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        return app;
    };
    Fawkes.generateSwagger = function (location) {
        var preRoute = config_1.Config.outDir + config_1.Config.routeDir;
        var postRoute = '/index' + config_1.Config.extension;
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
        for (var _i = 0, _a = config_1.Config.globFiles(preRoute + '/**' + postRoute); _i < _a.length; _i++) {
            var route = _a[_i];
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
