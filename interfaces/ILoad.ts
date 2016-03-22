import {Promise} from 'es6-promise';

export interface ILoad{
    write(object : any) : Promise<boolean>;
}