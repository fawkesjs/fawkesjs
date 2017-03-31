import { sync } from "glob";
import { union } from "lodash";
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
    let statusCode = err.statusCode ? err.statusCode : 500
    delete err.statusCode
    res.status(statusCode).json(err)
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
