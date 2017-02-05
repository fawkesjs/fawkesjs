import * as path from "path";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as _ from "underscore";
import * as fs from 'fs';
import { Config } from '../config'
import { Route } from '../lib/route'
export class Fawkes {
  static activateRoute(app) {
    let preRoute = Config.outDir + Config.routeDir
    let postRoute = '/index' + Config.extension
    for (let route of Config.globFiles(preRoute + '/**' + postRoute)) {
      let theRoute = require(path.resolve(route))
      route = route.substring(preRoute.length)
      route = route.substring(route.length - postRoute.length, -1)
      Route.activate(app, theRoute.routes, route)
    }
  }
  static app() {
    let app: express.Express = express();
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }));
    return app;
  }
  static generateSwagger(location) {
    let preRoute = Config.outDir + Config.routeDir
    let postRoute = '/index' + Config.extension

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
    for (let o of Config.globFiles(Config.outDir + Config.configDir + '/swagger' + Config.extension)) {
      let tmp = require(path.resolve(o))
      _.extend(sj, tmp)
    }
    for (let o of Config.globFiles(Config.outDir + Config.configDir + '/swagger.' + env + Config.extension)) {
      let tmp = require(path.resolve(o))
      _.extend(sj, tmp)
    }
    for (let route of Config.globFiles(preRoute + '/**' + postRoute)) {
      let theRoute = require(path.resolve(route))
      route = route.substring(preRoute.length)
      route = route.substring(route.length - postRoute.length, -1)
      _.extend(sj.paths, Route.swagger(theRoute.routes, route, theRoute.swagger))
    }
    fs.writeFile(location, JSON.stringify(sj))
  }
}
