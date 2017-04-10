import { sync } from "glob";
import { union } from "lodash";
import * as _ from "underscore";

export class Helper {
  static globFiles(location: string): Array<string> {
    return union([], sync(location));
  }
  static async transactionCommitAsync(t, data) {
    await t.commit()
    return Promise.resolve(data)
  }
  static async transactionRollbackAsync(t, err) {
    await t.rollback()
    return Promise.reject(err)
  }
  static errCb(err, res) {
    let theErr = _.clone(err)
    let statusCode = theErr.statusCode ? theErr.statusCode : 500
    delete theErr.statusCode
    res.status(statusCode).json(theErr)
  }
  static objGet(obj:any, fmt:string, o:any) {
    var v = obj
    var fmts = fmt.split('.')
    for (var i=0;i<fmts.length;i++) {
      if (typeof v[fmts[i]] !== 'undefined') {
        v = v[fmts[i]]
      }
      else {
        v = o
        break
      }
    }
    return v
  }
}
