import * as path from "path";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as _ from "underscore";
import * as fs from 'fs';
import { Helper } from '../lib/helper'
import { Config } from '../config'
import { Orm } from '../orm'
import { Route } from '../lib/route'
export class Fawkes {
  static activateRoute(app) {
    let preRoute = Config.get().outDir + Config.get().routeDir
    let postRoute = '/index' + Config.get().extension
    for (let route of Helper.globFiles(preRoute + '/**' + postRoute)) {
      let theRoute = require(path.resolve(route))
      route = route.substring(preRoute.length)
      route = route.substring(route.length - postRoute.length, -1)
      Route.activate(app, theRoute.routes, route)
    }
  }
  static initClass() {
    Config.get()
    Orm.get()
  }
  static app() {
    Fawkes.initClass()
    let app: express.Express = express();
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }));
    return app;
  }
  static async generateSwaggerAsync(location) {
    let preRoute = Config.get().outDir + Config.get().routeDir
    let postRoute = '/index' + Config.get().extension

    let sj = {
      "swagger": "2.0",
      "info": {
        "version": "1.0.0",
        "title": "Swagger",
        "description": "A sample API that uses swagger-2.0 specification",
        "termsOfService": "http://swagger.io/terms/",
        "contact": {
          "name": "Swagger API Team"
        },
        "license": {
          "name": "MIT"
        }
      },
      "schemes": [
        "http"
      ],
      "consumes": [
        "application/json"
      ],
      "produces": [
        "application/json"
      ],
      "paths": {
      },
      "definitions": {
      },
      "securityDefinitions": {
        "api_scheme_name": {
          "type": "apiKey",
          "name": "Authorization",
          "in": "header"
        }
      }
    }
    let env = process.env.NODE_ENV || "development"
    for (let o of Helper.globFiles(Config.get().outDir + Config.get().configDir + '/swagger' + Config.get().extension)) {
      let tmp = require(path.resolve(o))
      _.extend(sj, tmp)
    }
    for (let o of Helper.globFiles(Config.get().outDir + Config.get().configDir + '/swagger.' + env + Config.get().extension)) {
      let tmp = require(path.resolve(o))
      _.extend(sj, tmp)
    }
    for (let route of Helper.globFiles(preRoute + '/**' + postRoute)) {
      let theRoute = require(path.resolve(route))
      route = route.substring(preRoute.length)
      route = route.substring(route.length - postRoute.length, -1)
      _.extend(sj.paths, Route.swagger(theRoute.routes, route, theRoute.swagger))
    }
    return new Promise(function(resolve, reject) {
      fs.writeFile(location, JSON.stringify(sj), function(err) {
        if (err) {
          reject(err)
        } else {
          resolve({location})
        }
      })
    });
  }
}
