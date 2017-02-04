import { IError, IPreCtrl, IRoute } from "../interfaces";
import * as validator from 'validator';
import { ErrorCode } from '../ref'
const stringTypes = ["email", "uuid", "string", "password"]
const numberTypes = ["integer", "number"]
function isInt(n) {
  return n % 1 === 0;
}
export class RestMiddleware {
  static processArgAsync(preCtrl: IPreCtrl) {
    let sequence = Promise.resolve()
    let route: IRoute = preCtrl.route
    let req = preCtrl.req
    return sequence.then(() => {
      let arg = {}
      let errs = []
      if (route.parameters) {
        for (var i = 0; i < route.parameters.length; i++) {
          let tmp = route.parameters[i]
          if (tmp.in === 'path' && typeof (req.params[tmp.name]) !== 'undefined') {
            let q = req.params[tmp.name]
            if (typeof q === 'string' && tmp.type === 'integer') {
              q = parseInt(q)
            } else if (typeof q === 'string' && tmp.type === 'number') {
              q = parseFloat(q)
            }
            if (q != q) {
              errs.push({ field: tmp.name, type: "number" })
            }
            arg[tmp.name] = q
          }
          if (tmp.in === 'query' && typeof (req.query[tmp.name]) !== 'undefined') {
            let q = req.query[tmp.name]
            if (typeof q === 'string' && tmp.type === 'integer') {
              q = parseInt(q)
            } else if (typeof q === 'string' && tmp.type === 'number') {
              q = parseFloat(q)
            }
            if (q != q) {
              errs.push({ field: tmp.name, type: "number" })
            }
            arg[tmp.name] = q
          }
          if (tmp.in === 'formData' && typeof (req.body[tmp.name]) !== 'undefined') {
            arg[tmp.name] = req.body[tmp.name]
          }
          let v = arg[tmp.name]
          if (tmp.default && typeof v === 'undefined') {
            v = tmp.default
          }
          if (tmp.required && typeof v === 'undefined') {
            errs.push({ field: tmp.name, type: "required" })
          }
          if (v !== 'undefined') {
            let lengthOpt = {
              min: tmp.minLength ? 0 : tmp.minLength,
              max: tmp.maxLength ? 0 : tmp.maxLength
            }
            if (stringTypes.indexOf(tmp.type) !== -1 && typeof v !== 'string') {
              errs.push({ field: tmp.name, type: "string" })
            } else if (tmp.type === 'uuid' && !validator.isUUID(v)) {
              errs.push({ field: tmp.name, type: "uuid" })
            } else if (!validator.isLength(v, lengthOpt)) {
              errs.push({ field: tmp.name, type: "strlen" })
            }
            if (numberTypes.indexOf(tmp.type) !== -1 && typeof v !== 'number') {
              errs.push({ field: tmp.name, type: "number" })
            } else if (tmp.type === 'integer' && !isInt(v)) {
              errs.push({ field: tmp.name, type: "integer" })
            } else if (typeof tmp.maximum !== 'undefined' && v > tmp.maximum) {
              errs.push({ field: tmp.name, type: "maximum" })
            } else if (typeof tmp.minimum !== 'undefined' && v < tmp.minimum) {
              errs.push({ field: tmp.name, type: "minimum" })
            }
          }
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
    }).catch(err => {
      return Promise.reject(err)
    })
  }
}
