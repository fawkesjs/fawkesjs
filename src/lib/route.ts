import * as express from "express";
import * as path from "path";
import * as _ from "underscore";
import { Config } from "../config";
import { ICtrl, IError, IPreCtrl, IRoute, IRoutesConfig } from "../interfaces";
import { Helper } from "../lib/helper";

export class Route {
  public static activate(app: express.Express, routes: IRoute[], prefix: string, routesConfig: IRoutesConfig) {
    for (const route of routes) {
      let remote = route.remote;
      remote = remote.replace("{", ":").replace("}", "");
      app.route(prefix + remote)[route.method](
        (req, res, next) => {
          let preCtrls = [];
          let errHandler = Helper.errCb;
          if (route.errHandler) {
            errHandler = route.errHandler;
          } else if (routesConfig.errHandler) {
            errHandler = routesConfig.errHandler;
          }
          if (routesConfig.preCtrls) {
            preCtrls = routesConfig.preCtrls;
          } else {
            for (const o of Helper.globFiles(Config.get().outDir
            + Config.get().middlewareDir + "/index" + Config.get().extension)) {
              const tmp = require(path.resolve(o));
              preCtrls = tmp.preCtrls;
            }
          }
          let sequence = Promise.resolve({ route, req });
          for (const preCtrl of preCtrls) {
            sequence = sequence.then(preCtrl);
          }
          sequence
            .then((data: any) => {
              delete data.route;
              data.res = res;
              const ctrl: ICtrl = data;
              route.func(ctrl);
            })
            .catch((err) => {
              errHandler(err, res);
            });
        },
      );
    }
  }
  public static swagger(routes: IRoute[], prefix: string) {
    const path = {};
    for (const route of routes) {
      if (route.swagger === false) {
        continue;
      }
      const remote = route.remote;
      if (!path[prefix + remote]) {
        path[prefix + remote] = {};
      }
      let tmp = (remote[0] === "/") ? remote.substr(1) : remote;
      const tmp2 = (prefix[0] === "/") ? prefix.substr(1) : prefix;
      tmp = tmp.substr(0, tmp.indexOf("/"));
      let tag = tmp.length ? tmp2 + "/" + tmp : tmp2;
      tag = tag.replace("/", "_");
      path[prefix + remote][route.method] = {
        consumes : [
          "application/json",
        ],
        produces: [
          "application/json",
        ],
        responses: {
          200: {
            description: "Success",
          },
          400: {
            description: "Bad Param",
          },
          401: {
            description: "Authorization Required",
          },
        },
        tags: [tag],
      };
      if (route.parameters) {
        path[prefix + remote][route.method].parameters = route.parameters;
      }
      if (route.swagger) {
        _.extend(path[prefix + remote][route.method], route.swagger);
      }
    }
    return path;
  }
}
