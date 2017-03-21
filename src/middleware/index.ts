import { IError, IPreCtrl, IRoute, IRouteParameter } from "../interfaces";
import * as validator from 'validator';
import * as _ from 'underscore';
import { ErrorCode } from '../ref'
const numberTypes = ["integer", "number"]
export interface IParseArg {
  arg: any,
  errs: Array<any>
}
let notSupportError: IError = {
  statusCode: 400,
  errorCode: ErrorCode.REST_PARAM_NOT_SUPPORTED
}
function isInt(n) {
  return n % 1 === 0;
}
function convertion(q, tmp:IRouteParameter) {
  if (typeof q === 'string' && tmp.type === 'integer') {
    q = parseInt(q)
  } else if (typeof q === 'string' && tmp.type === 'number') {
    q = parseFloat(q)
  }
  if (typeof q === 'string' && tmp.type === 'boolean') {
    if (q === 'true') {
      q = true
    } else if (q === 'false') {
      q = false
    }
  }
  return q
}
function parseArg(v, de, fmt): IParseArg {
  let errs = []
  if (fmt.default && typeof v === 'undefined') {
    v = fmt.default
  }
  if (fmt.required && typeof v === 'undefined') {
    errs.push({ field: fmt.name, type: "required" })
  }
  if (typeof v === 'undefined') {
    return {arg: v, errs}
  }
  let lengthOpt = {
    min: fmt.minLength ? fmt.minLength : 0,
    max: fmt.maxLength ? fmt.maxLength : undefined
  }
  if (fmt.type === 'string') {
    if (typeof v !== 'string') {
      errs.push({ field: fmt.name, type: "string" })
    } else if (fmt.format === 'uuid' && !validator.isUUID(v)) {
      errs.push({ field: fmt.name, type: "uuid" })
    } else if (fmt.format === 'email' && !validator.isEmail(v)) {
      errs.push({ field: fmt.name, type: "email" })
    } else if (!validator.isLength(v, lengthOpt)) {
      errs.push({ field: fmt.name, type: "strlen" })
    }
  }
  if (numberTypes.indexOf(fmt.type) !== -1) {
    if (typeof v !== 'number') {
      errs.push({ field: fmt.name, type: "number" })
    } else if (v != de) { // this condition might happen if not pass from body
      errs.push({ field: fmt.name, type: fmt.type })
    } else if (!isInt(v)) {
      errs.push({ field: fmt.name, type: "integer" })
    } else if (typeof fmt.maximum !== 'undefined' && v > fmt.maximum) {
      errs.push({ field: fmt.name, type: "maximum" })
    } else if (typeof fmt.minimum !== 'undefined' && v < fmt.minimum) {
      errs.push({ field: fmt.name, type: "minimum" })
    }
  }
  if (fmt.type === 'object') {
    let tmp = parseObjectSchema(v, fmt.schema)
    v = tmp.arg
    errs = errs.concat(tmp.errs)
  }
  if (fmt.type === 'array') {
    if (!Array.isArray(v)) {
      errs.push({ field: fmt.name, type: "array" })
    } else if (!fmt.items || !fmt.items.properties) {
      throw notSupportError
    } else {
      for (let prop in fmt.items.properties) {
        let tmp = parseArg(v[prop], v[prop], fmt.items.properties[prop])
        v[prop] = tmp.arg
        errs = errs.concat(tmp.errs)
      }
      if (fmt.items.required && fmt.items.required.length) {
        let requires = fmt.items.required
        for (let i=0;i<requires.length;i++) {
          let require = requires[i]
          for (let j=0;j<v.length;j++) {
            if (typeof v[j][require] === 'undefined') {
              errs.push({field: fmt.name + '.' + require, type: "required"})
            }
          }
        }
      }
    }
  }
  if (fmt.type === 'boolean' && typeof v !== 'boolean') {
    errs.push({ field: fmt.name, type: "boolean" })
  }
  return {arg: v, errs};
}
function parseObjectSchema(obj, schema) {
  let errs = []
  let arg = {}
  let properties = schema.properties || []
  if (schema.type !== 'object') {
    throw notSupportError
  }
  if (schema.required) {
    for (let prop in properties) {
      if (typeof obj[prop] === 'undefined' && typeof properties[prop].default !== 'undefined') {
        obj[prop] = properties[prop].default
      } else if (typeof obj[prop] === 'undefined') {
        continue
      }
      arg[prop] = obj[prop]
      // since is using json, we dont do type convertion here
      // should use another function, probably
      properties[prop].name = prop
      let tmp = parseArg(obj[prop], obj[prop], properties[prop])
      obj[prop] = tmp.arg
      errs = errs.concat(tmp.errs)
    }
    for (let i=0;i<schema.required.length;i++) {
      let prop = schema.required[i]
      if (typeof obj[prop] === 'undefined') {
        errs.push({field: prop, type: "required"})
      }
    }
  }
  return {arg, errs};
}
export class RestMiddleware {
  static async processArgAsync(preCtrl: IPreCtrl) {
    let errs = []
    let arg = {}
    let req = preCtrl.req
    let route: IRoute = preCtrl.route
    try {
      if (route.parameters) {
        for (var i = 0; i < route.parameters.length; i++) {
          let param = route.parameters[i]
          let q, de
          if (param.in === 'path' && typeof (req.params[param.name]) !== 'undefined') {
            de = req.params[param.name]
            arg[param.name] = convertion(de, param)
          }
          if (param.in === 'query' && typeof (req.query[param.name]) !== 'undefined') {
            de = req.query[param.name]
            arg[param.name] = convertion(de, param)
          }
          if (param.in === 'formData' && typeof (req.body[param.name]) !== 'undefined') {
            de = req.body[param.name]
            arg[param.name] = convertion(de, param)
          }
          if (param.in === 'body') {
            // if dont define properties, use req.body in controller
            if (param.required && typeof req.body === 'undefined') {
              errs.push({field: param.name, type: 'required'})
            } else if (!param.schema || !param.schema.properties) {
              throw notSupportError
            } else {
              let tmp = parseObjectSchema(req.body, param.schema)
              _.extend(arg, tmp.arg)
              errs = errs.concat(tmp.errs)
            }
            continue
          }
          let tmp = parseArg(arg[param.name], de, param)
          arg[param.name] = tmp.arg
          errs = errs.concat(tmp.errs)
        }
      }
      if (errs.length) {
        let err: IError = {
          statusCode: 400,
          errorCode: ErrorCode.REST_PARAM_ERROR,
          data: errs
        }
        throw err
      }
      preCtrl.arg = arg
      return Promise.resolve(preCtrl)
    } catch(err) {
      return Promise.reject(err)
    }
  }
}
