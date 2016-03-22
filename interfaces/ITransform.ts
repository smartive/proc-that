import {Promise} from 'es6-promise';

export interface ITransform {
    process<T, R>(object : T) : Promise<R>;
}