import chai = require('chai');
import asPromised = require('chai-as-promised');
import {JsonExtractor} from './JsonExtractor';

let should = chai.should();
chai.use(asPromised);

describe('JsonExtractor', () => {

    it('should get correct path', () => {
        let ext = new JsonExtractor('hello');
        let anyExt:any = ext;
        let result = process.cwd() + '/hello';
        anyExt.filePath.should.equal(result);
    });

    it('should receive a json object', () => {
        let ext = new JsonExtractor('./.testdata/json-extractor.object.json');
        return ext.read().should.eventually.deep.equal({
            "foo": "bar",
            "hello": "world"
        });
    });

    it('should throw on not found file', () => {
        let ext = new JsonExtractor('404.json');
        return ext.read().should.be.rejected;
    });

});