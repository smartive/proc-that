"use strict";
var ConsoleLoader = (function () {
    function ConsoleLoader() {
    }
    ConsoleLoader.prototype.write = function (object) {
        console.log(object);
        return Promise.resolve();
    };
    return ConsoleLoader;
}());
exports.ConsoleLoader = ConsoleLoader;
//# sourceMappingURL=ConsoleLoader.js.map