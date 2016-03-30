import { Observable } from 'rxjs';
export interface IExtract {
    read(): Observable<any>;
}
