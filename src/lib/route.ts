import * as express from "express";
import * as _ from "underscore";
import * as path from "path";
import { Config } from "../config";
import { ICtrl, IRoutes, IError, IPreCtrl } from "../interfaces";
import { Helper } from '../lib/helper'

export let Route = {
  activate(app: express.Express, routes: IRoutes, prefix: string): void {
    for (let route of routes) {
      let remote = route.remote
      remote = remote.replace('{', ':').replace('}', '')
      app.route(prefix + remote)[route.method](
        (req, res, next) => {
          let preCtrls = []
          for (let o of Config.globFiles(Config.outDir + Config.middlewareDir + '/index' + Config.extension)) {
            let tmp = require(path.resolve(o))
            preCtrls = tmp.preCtrls
          }
          let sequence = Promise.resolve({ route, req })
          for (let i = 0; i < preCtrls.length; i++) {
            sequence = sequence.then(preCtrls[i]);
          }
          sequence
            .then((data: any) => {
              delete data.route
              data.res = res
              let ctrl: ICtrl = data
              route.func(ctrl)
            })
            .catch(err => {
              Helper.errCb(err, res)
            })
        }
      )
    }
  },
  swagger(routes: IRoutes, prefix: string, swaggerDefault: any) {
    let path = {}
    for (let route of routes) {
      if (route.swagger === false || swaggerDefault === false) {
        continue
      }
      let remote = route.remote
      if (!path[prefix + remote]) {
        path[prefix + remote] = {}
      }
      let tmp = (remote[0] == '/') ? remote.substr(1) : remote
      let tmp2 = (prefix[0] == '/') ? prefix.substr(1) : prefix
      tmp = tmp.substr(0, tmp.indexOf('/'))
      let tag = tmp.length ? tmp2 + '/' + tmp : tmp2
      tag = tag.replace('/', '_')
      path[prefix + remote][route.method] = {
        "tags": [tag],
        "produces": [
          "application/json"
        ],
      }
      if (route.parameters) {
        path[prefix + remote][route.method]["parameters"] = route.parameters
      }
      if (swaggerDefault) {
        _.extend(path[prefix + remote][route.method], swaggerDefault)
      }
      if (route.swagger) {
        _.extend(path[prefix + remote][route.method], route.swagger)
      }
    }
    return path
  }
}
