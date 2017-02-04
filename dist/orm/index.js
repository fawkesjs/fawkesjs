"use strict";
var path = require("path");
var config_1 = require("../config");
var Sequelize = require("sequelize");
var Orm = (function () {
    function Orm() {
    }
    return Orm;
}());
Orm.init = false;
Orm.sequelize = null;
Orm.models = {};
exports.Orm = Orm;
if (config_1.Config.init && !Orm.init && config_1.Config.useSequelize !== false) {
    var config = config_1.Config.datasource.db;
    var sequelize = new Sequelize(config.database, config.username, config.password, config);
    for (var _i = 0, _a = config_1.Config.globFiles(config_1.Config.outDir + config_1.Config.ormDir + '/index' + config_1.Config.extension); _i < _a.length; _i++) {
        var o = _a[_i];
        var m = require(path.resolve(o));
        for (var i = 0; i < m.ormDefinitions.length; i++) {
            var model = m.ormDefinitions[i](sequelize);
            Orm.models[model.name] = model;
        }
    }
    Object.keys(Orm.models).forEach(function (modelName) {
        if ("associate" in Orm.models[modelName]) {
            Orm.models[modelName].associate(Orm.models);
        }
    });
    Orm.sequelize = sequelize;
}
