"use strict";
var path = require("path");
var Sequelize = require("sequelize");
var helper_1 = require("../lib/helper");
var Orm = (function () {
    function Orm(config, option) {
        var _this = this;
        this.sequelize = null;
        this.models = {};
        if (helper_1.Helper.objGet(option, "singleton", false)) {
            if (typeof Orm.singleton !== "undefined") {
                return Orm.singleton;
            }
        }
        var dbConfig = config.datasource.db;
        var sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
        for (var _i = 0, _a = helper_1.Helper.globFiles(config.outDir + config.ormDir + "/index" + config.extension); _i < _a.length; _i++) {
            var o = _a[_i];
            var m = require(path.resolve(o));
            for (var _b = 0, _c = m.ormDefinitions; _b < _c.length; _b++) {
                var ii = _c[_b];
                var model = ii(sequelize);
                this.models[model.name] = model;
            }
        }
        Object.keys(this.models).forEach(function (modelName) {
            if ("associate" in _this.models[modelName]) {
                _this.models[modelName].associate(_this.models);
            }
        });
        this.sequelize = sequelize;
        if (helper_1.Helper.objGet(option, "singleton", false)) {
            Orm.singleton = this;
        }
        return this;
    }
    return Orm;
}());
exports.Orm = Orm;
