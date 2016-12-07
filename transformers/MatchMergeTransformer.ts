import { GeneralTransformer } from '../interfaces/GeneralTransformer';
import {Observable} from 'rxjs';

export class MatchMergeTransformer implements GeneralTransformer {

    constructor(
        private match: (o1: any, o2: any) => boolean,
        private merge: (o1: any, o2: any) => any
    ) { }

    matchMerge(merged: any[], o2: any): any[] {
        for (let i = 0; i < merged.length; i++) {
            if (this.match(merged[i], o2)) {
                const o1 = merged.splice(i, 1)[0];
                o2 = this.merge(o1, o2);
                // Try to merge the merged element with the remaining elements,
                // starting from the current position
                i--;
            }
        }
        merged.push(o2);
        return merged;
    }

    process(observable: Observable<any>): Observable<any> {
        return observable.reduce(this.matchMerge.bind(this), []).flatMap((merged) => {
            return Observable.from(merged);
        });
    }

}
