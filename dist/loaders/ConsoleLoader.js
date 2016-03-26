"use strict";
var es6_promise_1 = require('es6-promise');
var ConsoleLoader = (function () {
    function ConsoleLoader() {
    }
    ConsoleLoader.prototype.write = function (object) {
        console.log(object);
        return es6_promise_1.Promise.resolve();
    };
    return ConsoleLoader;
}());
exports.ConsoleLoader = ConsoleLoader;
//# sourceMappingURL=ConsoleLoader.js.map