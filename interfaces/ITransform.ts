export interface ITransform {
    process(object:any):Promise<any>;
}