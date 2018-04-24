export declare class BaseError extends Error {
    errorCode: any;
    statusCode: any;
    data: any;
    constructor(errorCode: any, statusCode: any, data?: any);
}
