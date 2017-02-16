import { Observable } from 'rxjs/Rx';
import chai = require('chai');
import asPromised = require('chai-as-promised');
import sinon = require('sinon');
import sinonChai = require('sinon-chai');
import {MapTransformer} from './MapTransformer';

chai.use(asPromised);
chai.use(sinonChai);

describe('MapTransformer', () => {

    it('should return an observable', () => {
        let spy = sinon.spy();

        let subt = {
            process(o) {
                return Observable.of(o);
            }
        }
        let t = new MapTransformer(subt);
        sinon.spy(subt, 'process');

        t.process(Observable.from([1]), 2)
            .subscribe(spy, null, () => {
                spy.should.be.calledOnce;
                subt.process.should.be.calledOnce;
                subt.process.should.be.calledWith(1, 2);
            });
    });

});
