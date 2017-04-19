import * as fs from "fs";
import * as path from "path";
import * as Sequelize from "sequelize";
import * as _ from "underscore";
import { Config } from "../config";
import { Helper } from "../lib/helper";

export class Orm {
  public static init: boolean = false;
  public static sequelize: any = null;
  public static models: any = {};
  public static get() {
    if (Config.init && !Orm.init && Config.useSequelize !== false) {
      const config = Config.datasource.db;
      const sequelize = new Sequelize(config.database, config.username, config.password, config);
      for (const o of Helper.globFiles(Config.outDir + Config.ormDir + "/index" + Config.extension)) {
        const m = require(path.resolve(o));
        for (const ii of m.ormDefinitions) {
          const model = ii(sequelize);
          Orm.models[model.name] = model;
        }
      }
      Object.keys(Orm.models).forEach((modelName) => {
        if ("associate" in Orm.models[modelName]) {
          Orm.models[modelName].associate(Orm.models);
        }
      });
      Orm.sequelize = sequelize;
    }
  }
}
