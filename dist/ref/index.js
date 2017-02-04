"use strict";
var ErrorCode = (function () {
    function ErrorCode() {
    }
    return ErrorCode;
}());
ErrorCode.REST_PARAM_ERROR = 601;
ErrorCode.ACL_ERROR = 602;
ErrorCode.ACCESS_TOKEN_EXPIRED = 603;
exports.ErrorCode = ErrorCode;
