import { IPreCtrl } from "../interfaces";
export interface IParseArg {
    arg: any;
    errs: any[];
}
export declare class RestMiddleware {
    static processArgAsync(preCtrl: IPreCtrl): Promise<IPreCtrl>;
}
