"use strict";
var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }

        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
var events_1 = require('events');
var es6_promise_1 = require('es6-promise');
var BufferSealedError = (function (_super) {
    __extends(BufferSealedError, _super);
    function BufferSealedError() {
        _super.call(this, 'Buffer is sealed.');
    }

    return BufferSealedError;
}(Error));
exports.BufferSealedError = BufferSealedError;
var Buffer = (function (_super) {
    __extends(Buffer, _super);
    function Buffer(initialSize) {
        if (initialSize === void 0) {
            initialSize = 10;
        }
        _super.call(this);
        this.content = [];
        this._sealed = false;
        this._size = initialSize;
    }

    Object.defineProperty(Buffer.prototype, "size", {
        get: function () {
            return this._size;
        },
        set: function (value) {
            this._size = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Buffer.prototype, "isFull", {
        get: function () {
            return this.content.length >= this._size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Buffer.prototype, "isEmpty", {
        get: function () {
            return this.content.length === 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Buffer.prototype, "sealed", {
        get: function () {
            return this._sealed;
        },
        enumerable: true,
        configurable: true
    });
    Buffer.prototype.seal = function () {
        this._sealed = true;
    };
    Buffer.prototype.read = function () {
        var _this = this;
        if (!this.isEmpty) {
            var content = this.content.shift();
            this.emit('release', content);
            if (this.isEmpty) {
                this.emit('empty');
                if (this.sealed)
                    this.emit('end');
            }
            return es6_promise_1.Promise.resolve(content);
        }
        return new es6_promise_1.Promise(function (resolve) {
            _this.once('write', function () {
                return resolve(_this.read());
            });
        });
    };
    Buffer.prototype.write = function (object) {
        var _this = this;
        if (this.sealed) {
            return es6_promise_1.Promise.reject(new BufferSealedError());
        }
        if (!this.isFull) {
            this.content.push(object);
            this.emit('write', object);
            return es6_promise_1.Promise.resolve(object);
        }
        return new es6_promise_1.Promise(function (resolve) {
            _this.once('release', function () {
                return resolve(_this.write(object));
            });
        });
    };
    return Buffer;
}(events_1.EventEmitter));
exports.Buffer = Buffer;
//# sourceMappingURL=Buffer.js.map