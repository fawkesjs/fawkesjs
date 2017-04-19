import * as bodyParser from "body-parser";
import * as express from "express";
import * as fs from "fs";
import * as path from "path";
import * as _ from "underscore";
import { Config } from "../config";
import { Helper } from "../lib/helper";
import { Route } from "../lib/route";
import { Orm } from "../orm";
export class Fawkes {
  public static activateRoute(app) {
    const preRoute = Config.get().outDir + Config.get().routeDir;
    const postRoute = "/index" + Config.get().extension;
    for (let route of Helper.globFiles(preRoute + "/**" + postRoute)) {
      const theRoute = require(path.resolve(route));
      route = route.substring(preRoute.length);
      route = route.substring(route.length - postRoute.length, -1);
      const routesConfig = theRoute.config || {};
      Route.activate(app, theRoute.routes, route, routesConfig);
    }
  }
  public static initClass() {
    Config.get();
    if (typeof Config.ormDir === "string") {
      Orm.get();
    }
  }
  public static app() {
    Fawkes.initClass();
    const app: express.Express = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    return app;
  }
  public static async generateSwaggerAsync(location) {
    const preRoute = Config.get().outDir + Config.get().routeDir;
    const postRoute = "/index" + Config.get().extension;

    const sj = {
      "consumes": [
        "application/json",
      ],
      "definitions": {
      },
      "info": {
        "contact": {
          "name": "Swagger API Team",
        },
        "description": "A sample API that uses swagger-2.0 specification",
        "license": {
          "name": "MIT",
        },
        "termsOfService": "http://swagger.io/terms/",
        "title": "Swagger",
        "version": "1.0.0",
      },
      "paths": {
      },
      "produces": [
        "application/json",
      ],
      "schemes": [
        "http",
      ],
      "securityDefinitions": {
        "api_scheme_name": {
          "in": "header",
          "name": "Authorization",
          "type": "apiKey",
        },
      },
      "swagger": "2.0",
    };
    const env = process.env.NODE_ENV || "development";
    for (const o of Helper.globFiles(Config.get().outDir
    + Config.get().configDir + "/swagger" + Config.get().extension)) {
      const tmp = require(path.resolve(o));
      _.extend(sj, tmp);
    }
    for (const o of Helper.globFiles(Config.get().outDir + Config.get().configDir
    + "/swagger." + env + Config.get().extension)) {
      const tmp = require(path.resolve(o));
      _.extend(sj, tmp);
    }
    for (let route of Helper.globFiles(preRoute + "/**" + postRoute)) {
      const theRoute = require(path.resolve(route));
      route = route.substring(preRoute.length);
      route = route.substring(route.length - postRoute.length, -1);
      if (theRoute.config && typeof theRoute.config.swagger !== "undefined" && theRoute.config.swagger === false) {
          continue;
      }
      _.extend(sj.paths, Route.swagger(theRoute.routes, route));
    }
    return new Promise((resolve, reject) => {
      fs.writeFile(location, JSON.stringify(sj), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({location});
        }
      });
    });
  }
}
