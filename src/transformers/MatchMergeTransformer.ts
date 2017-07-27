import { Observable } from 'rxjs';

import { GeneralTransformer } from '../interfaces/GeneralTransformer';

export abstract class MatchMergeTransformer implements GeneralTransformer {

    public process(observable: Observable<any>, context?: any): Observable<any> {
        const matchMerge = (merged: any[], o2: any) => {
            return this.matchMerge(merged, o2, context);
        };
        return observable.reduce(matchMerge, []).flatMap((merged) => {
            return Observable.from(merged);
        });
    }

    protected abstract match(o1: any, o2: any, context?: any): boolean;

    protected abstract merge(o1: any, o2: any, context?: any): any;

    private matchMerge(merged: any[], o2: any, context?: any): any[] {
        for (let i = 0; i < merged.length; i++) {
            if (this.match(merged[i], o2, context)) {
                const o1 = merged.splice(i, 1)[0];
                // tslint:disable-next-line
                o2 = this.merge(o1, o2, context);
                // Try to merge the merged element with the remaining elements,
                // starting from the current position
                i--;
            }
        }
        merged.push(o2);
        return merged;
    }

}
