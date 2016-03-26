import {EventEmitter} from 'events';
export declare class BufferSealedError extends Error {
    constructor();
}
export declare class Buffer<T> extends EventEmitter {
    private content;
    private _size;
    private _sealed;

    constructor(initialSize?:number);

    size:number;
    isFull:boolean;
    isEmpty:boolean;
    sealed:boolean;

    seal():void;

    read():Promise<T>;

    write(object:T):Promise<T>;
}
