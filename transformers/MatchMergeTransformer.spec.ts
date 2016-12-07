import { Observable } from 'rxjs/Rx';
import chai = require('chai');
import asPromised = require('chai-as-promised');
import sinon = require('sinon');
import sinonChai = require('sinon-chai');
import {MatchMergeTransformer} from './MatchMergeTransformer';

chai.use(asPromised);
chai.use(sinonChai);

describe('MatchMergeTransformer', () => {

    it('should return an observable', () => {
        let spy = sinon.spy();

        class TestMatchMergeTransformer extends MatchMergeTransformer {
            match(o1, o2) {
                return o1 === o2;
            }

            merge(o1, o2) {
                return o1;
            }
        }

        let t = new TestMatchMergeTransformer();
        t.process(Observable.from([1, 2, 3, 2, 3]))
            .subscribe(spy, null, () => {
                spy.should.be.calledThrice;
                spy.firstCall.should.be.calledWith(1);
                spy.secondCall.should.be.calledWith(2);
                spy.thirdCall.should.be.calledWith(3);
            });
    });

});
