/**
 * Transformer interface. Only provides ".process(obj)" that returns a Promise with the new result.
 */
export interface ITransform {
    process(object:any):Promise<any>;
}