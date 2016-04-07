"use strict";
var rxjs_1 = require('rxjs');
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
        this._state = EtlState.Running;
        return rxjs_1.Observable.merge.apply(rxjs_1.Observable, this._extractors.map(function (extractor) { return extractor.read(); }))
            .flatMap(function (object) { return _this._transformers.reduce(function (observable, transformer) { return observable.flatMap(function (o) { return transformer.process(o); }); }, rxjs_1.Observable.of(object)); })
            .flatMap(function (object) { return rxjs_1.Observable.merge.apply(rxjs_1.Observable, _this._loaders.map(function (loader) { return rxjs_1.Observable.fromPromise(loader.write(object)); })); })
            .do(null, function (err) {
            _this._state = EtlState.Error;
            return rxjs_1.Observable.throw(err);
        }, function () {
            _this._state = EtlState.Stopped;
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