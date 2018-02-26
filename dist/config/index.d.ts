/**
 * const config = new Config() // this create a new instance of config
 * const config2 = new Config({singleton: true}); // this create/return a singleton
 */
export declare class Config {
    private static singleton;
    port: number;
    outDir: string;
    extension: string;
    configDir: string;
    middlewareDir: string;
    routeDir: string;
    useSequelize: boolean;
    datasource: any;
    private configKey;
    constructor(option?: {
        singleton: boolean;
    });
}
