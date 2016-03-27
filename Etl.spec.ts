import chai = require('chai');
import asPromised = require('chai-as-promised');
import sinon = require('sinon');
import sinonChai = require('sinon-chai');
import {Etl, EtlState} from './Etl';
import {IExtract} from './interfaces/IExtract';
import {JsonExtractor} from './extractors/JsonExtractor';
import {ILoad} from './interfaces/ILoad';

let should = chai.should();
chai.use(asPromised);
chai.use(sinonChai);

describe('Etl', () => {

    let etl:Etl;
    let extractor:IExtract = new JsonExtractor('./.testdata/json-extractor.object.json');
    let arrayExtractor:IExtract = new JsonExtractor('./.testdata/json-extractor.array.json');
    let loader:ILoad;
    let stub:any;

    beforeEach(() => {
        etl = new Etl();
        loader = {
            write: o => Promise.resolve(o)
        };

        stub = sinon.stub(loader, 'write', o => Promise.resolve(o));
    });

    it('should initialize with correct default params', () => {
        etl.state.should.equal(EtlState.Stopped);
        etl.extractors.should.be.an('Array').with.is.empty;
        etl.transformers.should.be.an('Array').with.is.empty;
        etl.loaders.should.be.an('Array').with.is.empty;
    });

    it('should reset correctly', () => {
        etl.addExtractor({
            read: function () {
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
            .then(() => {
                try {
                    loader.write.should.be.calledOnce;
                    loader.write.should.be.calledWithExactly({foo: 'bar', hello: 'world'});
                    done();
                } catch (e) {
                    done(e);
                }
            }, err => {
                console.error(err);
                done();
            });
    });

    it('should process simple array', done => {
        etl
            .addExtractor(arrayExtractor)
            .addLoader(loader)
            .start()
            .then(() => {
                try {
                    loader.write.should.be.calledThrice;
                    let spy:any = loader.write;
                    spy.firstCall.should.be.calledWith({objId: 1, name: 'foobar'});
                    spy.secondCall.should.be.calledWith({objId: 2, name: 'hello world'});
                    spy.thirdCall.should.be.calledWith({objId: 3, name: 'third test'});
                    done();
                } catch (e) {
                    done(e);
                }
            }, err => {
                console.error(err);
                done();
            });
    });

    it('should reject on extractor error', () => {
        return etl
            .addExtractor({
                read: () => Promise.reject(new Error('test'))
            })
            .addLoader(loader)
            .start().should.be.rejected;
    });

    it('should reject on loader error', () => {
        return etl
            .addExtractor(extractor)
            .addLoader({
                write: o => Promise.reject(new Error('test'))
            })
            .start().should.be.rejected;
    });

    it('should reject on transformer error'/*, () => {
     return etl
     .addExtractor(extractor)
     .addLoader(loader)
     .addTransformer({
     process: o => Promise.reject(new Error('test'))
     })
     .start().should.be.rejected;
     }*/);

});