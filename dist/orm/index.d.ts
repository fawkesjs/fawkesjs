import { Config } from "../config";
/**
 * const orm = new Orm(new Config()) // this create a new instance of Orm
 * const orm2 = new Orm(new Config(), {singleton: true}) // this create/return a singleton
 */
export declare class Orm {
    private static singleton;
    sequelize: any;
    models: any;
    constructor(config: Config, option?: {
        singleton: boolean;
    });
}
