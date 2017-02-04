import * as fs from "fs";
import * as path from "path";
import { Config } from "../config";
import * as Sequelize from "sequelize";
import * as _ from "underscore";

export class Orm {
  static init: boolean = false
  static sequelize: any = null
  static models: any = {}
}
if (Config.init && !Orm.init && Config.useSequelize !== false) {
  let config = Config.datasource.db;
  let sequelize = new Sequelize(config.database, config.username, config.password, config);
  for (let o of Config.globFiles(Config.outDir + Config.ormDir + '/index' + Config.extension)) {
    let m = require(path.resolve(o))
    for (var i = 0; i < m.ormDefinitions.length; i++) {
      let model = m.ormDefinitions[i](sequelize)
      Orm.models[model.name] = model;
    }
  }
  Object.keys(Orm.models).forEach(function(modelName) {
    if ("associate" in Orm.models[modelName]) {
      Orm.models[modelName].associate(Orm.models);
    }
  })
  Orm.sequelize = sequelize
}
