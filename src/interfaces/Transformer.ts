import { Observable } from 'rxjs';

/**
 * Transformer interface. Only provides ".process(obj)" that returns an Observable with
 * the new result (array will be flattend).
 */
export interface Transformer {
  process(object: any, context?: any): Observable<any>;
}
