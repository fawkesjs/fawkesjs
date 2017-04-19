import * as express from "express";
import { IRoute, IRoutesConfig } from "../interfaces";
export declare class Route {
    static activate(app: express.Express, routes: IRoute[], prefix: string, routesConfig: IRoutesConfig): void;
    static swagger(routes: IRoute[], prefix: string): {};
}
