import {IExtract} from '../interfaces/IExtract';
import {Promise} from 'es6-promise';
import path = require('path');

export class JsonExtractor implements IExtract {
    private filePath:string;

    constructor(filePath:string) {
        this.filePath = path.resolve(process.cwd(), filePath);
    }

    public read():Promise<any> {
        try {
            let file = require(this.filePath);
            return Promise.resolve(file);
        } catch (e) {
            return Promise.reject(e);
        }
    }
}