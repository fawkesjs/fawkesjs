/**
 * This is the main class to do config initiation.
 */
export declare class Fawkes {
    /**
     * express routing base on our route folder
     */
    static activateRoute(app: any, di: any): void;
    /**
     * for generating swagger document, which is triggered when we call fawkesjs -s ./swagger/swagger.json
     */
    static generateSwaggerAsync(location: any): Promise<{}>;
}
