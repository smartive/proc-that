import { IExtract } from '../interfaces/IExtract';
import { Observable } from 'rxjs';
export declare class JsonExtractor implements IExtract {
    private filePath;
    constructor(filePath: string);
    read(): Observable<any>;
}
