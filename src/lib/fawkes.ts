import * as bodyParser from "body-parser";
import * as express from "express";
import * as fs from "fs";
import * as path from "path";
import * as _ from "underscore";
import { Config } from "../config";
import { Helper } from "../lib/helper";
import { Route } from "../lib/route";

/**
 * This is the main class to do config initiation.
 */
export class Fawkes {
  /**
   * express routing base on our route folder
   */
  public static activateRoute(app, di: any) {
    const config = new Config();
    const preRoute = config.outDir + config.routeDir;
    const postRoute = "/index" + config.extension;
    for (let route of Helper.globFiles(preRoute + "/**" + postRoute)) {
      const theRoute = require(path.resolve(route));
      route = route.substring(preRoute.length);
      route = route.substring(route.length - postRoute.length, -1);
      const routesConfig = theRoute.config || {};
      Route.activate(app, di, theRoute.routes, route, routesConfig);
    }
  }
  /**
   * for generating swagger document, which is triggered when we call fawkesjs -s ./swagger/swagger.json
   */
  public static async generateSwaggerAsync(location) {
    const config = new Config();
    const preRoute = config.outDir + config.routeDir;
    const postRoute = "/index" + config.extension;

    const sj = {
      consumes: [
        "application/json",
      ],
      definitions: {
      },
      info: {
        contact: {
          name: "Swagger API Team",
        },
        description: "A sample API that uses swagger-2.0 specification",
        license: {
          name: "MIT",
        },
        termsOfService: "http://swagger.io/terms/",
        title: "Swagger",
        version: "1.0.0",
      },
      paths: {
      },
      produces: [
        "application/json",
      ],
      schemes: [
        "http",
      ],
      securityDefinitions: {
        api_scheme_name: {
          in: "header",
          name: "Authorization",
          type: "apiKey",
        },
      },
      swagger: "2.0",
    };
    const env = process.env.NODE_ENV || "development";
    for (const o of Helper.globFiles(config.outDir
    + config.configDir + "/swagger" + config.extension)) {
      const tmp = require(path.resolve(o));
      _.extend(sj, tmp);
    }
    for (const o of Helper.globFiles(config.outDir + config.configDir
    + "/swagger." + env + config.extension)) {
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
