export interface ITransform<T> {
    process(object : T) : T;
}