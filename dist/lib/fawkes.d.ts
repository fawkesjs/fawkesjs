/**
 * This is the main class to do config initiation.
 */
export declare class Fawkes {
    /**
     * express routing base on our route folder
     */
    static activateRoute(app: any): void;
    /**
     * initializing our config and orm and returning express app
     */
    static app(): any;
    /**
     * for generating swagger document, which is triggered when we call fawkesjs -s ./swagger/swagger.json
     */
    static generateSwaggerAsync(location: any): Promise<{}>;
}
