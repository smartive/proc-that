/**
 * Extractor interface. Only provides "read()" method that returns a promise with a resolved object.
 */
export interface IExtract {
    read() : Promise<any>;
}