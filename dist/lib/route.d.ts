import * as express from "express";
import { IRoutes, IRoutesConfig } from "../interfaces";
export declare class Route {
    static activate(app: express.Express, routes: IRoutes, prefix: string, routesConfig: IRoutesConfig): void;
    static swagger(routes: IRoutes, prefix: string): {};
}
