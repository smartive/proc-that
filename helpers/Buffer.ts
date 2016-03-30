import {EventEmitter} from 'events';

let Promise = require('es6-promise').Promise;

export class BufferSealedError extends Error {
    constructor() {
        super('Buffer is sealed.');
    }
}

export class Buffer<T> extends EventEmitter {
    private content:T[] = [];
    private _size:number;
    private _sealed:boolean = false;

    constructor(initialSize:number = 10) {
        super();
        this._size = initialSize;
    }

    public get size():number {
        return this._size;
    }

    public set size(value:number) {
        this._size = value;
    }

    public get isFull():boolean {
        return this.content.length >= this._size;
    }

    public get isEmpty():boolean {
        return this.content.length === 0;
    }

    public get sealed():boolean {
        return this._sealed;
    }

    public seal():void {
        this._sealed = true;
        if (this.isEmpty) {
            this.emit('end');
        }
    }

    public read():Promise<T> {
        if (!this.isEmpty) {
            let content = this.content.shift();
            this.emit('release', content);

            if (this.isEmpty) {
                this.emit('empty');
                if (this.sealed) this.emit('end');
            }

            return Promise.resolve(content);
        }

        return new Promise(resolve => {
            this.once('write', () => resolve(this.read()));
        });
    }

    public write(object:T):Promise<T> {
        if (this.sealed) {
            return Promise.reject(new BufferSealedError());
        }

        if (!this.isFull) {
            this.content.push(object);
            this.emit('write', object);
            return Promise.resolve(object);
        }

        return new Promise(resolve => {
            this.once('release', () => resolve(this.write(object)));
        });
    }
}