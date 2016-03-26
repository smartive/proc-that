import {IExtract} from '../interfaces/IExtract';
export declare class JsonExtractor implements IExtract {
    private filePath;

    constructor(filePath:string);

    read():Promise<any>;
}
