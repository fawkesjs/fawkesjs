import * as path from "path";
import * as _ from "underscore";
import { Helper } from "../lib/helper";

/**
 * const config = new Config() // this create a new instance of config
 * const config2 = new Config({singleton: true}); // this create/return a singleton
 */
export class Config {
  private static singleton: Config;
  public port: number = 3000;
  public outDir: string = "./app";
  public extension: string = ".js";
  public configDir: string = "/config";
  public middlewareDir: string = "/middleware";
  public routeDir: string = "/route";
  public ormDir: string = "/orm";
  public useSequelize: boolean = true;
  public datasource: any = {
    db: {
    },
  };
  private configKey: string[] = [
    "port", "init", "outDir", "middlewareDir", "routeDir", "ormDir", "useSequelize",
  ];
  constructor(option?: {singleton: boolean}) {
    if (Helper.objGet(option, "singleton", false)) {
      if (typeof Config.singleton !== "undefined") {
        return Config.singleton;
      }
    }
    const env = process.env.NODE_ENV || "development";
    for (const o of Helper.globFiles(this.outDir + this.configDir + "/config" + this.extension)) {
      const tmp = require(path.resolve(o));
      for (const v in tmp) {
        if (tmp.hasOwnProperty(v) && this.configKey.indexOf(v) !== -1) {
          this[v] = tmp[v];
        }
      }
    }
    for (const o of Helper.globFiles(this.outDir + this.configDir + "/config." + env + this.extension)) {
      const tmp = require(path.resolve(o));
      for (const v in tmp) {
        if (tmp.hasOwnProperty(v) && this.configKey.indexOf(v) !== -1) {
          this[v] = tmp[v];
        }
      }
    }
    for (const o of Helper.globFiles(this.outDir + this.configDir + "/datasource" + this.extension)) {
      const tmp = require(path.resolve(o));
      this.datasource = tmp;
    }
    for (const o of Helper.globFiles(this.outDir + this.configDir + "/datasource." + env + this.extension)) {
      const tmp = require(path.resolve(o));
      this.datasource = tmp;
    }
    if (Helper.objGet(option, "singleton", false)) {
      Config.singleton = this;
    }
    return this;
  }
}
