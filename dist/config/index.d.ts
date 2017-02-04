export declare class Config {
    static port: number;
    static init: boolean;
    static outDir: string;
    static extension: string;
    static configDir: string;
    static middlewareDir: string;
    static routeDir: string;
    static ormDir: string;
    static globFiles(location: string): Array<string>;
    static useSequelize: boolean;
    static datasource: any;
}
