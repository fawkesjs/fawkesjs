"use strict";
var glob_1 = require("glob");
var lodash_1 = require("lodash");
var path = require("path");
var _ = require("underscore");
var Config = (function () {
    function Config() {
    }
    Config.globFiles = function (location) {
        return lodash_1.union([], glob_1.sync(location));
    };
    return Config;
}());
Config.port = 3000;
Config.init = false;
Config.outDir = './src';
Config.extension = '.ts';
Config.configDir = "/config";
Config.middlewareDir = "/middleware";
Config.routeDir = "/route";
Config.ormDir = "/orm";
Config.useSequelize = true;
Config.datasource = {
    db: {}
};
exports.Config = Config;
if (!Config.init) {
    var env = process.env.NODE_ENV || "development";
    var baseConfig = require(path.resolve(Config.outDir + Config.configDir + '/config' + Config.extension));
    _.extend(Config, baseConfig);
    for (var _i = 0, _a = Config.globFiles(Config.outDir + Config.configDir + '/config.' + env + Config.extension); _i < _a.length; _i++) {
        var config = _a[_i];
        var conf = require(path.resolve(config));
        _.extend(Config, conf);
    }
    var baseDatasource = require(path.resolve(Config.outDir + Config.configDir + '/datasource' + Config.extension));
    _.extend(Config.datasource, baseDatasource);
    for (var _b = 0, _c = Config.globFiles(Config.outDir + Config.configDir + '/datasource.' + env + Config.extension); _b < _c.length; _b++) {
        var datasource = _c[_b];
        var conf = require(path.resolve(datasource));
        _.extend(Config.datasource, conf);
    }
    Config.init = true;
    for (var prop in Config) {
        Object.defineProperty(Config, prop, { writable: false });
    }
}
