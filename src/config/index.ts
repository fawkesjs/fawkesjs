import * as path from "path";
import * as _ from "underscore";
import {Helper} from "../lib/helper";
export class Config {
  public static port: number = 3000;
  public static init: boolean = false;
  public static outDir: string = "./app";
  public static extension: string = ".ts";
  public static configDir: string = "/config";
  public static middlewareDir: string = "/middleware";
  public static routeDir: string = "/route";
  public static ormDir: string = "/orm";
  public static useSequelize: boolean = true;
  public static datasource: any = {
    db: {
    },
  };
  public static get() {
    if (!Config.init) {
      const env = process.env.NODE_ENV || "development";
      for (const o of Helper.globFiles(Config.outDir + Config.configDir + "/config" + Config.extension)) {
        const tmp = require(path.resolve(o));
        _.extend(Config, tmp);
      }
      for (const o of Helper.globFiles(Config.outDir + Config.configDir + "/config." + env + Config.extension)) {
        const tmp = require(path.resolve(o));
        _.extend(Config, tmp);
      }
      for (const o of Helper.globFiles(Config.outDir + Config.configDir + "/datasource" + Config.extension)) {
        const tmp = require(path.resolve(o));
        _.extend(Config.datasource, tmp);
      }
      for (const o of Helper.globFiles(Config.outDir + Config.configDir + "/datasource." + env + Config.extension)) {
        const tmp = require(path.resolve(o));
        _.extend(Config.datasource, tmp);
      }
      Config.init = true;
      for (const prop in Config) {
        if (Config.hasOwnProperty(prop)) {
          Object.defineProperty(Config, prop, { writable: false });
        }
      }
      return Config;
    } else {
      return Config;
    }
  }
}
