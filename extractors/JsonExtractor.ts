import {IExtract} from '../interfaces/IExtract';
import {Promise} from 'es6-promise';

export class JsonExtractor implements IExtract {

    constructor(private path) {
    }

    public read():Promise<any> {
        return null;
    }
}