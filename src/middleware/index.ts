import * as _ from "underscore";
import * as validator from "validator";
import { IError, IPreCtrl, IRoute, IRouteParameter } from "../interfaces";
import { BaseError } from "../lib/baseError";
import { ErrorCode } from "../ref";
const numberTypes = ["integer", "number"];
export interface IParseArg {
  arg: any;
  errs: any[];
}
const notSupportError = new BaseError(ErrorCode.REST_PARAM_NOT_SUPPORTED, 400);
function isInt(n) {
  return n % 1 === 0;
}
function convertion(q, tmp: IRouteParameter) {
  if (typeof q === "string" && tmp.type === "integer") {
    q = parseInt(q, 10);
  } else if (typeof q === "string" && tmp.type === "number") {
    q = parseFloat(q);
  }
  if (typeof q === "string" && tmp.type === "boolean") {
    if (q === "true") {
      q = true;
    } else if (q === "false") {
      q = false;
    }
  }
  return q;
}
/**
 * TODO: some cleanup on the function, or to seperate this middleware to different package
 * @param v
 * @param de
 * @param fmt
 */
function parseArg(v, de, fmt): IParseArg {
  let errs = [];
  if (typeof fmt.default !== "undefined" && typeof v === "undefined") {
    v = fmt.default;
  }
  if (fmt.required && typeof v === "undefined") {
    errs.push({ field: fmt.name, type: "required" });
  }
  if (typeof v === "undefined") {
    return {arg: v, errs};
  }
  const lengthOpt = {
    max: fmt.maxLength ? fmt.maxLength : undefined,
    min: fmt.minLength ? fmt.minLength : 0,
  };
  if (fmt.type === "string") {
    if (typeof v !== "string") {
      errs.push({ field: fmt.name, type: "string" });
    } else if (v !== fmt.default && fmt.format === "uuid" && !validator.isUUID(v)) {
      errs.push({ field: fmt.name, type: "uuid" });
    } else if (v !== fmt.default && fmt.format === "email" && !validator.isEmail(v)) {
      errs.push({ field: fmt.name, type: "email" });
    } else if (!validator.isLength(v, lengthOpt)) {
      errs.push({ field: fmt.name, type: "strlen" });
    }
  }
  if (numberTypes.indexOf(fmt.type) !== -1) {
    if (typeof v !== "number") {
      errs.push({ field: fmt.name, type: "number" });
    } else if (!isInt(v) && fmt.type === "integer") {
      errs.push({ field: fmt.name, type: "integer" });
    } else if (typeof fmt.maximum !== "undefined" && v > fmt.maximum) {
      errs.push({ field: fmt.name, type: "maximum" });
    } else if (typeof fmt.minimum !== "undefined" && v < fmt.minimum) {
      errs.push({ field: fmt.name, type: "minimum" });
    }
  }
  if (fmt.type === "object") {
    if (typeof v !== "object") {
      errs.push({ field: fmt.name, type: "object" });
    } else {
      const tmp = parseObjectSchema(v, fmt);
      v = tmp.arg;
      errs = errs.concat(tmp.errs);
    }
  }
  if (fmt.type === "array") {
    if (!Array.isArray(v)) {
      errs.push({ field: fmt.name, type: "array" });
    } else if (!fmt.items) {
      throw notSupportError;
    } else if (fmt.minItems && v.length < fmt.minItems) {
      errs.push({ field: fmt.name, type: "minItems" });
    } else if (fmt.maxItems && v.length > fmt.maxItems) {
      errs.push({ field: fmt.name, type: "maxItems" });
    } else {
      if (fmt.items.properties) {
        for (const prop in fmt.items.properties) {
          if (fmt.items.properties.hasOwnProperty(prop)) {
            for (const vv of v) {
              const tmp = parseArg(vv[prop], vv[prop], fmt.items.properties[prop]);
              errs = errs.concat(tmp.errs);
            }
          }
        }
      } else {
        for (const vv of v) {
          const tmp = parseArg(vv, vv, fmt.items);
          errs = errs.concat(tmp.errs);
        }
      }
      if (fmt.items.required && fmt.items.required.length) {
        const requires = fmt.items.required;
        for (const ii of requires) {
          const require = ii;
          for (const jj of v) {
            if (typeof jj[require] === "undefined") {
              errs.push({field: fmt.name + "." + require, type: "required"});
            }
          }
        }
      }
    }
  }
  if (fmt.type === "boolean" && typeof v !== "boolean") {
    errs.push({ field: fmt.name, type: "boolean" });
  }
  return {arg: v, errs};
}
function parseObjectSchema(obj, schema) {
  let errs = [];
  const arg = {};
  const properties = schema.properties || [];
  if (schema.type !== "object") {
    throw notSupportError;
  }
  if (schema.required) {
    for (const prop in properties) {
      if (!properties.hasOwnProperty(prop)) {
        continue;
      }
      if (typeof obj[prop] === "undefined" && typeof properties[prop].default !== "undefined") {
        obj[prop] = properties[prop].default;
      } else if (typeof obj[prop] === "undefined") {
        continue;
      }
      arg[prop] = obj[prop];
      // since is using json, we dont do type convertion here
      // should use another function, probably
      properties[prop].name = prop;
      const tmp = parseArg(obj[prop], obj[prop], properties[prop]);
      obj[prop] = tmp.arg;
      errs = errs.concat(tmp.errs);
    }
    for (const ii of schema.required) {
      const prop = ii;
      if (typeof obj[prop] === "undefined") {
        errs.push({field: prop, type: "required"});
      }
    }
  }
  return {arg, errs};
}
export class RestMiddleware {
  public static async processArgAsync(preCtrl: IPreCtrl) {
    let errs = [];
    const arg = {};
    const req = preCtrl.req;
    const route: IRoute = preCtrl.route;
    try {
      if (route.parameters) {
        for (const ii of route.parameters) {
          const param = ii;
          let de;
          if (param.in === "path" && typeof (req.params[param.name]) !== "undefined") {
            de = req.params[param.name];
            arg[param.name] = convertion(de, param);
          }
          if (param.in === "query" && typeof (req.query[param.name]) !== "undefined") {
            de = req.query[param.name];
            arg[param.name] = convertion(de, param);
          }
          if (param.in === "formData" && typeof (req.body[param.name]) !== "undefined") {
            de = req.body[param.name];
            arg[param.name] = convertion(de, param);
          }
          if (param.in === "body") {
            // if dont define properties, use req.body in controller
            if (param.required && typeof req.body === "undefined") {
              errs.push({field: param.name, type: "required"});
            } else if (!param.schema || !param.schema.properties) {
              throw notSupportError;
            } else {
              const tmp = parseObjectSchema(req.body, param.schema);
              _.extend(arg, tmp.arg);
              errs = errs.concat(tmp.errs);
            }
            continue;
          }
          const tmp2 = parseArg(arg[param.name], de, param);
          arg[param.name] = tmp2.arg;
          errs = errs.concat(tmp2.errs);
        }
      }
      if (errs.length) {
        const restParamError = new BaseError(ErrorCode.REST_PARAM_ERROR, 400, errs);
        throw restParamError;
      }
      preCtrl.arg = arg;
      return Promise.resolve(preCtrl);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
