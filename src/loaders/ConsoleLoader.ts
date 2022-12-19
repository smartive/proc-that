import { Observable, of } from "rxjs";

import { Loader } from "../interfaces/Loader";

/**
 * Loader that outputs everything to the console.
 *
 * @export
 * @class ConsoleLoader
 * @implements {Loader}
 */
export class ConsoleLoader implements Loader {
  public write(object: any): Observable<any> {
    console.log(object);
    return of(object);
  }
}
