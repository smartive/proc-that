import {ILoad} from '../interfaces/ILoad';

let Promise = require('es6-promise').Promise;

export class ConsoleLoader implements ILoad {
    public write(object:any):Promise<void> {
        console.log(object);
        return Promise.resolve();
    }
}