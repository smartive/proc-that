import {GeneralTransformer} from '../interfaces/GeneralTransformer';
import {Transformer} from '../interfaces/Transformer';
import {Observable} from 'rxjs';

export class MapTransformer implements GeneralTransformer {
    constructor(private transformer: Transformer) {}

    process(observable: Observable<any>): Observable<any> {
        return observable.flatMap(o => this.transformer.process(o));
    }
}
