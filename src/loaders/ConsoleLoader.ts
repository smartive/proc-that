import {Loader} from '../interfaces/Loader';
import {Observable} from 'rxjs';

export class ConsoleLoader implements Loader {
    public write(object: any): Observable<any> {
        console.log(object);
        return Observable.of(object);
    }
}
