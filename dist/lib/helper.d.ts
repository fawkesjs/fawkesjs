export declare class Helper {
    static globFiles(location: string): Array<string>;
    static transactionCommitAsync(t: any, data: any): Promise<any>;
    static transactionRollbackAsync(t: any, err: any): Promise<never>;
    static errCb(err: any, res: any): void;
}
