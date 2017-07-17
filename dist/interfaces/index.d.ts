import * as express from "express";
export interface ICtrl {
    req: express.Request;
    res: express.Response;
    accountId?: string;
    arg: any;
}
export interface IOrm {
    models: any;
    init: boolean;
    sequelize: any;
}
export interface IPreCtrl {
    route: any;
    req: any;
    accountId?: string;
    arg?: any;
    cb: any;
}
export interface IRoute {
    remote: string;
    method: string;
    acl?: any;
    swagger?: any;
    parameters?: IRouteParameter[];
    func(ctrl: ICtrl): any;
    errHandler?(err: any, res: express.Response): any;
}
export interface IRouteParameter {
    name: string;
    in: string;
    description?: string;
    required?: boolean;
    type?: string;
    format?: string;
    schema?: any;
    items?: any;
    collectionFormat?: string;
    default?: any;
    maximum?: number;
    exclusiveMaximum?: boolean;
    minimum?: number;
    exclusiveMinimum?: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
    enum?: any;
    multipleOf?: number;
}
export interface IError {
    statusCode?: number;
    errorCode?: number;
    name?: string;
    message?: string;
    data?: any;
}
export interface IRoutesConfig {
    swagger?: boolean;
    preCtrls?: any[];
    errHandler?(err: any, res: express.Response, req: express.Request): any;
}
