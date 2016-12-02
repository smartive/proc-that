import {Observable} from 'rxjs';

export interface GeneralTransformer {

    process(observable: Observable<any>): Observable<any>;

}
