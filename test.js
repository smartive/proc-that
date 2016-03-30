var package = require('./build');
var etl = new package.Etl();
var Observable = require('rxjs').Observable;
var e = new package.JsonExtractor('./.testdata/json-extractor.object.json');
var ea = new package.JsonExtractor('./.testdata/json-extractor.array.json');

var t = {
    process: function (o) {
        console.log('process', o);
        return Observable.of(o);
    }
};

etl
    .addExtractor(e)
    .addExtractor(ea)
    .addTransformer(t)
    .start()
    .subscribe(function (x) {
        console.log('next', x);
    }, function (err) {
        console.error(err);
    }, function () {
        console.log('completed');
    });