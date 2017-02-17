export declare class Helper {
    static globFiles(location: string): Array<string>;
    static transactionCommit(t: any, data: any): Promise<any[]>;
    static transactionRollback(t: any, err: any): any;
    static errCb(err: any, res: any): void;
}
