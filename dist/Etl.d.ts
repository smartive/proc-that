import {IExtract} from './interfaces/IExtract';
import {ITransform} from './interfaces/ITransform';
import {ILoad} from './interfaces/ILoad';
export declare enum EtlState {
    Running = 0,
    Stopped = 1,
    Error = 2,
}
export declare class Etl {
    private _extractors;
    private _transformers;
    private _loaders;
    private _state;
    private inputBuffer;
    private outputBuffer;
    private errorBuffer;
    extractors:IExtract[];
    transformers:ITransform[];
    loaders:ILoad[];
    state:EtlState;

    addExtractor(extract:IExtract):Etl;

    addTransformer(transformer:ITransform):Etl;

    addLoader(loader:ILoad):Etl;

    start():Promise<boolean>;

    reset():void;
}
