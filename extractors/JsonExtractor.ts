import {Extractor} from '../interfaces/Extractor';
import {Observable} from 'rxjs';
import path = require('path');

/**
 * Extractor that reads a JSON file at a given filepath. The path is resolved relatively to the running tasks root dir.
 */
export class JsonExtractor implements Extractor {
    private filePath: string;

    constructor(filePath: string) {
        this.filePath = path.resolve(process.cwd(), filePath);
    }

    public read(): Observable<any> {
        try {
            let content = require(this.filePath);
            if (!(content instanceof Array) && content.constructor !== Array) {
                return Observable.from([content]);
            }
            return Observable.from(content);
        } catch (e) {
            return Observable.throw(e);
        }
    }
}
