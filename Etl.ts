import {IExtract} from './interfaces/IExtract';
import {ITransform} from './interfaces/ITransform';
import {ILoad} from './interfaces/ILoad';

export class Etl {
    private _extracts:IExtract[] = [];
    private _transforms:ITransform[] = [];
    private _loads:ILoad[] = [];
}