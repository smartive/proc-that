import chai = require('chai');
import asPromised = require('chai-as-promised');
import sinon = require('sinon');
import sinonChai = require('sinon-chai');
import {JsonExtractor} from './JsonExtractor';

chai.use(asPromised);
chai.use(sinonChai);

describe('JsonExtractor', () => {

    it('should return an observable', () => {
        let ext = new JsonExtractor('./.testdata/json-extractor.object.json');
        ext.read().should.be.an('object');
    });

    it('should get correct path', () => {
        let ext = new JsonExtractor('hello');
        let anyExt: any = ext;
        let result = process.cwd() + '/hello';
        anyExt.filePath.should.equal(result);
    });

    it('should receive a json object', done => {
        let ext = new JsonExtractor('./.testdata/json-extractor.object.json');
        ext.read().subscribe(obj => {
            obj.should.deep.equal({
                "foo": "bar",
                "hello": "world"
            });
            done();
        });
    });

    it('should receive a json array', done => {
        let ext = new JsonExtractor('./.testdata/json-extractor.array.json');
        let spy = sinon.spy();
        ext.read().subscribe(spy, null, () => {
            spy.should.be.calledThrice;
            done();
        });
    });

    it('should throw on not found file', done => {
        let ext = new JsonExtractor('404.json');
        ext.read().subscribe(() => {
            done(new Error('did not throw'));
        }, () => {
            done();
        });
    });

});