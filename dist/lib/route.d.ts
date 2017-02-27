import { IRoutes, IRoutesConfig } from "../interfaces";
export declare let Route: {
    activate(app: any, routes: IRoutes, prefix: string, routesConfig: IRoutesConfig): void;
    swagger(routes: IRoutes, prefix: string): {};
};
