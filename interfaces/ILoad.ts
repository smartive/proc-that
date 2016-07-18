import {Observable} from 'rxjs';

/**
 * Loader interface. Provides ".write(obj)" method that returns an observable with the loaded value.
 */
export interface ILoad {
    write(object: any): Observable<any>;
}
