export declare class Helper {
    static globFiles(location: string): string[];
    static transactionCommitAsync(t: any, data: any): Promise<any>;
    static transactionRollbackAsync(t: any, err: any): Promise<never>;
    static errCb(err: any, res: any, req: any, di: any): void;
    static objGet(obj: any, fmt: string, o: any): any;
}
