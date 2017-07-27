import { Observable } from 'rxjs';

import { Loader } from '../interfaces/Loader';

export class ConsoleLoader implements Loader {
    public write(object: any): Observable<any> {
        console.log(object);
        return Observable.of(object);
    }
}
