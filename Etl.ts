import {Extractor} from './interfaces/Extractor';
import {ITransform} from './interfaces/ITransform';
import {Loader} from './interfaces/Loader';
import {Observable} from 'rxjs';

export enum EtlState {
    Running,
    Stopped,
    Error
}

/**
 * ETL Class. Instantiate one and add as many extractors, transformers and loaders as you want.
 * Then start the whole process with ".start()".
 *
 * This processor is modular, you can find other implemented loaders and extractors in the README
 */
export class Etl {
    private _extractors: Extractor[] = [];
    private _transformers: ITransform[] = [];
    private _loaders: Loader[] = [];
    private _state: EtlState = EtlState.Stopped;

    public get extractors(): Extractor[] {
        return this._extractors;
    }

    public get transformers(): ITransform[] {
        return this._transformers;
    }

    public get loaders(): Loader[] {
        return this._loaders;
    }

    public get state(): EtlState {
        return this._state;
    }

    public addExtractor(extract: Extractor): Etl {
        this._extractors.push(extract);
        return this;
    }

    public addTransformer(transformer: ITransform): Etl {
        this._transformers.push(transformer);
        return this;
    }

    public addLoader(loader: Loader): Etl {
        this._loaders.push(loader);
        return this;
    }

    /**
     * Starts the etl process. First, all extractors are ran in parallel and deliver their results into an observable.
     * Once the buffer gets a result, it transfers all objects through the transformers (one by one).
     * After that, the transformed results are ran through all loaders in parallel.
     *
     * @returns {Observable<any>} Observable that completes when the process is finished,
     *                            during the "next" process step you get update on how many are processed yet.
     *                            Throws when any step produces an error.
     */
    public start(): Observable<any> {
        this._state = EtlState.Running;

        return Observable
            .merge(...this._extractors.map(extractor => extractor.read()))
            .flatMap(object => this._transformers.reduce((observable, transformer) => observable.flatMap(o => transformer.process(o)), Observable.of(object)))
            .flatMap(object => Observable.merge(...this._loaders.map(loader => loader.write(object))))
            .do(null, err => {
                this._state = EtlState.Error;
                return Observable.throw(err);
            }, () => {
                this._state = EtlState.Stopped;
            });
    }

    /**
     * Resets the whole Etl object. Deletes all modifiers and resets the state.
     */
    public reset(): void {
        this._extractors = [];
        this._transformers = [];
        this._loaders = [];
        this._state = EtlState.Stopped;
    }
}
