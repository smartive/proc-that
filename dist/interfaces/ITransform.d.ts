import { Observable } from 'rxjs';
export interface ITransform {
    process(object: any): Observable<any>;
}
