"use strict";
var es6_promise_1 = require('es6-promise');
var path = require('path');
var JsonExtractor = (function () {
    function JsonExtractor(filePath) {
        this.filePath = path.resolve(process.cwd(), filePath);
    }

    JsonExtractor.prototype.read = function () {
        try {
            var file = require(this.filePath);
            return es6_promise_1.Promise.resolve(file);
        }
        catch (e) {
            return es6_promise_1.Promise.reject(e);
        }
    };
    return JsonExtractor;
}());
exports.JsonExtractor = JsonExtractor;
//# sourceMappingURL=JsonExtractor.js.map