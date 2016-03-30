"use strict";
var rxjs_1 = require('rxjs');
var path = require('path');
var JsonExtractor = (function () {
    function JsonExtractor(filePath) {
        this.filePath = path.resolve(process.cwd(), filePath);
    }
    JsonExtractor.prototype.read = function () {
        try {
            var content = require(this.filePath);
            if (!(content instanceof Array) && content.constructor !== Array) {
                return rxjs_1.Observable.from([content]);
            }
            return rxjs_1.Observable.from(content);
        }
        catch (e) {
            return rxjs_1.Observable.throw(e);
        }
    };
    return JsonExtractor;
}());
exports.JsonExtractor = JsonExtractor;
//# sourceMappingURL=JsonExtractor.js.map