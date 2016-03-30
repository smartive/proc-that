import {Observable} from 'rxjs';

/**
 * Extractor interface. Only provides "read()" method that returns a promise with a resolved object.
 */
export interface IExtract {
    read():Observable<any>;
}