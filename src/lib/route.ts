import * as express from "express";
import * as path from "path";
import * as _ from "underscore";
import { Config } from "../config";
import { ICtrl, IError, IPreCtrl, IRoute, IRoutesConfig } from "../interfaces";
import { Helper } from "../lib/helper";

export class Route {
  public static activate(app: express.Express, di: any, routes: IRoute[], prefix: string, routesConfig: IRoutesConfig) {
    const config = new Config();
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
          } else {
            for (const o of Helper.globFiles(config.outDir
            + config.middlewareDir + "/index" + config.extension)) {
              const tmp = require(path.resolve(o));
              if (tmp.errHandler) {
                errHandler = tmp.errHandler;
              }
            }
          }
          if (routesConfig.preCtrls) {
            preCtrls = routesConfig.preCtrls;
          } else {
            for (const o of Helper.globFiles(config.outDir
            + config.middlewareDir + "/index" + config.extension)) {
              const tmp = require(path.resolve(o));
              if (tmp.preCtrls) {
                preCtrls = tmp.preCtrls;
              }
            }
          }
          async function doSequence() {
            try {
              let data: any = { route, req, di };
              for (const preCtrl of preCtrls) {
                data = await preCtrl(data);
              }
              delete data.route;
              data.res = res;
              data.di = di;
              const ctrl: ICtrl = data;
              await route.func(ctrl);
            } catch (err) {
              errHandler(err, res, req);
            }
          }
          doSequence();
        },
      );
    }
  }
  public static swagger(routes: IRoute[], prefix: string) {
    const thePath = {};
    for (const route of routes) {
      if (route.swagger === false) {
        continue;
      }
      const remote = route.remote;
      if (!thePath[prefix + remote]) {
        thePath[prefix + remote] = {};
      }
      let tmp = (remote[0] === "/") ? remote.substr(1) : remote;
      const tmp2 = (prefix[0] === "/") ? prefix.substr(1) : prefix;
      tmp = tmp.substr(0, tmp.indexOf("/"));
      let tag = tmp.length ? tmp2 + "/" + tmp : tmp2;
      tag = tag.replace("/", "_");
      thePath[prefix + remote][route.method] = {
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
        thePath[prefix + remote][route.method].parameters = route.parameters;
      }
      if (route.swagger) {
        _.extend(thePath[prefix + remote][route.method], route.swagger);
      }
    }
    return thePath;
  }
}
