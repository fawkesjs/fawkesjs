import { sync } from "glob";
import { union } from "lodash";
import * as _ from "underscore";
import { BaseError } from "../lib/baseError";

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
  public static errCb(err, res, req, di) {
    let theErr;
    if (err instanceof BaseError) {
      theErr = {
        data: err.data,
        errorCode: typeof err.errorCode === "number" ? err.errorCode : 0,
      };
    } else {
      theErr = {
        errorCode: typeof err === "object" && typeof err.errorCode === "number" ? err.errorCode : 0,
      };
    }
    const statusCode = typeof err === "object" && typeof err.statusCode === "number" ?
      err.statusCode : 500;
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
