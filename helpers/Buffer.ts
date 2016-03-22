import {EventEmitter} from 'events';
import {Promise} from 'es6-promise';

export class Buffer<T> extends EventEmitter {
    private content:T[] = [];
    private _size:number;

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

    public read():Promise<T> {
        if (!this.isEmpty) {
            let content = this.content.shift();
            this.emit('release', content);
            return Promise.resolve(content);
        }
        return new Promise(resolve => {
            this.once('write', () => resolve(this.read()));
        });
    }

    public write(object:T):Promise<T> {
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