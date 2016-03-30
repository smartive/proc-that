import chai = require('chai');
import asPromised = require('chai-as-promised');
import sinon = require('sinon');
import sinonChai = require('sinon-chai');
import {Buffer} from './Buffer';

let Promise = require('es6-promise').Promise;

let should = chai.should();
chai.use(asPromised);
chai.use(sinonChai);

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

        it('should return a Promise', () => {
            buf.write('');
            buf.read().should.be.a('Promise');
        });

        it('should not resolve without write while empty', done => {
            buf.read().then(obj => {
                done(new Error('promise returned'));
            });

            setTimeout(() => {
                done();
            }, 500);
        });

        it('should resolve on write', () => {
            return Promise.all([
                buf.read().should.eventually.equal('hello'),
                buf.write('hello').should.be.fulfilled
            ]);
        });

        it('should emit release event', () => {
            let spy = sinon.spy();
            buf.on('release', spy);
            buf.read();
            buf.write('');
            spy.should.have.callCount(1);
        });

    });

    describe('write()', () => {

        beforeEach(done => {
            buf.size = 1;
            buf.write('hello').then(() => done());
        });

        it('should return a Promise', () => {
            buf.read();
            buf.write('').should.be.a('Promise');
        });

        it('should not resolve without read while full', done => {
            buf.write('world').then(obj => {
                done(new Error('promise returned'));
            });

            setTimeout(() => {
                done();
            }, 500);
        });

        it('should resolve on read', () => {
            return Promise.all([
                buf.write('world').should.be.fulfilled,
                buf.read().should.eventually.equal('hello'),
                buf.read().should.eventually.equal('world')
            ]);
        });

        it('should emit write event', () => {
            let spy = sinon.spy();
            buf.on('write', spy);
            buf.read();
            buf.write('');
            spy.should.have.callCount(1);
        });

    });

});