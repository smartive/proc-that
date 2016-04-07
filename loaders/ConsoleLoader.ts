import {ILoad} from '../interfaces/ILoad';

export class ConsoleLoader implements ILoad {
    public write(object: any): Promise<void> {
        console.log(object);
        return Promise.resolve();
    }
}
