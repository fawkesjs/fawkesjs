import { IRoutes } from "../interfaces";
export declare let Route: {
    activate(app: any, routes: IRoutes, prefix: string): void;
    swagger(routes: IRoutes, prefix: string, swaggerDefault: any): {};
};
