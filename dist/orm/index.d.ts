import { Config } from "../config";
export declare class Orm {
    private static singleton;
    sequelize: any;
    models: any;
    constructor(config: Config, option?: {
        singleton: boolean;
    });
}
