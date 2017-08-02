export declare class Config {
    private static singleton;
    port: number;
    outDir: string;
    extension: string;
    configDir: string;
    middlewareDir: string;
    routeDir: string;
    ormDir: string;
    useSequelize: boolean;
    datasource: any;
    private configKey;
    constructor(option?: {
        singleton: boolean;
    });
}
