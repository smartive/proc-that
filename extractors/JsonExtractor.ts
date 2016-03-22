import {IExtract} from '../interfaces/IExtract';
import {Promise} from 'es6-promise';

export class JsonExtractor implements IExtract {
    constructor(private path:string) {
    }

    public read():Promise<any> {
        try {
            let file = require(this.path);
            return Promise.resolve(file);
        } catch (e) {
            return Promise.reject(e);
        }
    }
}