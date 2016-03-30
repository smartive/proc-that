import {ILoad} from '../interfaces/ILoad';
import {Promise} from 'es6-promise';

export class ConsoleLoader implements ILoad {
    public write(object:any):Promise<void> {
        console.log(object);
        return Promise.resolve();
    }
}