import {ConsoleLoader} from './loaders/ConsoleLoader';
import {Etl} from './Etl';
import {JsonExtractor} from './extractors/JsonExtractor';
import {ITransform} from './interfaces/ITransform';

let etl = new Etl();
let ext = new JsonExtractor('../node-ts-etl-test/test.json');
let loader = new ConsoleLoader();

class Test implements ITransform {

    public process(object:any):Promise<any> {
        if (object.lastname === 'General') {
            object.foo = 'bar';
        }
        return Promise.resolve(object);
    }
}


etl
    .addExtractor(ext)
    .addLoader(loader)
    .addTransformer(new Test())
    .start()
    .then(() => console.log('done'), err => console.error(err));