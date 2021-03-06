"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var glob_1 = require("glob");
var lodash_1 = require("lodash");
var baseError_1 = require("../lib/baseError");
var Helper = /** @class */ (function () {
    function Helper() {
    }
    Helper.globFiles = function (location) {
        return lodash_1.union([], glob_1.sync(location));
    };
    Helper.transactionCommitAsync = function (t, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, t.commit()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(data)];
                }
            });
        });
    };
    Helper.transactionRollbackAsync = function (t, err) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, t.rollback()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.reject(err)];
                }
            });
        });
    };
    Helper.errCb = function (err, res, req, di) {
        var theErr;
        if (err instanceof baseError_1.BaseError) {
            theErr = {
                data: err.data,
                errorCode: typeof err.errorCode === "number" ? err.errorCode : 0,
            };
        }
        else {
            theErr = {
                errorCode: typeof err === "object" && typeof err.errorCode === "number" ? err.errorCode : 0,
            };
        }
        var statusCode = typeof err === "object" && typeof err.statusCode === "number" ?
            err.statusCode : 500;
        res.status(statusCode).json(theErr);
    };
    Helper.objGet = function (obj, fmt, o) {
        var v = obj;
        var fmts = fmt.split(".");
        for (var _i = 0, fmts_1 = fmts; _i < fmts_1.length; _i++) {
            var theFmt = fmts_1[_i];
            // if is not object or is null, return default
            if (typeof v !== "object" || !v) {
                return o;
            }
            if (typeof v[theFmt] !== "undefined") {
                v = v[theFmt];
            }
            else {
                v = o;
                break;
            }
        }
        return v;
    };
    return Helper;
}());
exports.Helper = Helper;
