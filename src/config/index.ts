import { sync } from "glob";
import { union } from "lodash";
import * as path from "path";
import * as _ from "underscore";
export class Config {
  static port: number = 3000
  static init: boolean = false
  static outDir: string = './app'
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
  for (let o of Config.globFiles(Config.outDir + Config.configDir + '/config' + Config.extension)) {
    let tmp = require(path.resolve(o))
    _.extend(Config, tmp)
  }
  for (let o of Config.globFiles(Config.outDir + Config.configDir + '/config.' + env + Config.extension)) {
    let tmp = require(path.resolve(o))
    _.extend(Config, tmp)
  }
  for (let o of Config.globFiles(Config.outDir + Config.configDir + '/datasource' + Config.extension)) {
    let tmp = require(path.resolve(o))
    _.extend(Config.datasource, tmp)
  }
  for (let o of Config.globFiles(Config.outDir + Config.configDir + '/datasource.' + env + Config.extension)) {
    let tmp = require(path.resolve(o))
    _.extend(Config.datasource, tmp)
  }
  Config.init = true
  for (let prop in Config) {
    Object.defineProperty(Config, prop, { writable: false });
  }
}
