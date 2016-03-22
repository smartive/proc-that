import {Promise} from 'es6-promise';

export interface IExtract {
    read() : Promise<any>;
}