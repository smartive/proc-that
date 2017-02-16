import {Observable} from 'rxjs';

/**
 * Extractor interface. Only provides "read()" method that returns an observable with the result.
 */
export interface Extractor {
    read(context?: any): Observable<any>;
}
