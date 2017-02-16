import {Observable} from 'rxjs';

/**
 * Loader interface. Provides ".write(obj)" method that returns an observable with the loaded value.
 */
export interface Loader {
    write(object: any, context?: any): Observable<any>;
}
