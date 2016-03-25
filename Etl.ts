import {IExtract} from './interfaces/IExtract';
import {ITransform} from './interfaces/ITransform';
import {ILoad} from './interfaces/ILoad';
import {Promise} from 'es6-promise';
import {Buffer} from './helpers/Buffer';

export enum EtlState {
    Running,
    Stopped,
    Error
}

export class Etl {
    private _extractors:IExtract[] = [];
    private _transformers:ITransform[] = [];
    private _loaders:ILoad[] = [];
    private _state:EtlState = EtlState.Stopped;
    private inputBuffer:Buffer<any> = new Buffer<any>();
    private outputBuffer:Buffer<any> = new Buffer<any>();
    private errorBuffer:Buffer<any> = new Buffer<any>();

    public get extractors():IExtract[] {
        return this._extractors;
    }

    public get transformers():ITransform[] {
        return this._transformers;
    }

    public get loaders():ILoad[] {
        return this._loaders;
    }

    public get state():EtlState {
        return this._state;
    }

    public addExtractor(extract:IExtract):Etl {
        this._extractors.push(extract);
        return this;
    }

    public addTransformer(transformer:ITransform):Etl {
        this._transformers.push(transformer);
        return this;
    }

    public addLoader(loader:ILoad):Etl {
        this._loaders.push(loader);
        return this;
    }

    public start():Promise<boolean> {
        // run all extractors, load in buffer (parallel)
        // from buffer into all transformers (keep order)
        // and then through all loaders (parallel)


        this.inputBuffer.on('write', () => {
            this.inputBuffer.read()
                .then(
                    object => this.transformers
                        .reduce((promise, transformer) => promise.then(result => transformer.process(result)), Promise.resolve(object))
                        .then(result => this.outputBuffer.write(result))
                );
        });

        this.inputBuffer.on('end', () => this.outputBuffer.seal());

        this.outputBuffer.on('write',
            () => this.outputBuffer.read().then(object => Promise.all(this.loaders.map(loader => loader.write(object))))
        );

        Promise.all(this.extractors.map(extractor => extractor.read().then(result => {
            if (result instanceof Array) {
                return Promise.all(result.map(object => this.inputBuffer.write(object)));
            }
            return this.inputBuffer.write(result);
        }))).then(() => this.inputBuffer.seal());

        return new Promise((resolve, reject) => {
            this.errorBuffer.once('error', err => {
                reject(err);
            });
            this.outputBuffer.once('end', () => resolve());
        });
    }

    public reset():void {
        this._extractors = [];
        this._transformers = [];
        this._loaders = [];
        this._state = EtlState.Stopped;
    }
}