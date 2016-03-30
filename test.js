var package = require('./build');
var etl = new package.Etl();
var e = new package.JsonExtractor('./.testdata/json-extractor.object.json');
var ea = new package.JsonExtractor('./.testdata/json-extractor.array.json');

etl
    .addExtractor(e)
    .addExtractor(ea)
    .start()
    .subscribe(function (x) {
        console.log('next', x);
    }, function (err) {
        console.error(err);
    }, function () {
        console.log('completed');
    });