"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BaseError = /** @class */ (function (_super) {
    __extends(BaseError, _super);
    function BaseError(errorCode, statusCode, data) {
        var _this = 
        // Calling parent constructor of base Error class.
        _super.call(this, "Error Code: " + errorCode) || this;
        // Saving class name in the property of our custom error as a shortcut.
        _this.name = _this.constructor.name;
        // Capturing stack trace, excluding constructor call from it.
        Error.captureStackTrace(_this, _this.constructor);
        _this.statusCode = statusCode || 500;
        _this.errorCode = errorCode;
        if (typeof data !== "undefined") {
            _this.data = data;
        }
        return _this;
    }
    return BaseError;
}(Error));
exports.BaseError = BaseError;
