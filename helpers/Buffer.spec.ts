import chai = require('chai');
import asPromised = require('chai-as-promised');
import {Buffer} from './Buffer';

chai.use(asPromised);
let should = chai.should();

describe('Buffer<any>', () => {

    let buf:Buffer<any>;

    beforeEach(() => {
        buf = new Buffer<any>();
    });

    it('should set size to default 10', () => {
        buf.size.should.equal(10);
    });

    it('should extend EventEmitter', () => {
        should.exist(buf.addListener);
    });

    it('should be empty on init', () => {
        buf.isEmpty.should.be.true;
    });

    it('should not be full on init', () => {
        buf.isFull.should.be.false;
    });

    it('should change size with property', () => {
        buf.size.should.equal(10);
        buf.size = 20;
        buf.size.should.equal(20);
    });

    describe('read()', () => {

        it('should return a Promise');

        it('should not resolve without write while empty');

        it('should not throw an error on empty read');

        it('should resolve on write');

        it('should emit release event');

    });

    describe('write()', () => {

        it('should return a Promise');

        it('should not resolve without read while full');

        it('should not throw an error on full write');

        it('should resolve on read');

        it('should emit write event');

    });

});