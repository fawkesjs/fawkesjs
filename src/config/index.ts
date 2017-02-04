import { sync } from "glob";
import { union } from "lodash";
import * as path from "path";
import * as _ from "underscore";
export class Config {
  static port: number = 3000
  static init: boolean = false
  static outDir: string = './src'
  static extension: string = '.ts'
  static configDir: string = "/config"
  static middlewareDir: string = "/middleware"
  static routeDir: string = "/route"
  static ormDir: string = "/orm"
  static globFiles(location: string): Array<string> {
    return union([], sync(location));
  }
  static useSequelize: boolean = true
  static datasource: any = {
    db: {
    }
  }
}
if (!Config.init) {
  let env = process.env.NODE_ENV || "development"
  let baseConfig = require(path.resolve(Config.outDir + Config.configDir + '/config' + Config.extension))
  _.extend(Config, baseConfig)
  for (let config of Config.globFiles(Config.outDir + Config.configDir + '/config.' + env + Config.extension)) {
    let conf = require(path.resolve(config))
    _.extend(Config, conf)
  }
  let baseDatasource = require(path.resolve(Config.outDir + Config.configDir + '/datasource' + Config.extension))
  _.extend(Config.datasource, baseDatasource)
  for (let datasource of Config.globFiles(Config.outDir + Config.configDir + '/datasource.' + env + Config.extension)) {
    let conf = require(path.resolve(datasource))
    _.extend(Config.datasource, conf)
  }
  Config.init = true
  for (let prop in Config) {
    Object.defineProperty(Config, prop, { writable: false });
  }
}
