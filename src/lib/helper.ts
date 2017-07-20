import { sync } from "glob";
import { union } from "lodash";
import * as _ from "underscore";

export class Helper {
  public static globFiles(location: string): string[] {
    return union([], sync(location));
  }
  public static async transactionCommitAsync(t, data) {
    await t.commit();
    return Promise.resolve(data);
  }
  public static async transactionRollbackAsync(t, err) {
    await t.rollback();
    return Promise.reject(err);
  }
  public static errCb(err, res, req) {
    const theErr = _.clone(err);
    const statusCode = theErr.statusCode ? theErr.statusCode : 500;
    delete theErr.statusCode;
    res.status(statusCode).json(theErr);
  }
  public static objGet(obj: any, fmt: string, o: any) {
    let v = obj;
    const fmts = fmt.split(".");
    for (const theFmt of fmts) {
      // if is not object or is null, return default
      if (typeof v !== "object" || !v) {
        return o;
      }
      if (typeof v[theFmt] !== "undefined") {
        v = v[theFmt];
      } else {
        v = o;
        break;
      }
    }
    return v;
  }
}
