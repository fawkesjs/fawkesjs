import * as fs from "fs";
import * as path from "path";
import * as Sequelize from "sequelize";
import * as _ from "underscore";
import { Config } from "../config";
import { Helper } from "../lib/helper";

/**
 * const orm = new Orm(new Config()) // this create a new instance of Orm
 * const orm2 = new Orm(new Config(), {singleton: true}) // this create/return a singleton
 */
export class Orm {
  private static singleton: Orm;
  public sequelize: any = null;
  public models: any = {};

  constructor(config: Config, option?: {singleton: boolean}) {
    if (Helper.objGet(option, "singleton", false)) {
      if (typeof Orm.singleton !== "undefined") {
        return Orm.singleton;
      }
    }
    const dbConfig = config.datasource.db;
    const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
    for (const o of Helper.globFiles(config.outDir + config.ormDir + "/index" + config.extension)) {
      const m = require(path.resolve(o));
      for (const ii of m.ormDefinitions) {
        const model = ii(sequelize);
        this.models[model.name] = model;
      }
    }
    Object.keys(this.models).forEach((modelName) => {
      if ("associate" in this.models[modelName]) {
        this.models[modelName].associate(this.models);
      }
    });
    this.sequelize = sequelize;

    if (Helper.objGet(option, "singleton", false)) {
      Orm.singleton = this;
    }
    return this;
  }
}
