"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var helper_1 = require("../lib/helper");
/**
 * const config = new Config() // this create a new instance of config
 * const config2 = new Config({singleton: true}); // this create/return a singleton
 */
var Config = /** @class */ (function () {
    function Config(option) {
        this.port = 3000;
        this.outDir = "./app";
        this.extension = ".js";
        this.configDir = "/config";
        this.middlewareDir = "/middleware";
        this.routeDir = "/route";
        this.useSequelize = true;
        this.datasource = {
            db: {},
        };
        this.configKey = [
            "port", "init", "outDir", "middlewareDir", "routeDir", "ormDir", "useSequelize",
        ];
        if (helper_1.Helper.objGet(option, "singleton", false)) {
            if (typeof Config.singleton !== "undefined") {
                return Config.singleton;
            }
        }
        var env = process.env.NODE_ENV || "development";
        for (var _i = 0, _a = helper_1.Helper.globFiles(this.outDir + this.configDir + "/config" + this.extension); _i < _a.length; _i++) {
            var o = _a[_i];
            var tmp = require(path.resolve(o));
            for (var v in tmp) {
                if (tmp.hasOwnProperty(v) && this.configKey.indexOf(v) !== -1) {
                    this[v] = tmp[v];
                }
            }
        }
        for (var _b = 0, _c = helper_1.Helper.globFiles(this.outDir + this.configDir + "/config." + env + this.extension); _b < _c.length; _b++) {
            var o = _c[_b];
            var tmp = require(path.resolve(o));
            for (var v in tmp) {
                if (tmp.hasOwnProperty(v) && this.configKey.indexOf(v) !== -1) {
                    this[v] = tmp[v];
                }
            }
        }
        for (var _d = 0, _e = helper_1.Helper.globFiles(this.outDir + this.configDir + "/datasource" + this.extension); _d < _e.length; _d++) {
            var o = _e[_d];
            var tmp = require(path.resolve(o));
            this.datasource = tmp;
        }
        for (var _f = 0, _g = helper_1.Helper.globFiles(this.outDir + this.configDir + "/datasource." + env + this.extension); _f < _g.length; _f++) {
            var o = _g[_f];
            var tmp = require(path.resolve(o));
            this.datasource = tmp;
        }
        if (helper_1.Helper.objGet(option, "singleton", false)) {
            Config.singleton = this;
        }
        return this;
    }
    return Config;
}());
exports.Config = Config;
