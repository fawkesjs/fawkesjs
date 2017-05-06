"use strict";
var path = require("path");
var _ = require("underscore");
var helper_1 = require("../lib/helper");
var Config = (function () {
    function Config() {
    }
    Config.get = function () {
        if (!Config.init) {
            var env = process.env.NODE_ENV || "development";
            for (var _i = 0, _a = helper_1.Helper.globFiles(Config.outDir + Config.configDir + "/config" + Config.extension); _i < _a.length; _i++) {
                var o = _a[_i];
                var tmp = require(path.resolve(o));
                _.extend(Config, tmp);
            }
            for (var _b = 0, _c = helper_1.Helper.globFiles(Config.outDir + Config.configDir + "/config." + env + Config.extension); _b < _c.length; _b++) {
                var o = _c[_b];
                var tmp = require(path.resolve(o));
                _.extend(Config, tmp);
            }
            for (var _d = 0, _e = helper_1.Helper.globFiles(Config.outDir + Config.configDir + "/datasource" + Config.extension); _d < _e.length; _d++) {
                var o = _e[_d];
                var tmp = require(path.resolve(o));
                _.extend(Config.datasource, tmp);
            }
            for (var _f = 0, _g = helper_1.Helper.globFiles(Config.outDir + Config.configDir + "/datasource." + env + Config.extension); _f < _g.length; _f++) {
                var o = _g[_f];
                var tmp = require(path.resolve(o));
                _.extend(Config.datasource, tmp);
            }
            Config.init = true;
            for (var prop in Config) {
                if (Config.hasOwnProperty(prop)) {
                    Object.defineProperty(Config, prop, { writable: false });
                }
            }
            return Config;
        }
        else {
            return Config;
        }
    };
    return Config;
}());
Config.port = 3000;
Config.init = false;
Config.outDir = "./app";
Config.extension = ".js";
Config.configDir = "/config";
Config.middlewareDir = "/middleware";
Config.routeDir = "/route";
Config.ormDir = "/orm";
Config.useSequelize = true;
Config.datasource = {
    db: {},
};
exports.Config = Config;
