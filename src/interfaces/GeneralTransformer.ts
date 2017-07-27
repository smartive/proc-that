import { Observable } from 'rxjs';

/**
 * GeneralTransformer interface. Provides a "process(observable)" method that processes an observable.
 * Represents a stage in the ETL pipeline.
 * 
 * @export
 * @interface GeneralTransformer
 */
export interface GeneralTransformer {
    process(observable: Observable<any>, context?: any): Observable<any>;
}
