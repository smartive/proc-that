"use strict";
var es6_promise_1 = require('es6-promise');
var Buffer_1 = require('./helpers/Buffer');
(function (EtlState) {
    EtlState[EtlState["Running"] = 0] = "Running";
    EtlState[EtlState["Stopped"] = 1] = "Stopped";
    EtlState[EtlState["Error"] = 2] = "Error";
})(exports.EtlState || (exports.EtlState = {}));
var EtlState = exports.EtlState;
var Etl = (function () {
    function Etl() {
        this._extractors = [];
        this._transformers = [];
        this._loaders = [];
        this._state = EtlState.Stopped;
        this.inputBuffer = new Buffer_1.Buffer();
        this.outputBuffer = new Buffer_1.Buffer();
        this.errorBuffer = new Buffer_1.Buffer();
    }

    Object.defineProperty(Etl.prototype, "extractors", {
        get: function () {
            return this._extractors;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Etl.prototype, "transformers", {
        get: function () {
            return this._transformers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Etl.prototype, "loaders", {
        get: function () {
            return this._loaders;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Etl.prototype, "state", {
        get: function () {
            return this._state;
        },
        enumerable: true,
        configurable: true
    });
    Etl.prototype.addExtractor = function (extract) {
        this._extractors.push(extract);
        return this;
    };
    Etl.prototype.addTransformer = function (transformer) {
        this._transformers.push(transformer);
        return this;
    };
    Etl.prototype.addLoader = function (loader) {
        this._loaders.push(loader);
        return this;
    };
    Etl.prototype.start = function () {
        var _this = this;
        this.inputBuffer.on('write', function () {
            _this.inputBuffer.read()
                .then(function (object) {
                    if (!_this.transformers.length) {
                        return _this.outputBuffer.write(object);
                    }
                    _this.transformers
                        .reduce(function (promise, transformer) {
                            return promise.then(function (result) {
                                return transformer.process(result);
                            });
                        }, es6_promise_1.Promise.resolve(object))
                        .then(function (result) {
                            return _this.outputBuffer.write(result);
                        });
                });
        });
        this.inputBuffer.on('end', function () {
            return _this.outputBuffer.seal();
        });
        this.outputBuffer.on('write', function () {
            return _this.outputBuffer.read().then(function (object) {
                return es6_promise_1.Promise.all(_this.loaders.map(function (loader) {
                    return loader.write(object);
                }));
            });
        });
        return es6_promise_1.Promise
            .all(this.extractors.map(function (extractor) {
                return extractor.read().then(function (result) {
                    if (result instanceof Array) {
                        return es6_promise_1.Promise.all(result.map(function (object) {
                            return _this.inputBuffer.write(object);
                        }));
                    }
                    return _this.inputBuffer.write(result);
                });
            }))
            .then(function () {
                return _this.inputBuffer.seal();
            })
            .then(function () {
                return new es6_promise_1.Promise(function (resolve, reject) {
                    _this.errorBuffer.once('error', function (err) {
                        reject(err);
                    });
                    _this.outputBuffer.once('end', function () {
                        return resolve();
                    });
                });
            });
    };
    Etl.prototype.reset = function () {
        this._extractors = [];
        this._transformers = [];
        this._loaders = [];
        this._state = EtlState.Stopped;
    };
    return Etl;
}());
exports.Etl = Etl;
//# sourceMappingURL=Etl.js.map