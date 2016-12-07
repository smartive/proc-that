import { MatchMergeTransformer } from './transformers/MatchMergeTransformer';
import chai = require('chai');
import asPromised = require('chai-as-promised');
import sinon = require('sinon');
import sinonChai = require('sinon-chai');
import {Etl, EtlState} from './Etl';
import {Extractor} from './interfaces/Extractor';
import {JsonExtractor} from './extractors/JsonExtractor';
import {Loader} from './interfaces/Loader';
import {Observable} from 'rxjs';

let should = chai.should();
chai.use(asPromised);
chai.use(sinonChai);

describe('Etl', () => {

    let etl: Etl;
    let extractor: Extractor = new JsonExtractor('./.testdata/json-extractor.object.json');
    let arrayExtractor: Extractor = new JsonExtractor('./.testdata/json-extractor.array.json');
    let matchMergeExtractor: Extractor = new JsonExtractor('./.testdata/match-merge.json');
    let loader: Loader;
    let stub: any;

    beforeEach(() => {
        etl = new Etl();
        loader = {
            write: o => Observable.of(o)
        };

        stub = sinon.stub(loader, 'write', o => Observable.of(o));
    });

    it('should initialize with correct default params', () => {
        etl.state.should.equal(EtlState.Stopped);
        etl.extractors.should.be.an('Array').with.is.empty;
        etl.transformers.should.be.an('Array').with.is.empty;
        etl.loaders.should.be.an('Array').with.is.empty;
    });

    it('should reset correctly', () => {
        etl.addExtractor({
            read: function() {
                return null;
            }
        });

        etl.extractors.should.not.be.empty;
        etl.reset();
        etl.extractors.should.be.empty;
    });

    it('should process simple object', done => {
        etl
            .addExtractor(extractor)
            .addLoader(loader)
            .start()
            .subscribe(null, null, () => {
                loader.write.should.be.calledOnce;
                loader.write.should.be.calledWithExactly({ foo: 'bar', hello: 'world' });
                done();
            });
    });

    it('should process simple array', done => {
        etl
            .addExtractor(arrayExtractor)
            .addLoader(loader)
            .start()
            .subscribe(null, null, () => {
                loader.write.should.be.calledThrice;
                let spy: any = loader.write;
                spy.firstCall.should.be.calledWith({ objId: 1, name: 'foobar' });
                spy.secondCall.should.be.calledWith({ objId: 2, name: 'hello world' });
                spy.thirdCall.should.be.calledWith({ objId: 3, name: 'third test' });
                done();
            });
    });

    it('should call error on extractor error', done => {
        etl
            .addExtractor({
                read: () => Observable.throw(new Error('test'))
            })
            .addLoader(loader)
            .start()
            .subscribe(null, () => {
                done();
            }, () => {
                done(new Error('did not throw'));
            });
    });

    it('should call error on loader error', done => {
        etl
            .addExtractor(extractor)
            .addLoader({
                write: o => Observable.throw(new Error('test'))
            })
            .start()
            .subscribe(null, () => {
                done();
            }, () => {
                done(new Error('did not throw'));
            });
    });

    it('should call error on transformer error', done => {
        etl
            .addExtractor(extractor)
            .addLoader(loader)
            .addTransformer({
                process: o => Observable.throw(new Error('test'))
            })
            .start()
            .subscribe(null, () => {
                done();
            }, () => {
                done(new Error('did not throw'));
            });
    });

    it('should process simple object with transformer', done => {
        let spy = sinon.spy();
        etl
            .addExtractor(extractor)
            .addLoader(loader)
            .addTransformer({
                process: o => Observable.of(o)
            })
            .start()
            .subscribe(spy, () => {
                done(new Error('did throw'));
            }, () => {
                spy.should.be.calledOnce;
                done();
            });
    });

    it('should process simple array with transformer (flat)', done => {
        let spy = sinon.spy();
        etl
            .addExtractor(arrayExtractor)
            .addLoader(loader)
            .addTransformer({
                process: o => Observable.from([o, o])
            })
            .start()
            .subscribe(spy, () => {
                done(new Error('did throw'));
            }, () => {
                spy.should.have.callCount(6);
                done();
            });
    });

    it('should process a general transformer', done => {
        let spy = sinon.spy();
        etl
            .addExtractor(arrayExtractor)
            .addLoader(loader)
            .addGeneralTransformer({
                process: o => o.reduce((x, y) => x + y.objId, 0)
            })
            .start()
            .subscribe(spy, () => {
                done(new Error('did throw'));
            }, () => {
                spy.should.be.calledOnce;
                spy.should.be.calledWith(6);
                done();
            });
    });

    it('should process a match-merge transformer', done => {
        let spy = sinon.spy();

        class TestMatchTransformer extends MatchMergeTransformer {
            match(o1, o2) {
                return o1.location === o2.location;
            }

            merge(o1, o2) {
                return {
                    location: o1.location,
                    things: [...o1.things, ...o2.things]
                };
            }
        }

        etl
            .addExtractor(matchMergeExtractor)
            .addLoader(loader)
            .addGeneralTransformer(new TestMatchTransformer)
            .start()
            .subscribe(spy, () => {
                done(new Error('did throw'));
            }, () => {
                spy.should.be.calledTwice;
                spy.firstCall.should.be.calledWith({
                    location: "A",
                    things: ["a", "c"]
                });
                spy.secondCall.should.be.calledWith({
                    location: "B",
                    things: ["b", "d"]
                });
                done();
            });
    });


});
