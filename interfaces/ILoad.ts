/**
 * Loader interface. Provides ".write(obj)" method that returns a Promise when the write action is finished.
 */
export interface ILoad {
    write(object: any): Promise<void>;
}
