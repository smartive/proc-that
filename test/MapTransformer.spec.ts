import { Observable } from 'rxjs/Rx';

import { MapTransformer } from '../src';

describe('MapTransformer', () => {

    it('should return an observable', () => {
        const spy = jest.fn();

        const subt = {
            process(o) {
                return Observable.of(o);
            }
        }

        subt.process = jest.fn(subt.process);

        const t = new MapTransformer(subt);

        t.process(Observable.from([1]), 2)
            .subscribe(spy, null, () => {
                expect(spy.mock.calls.length).toBe(1);
                expect((subt.process as any).mock.calls.length).toBe(1);
            });
    });

});
