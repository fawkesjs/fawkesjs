import { IPreCtrl } from "../interfaces";
export interface IParseArg {
    arg: any;
    errs: Array<any>;
}
export declare class RestMiddleware {
    static processArgAsync(preCtrl: IPreCtrl): Promise<IPreCtrl>;
}
