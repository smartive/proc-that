import {ILoad} from '../interfaces/ILoad';
import {Observable} from 'rxjs';

export class ConsoleLoader implements ILoad {
    public write(object: any): Observable<any> {
        console.log(object);
        return Observable.of(object);
    }
}
