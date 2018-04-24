export class BaseError extends Error {
  public errorCode;
  public statusCode;
  public data;
  constructor(errorCode, statusCode, data?: any) {

    // Calling parent constructor of base Error class.
    super("Error Code: " + errorCode);

    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor);

    this.statusCode = statusCode || 500;
    this.errorCode = errorCode;
    if (typeof data !== "undefined") {
      this.data = data;
    }
  }
}
