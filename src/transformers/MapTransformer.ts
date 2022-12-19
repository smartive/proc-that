import { mergeMap, Observable } from "rxjs";

import { GeneralTransformer } from "../interfaces/GeneralTransformer";
import { Transformer } from "../interfaces/Transformer";

export class MapTransformer implements GeneralTransformer {
  constructor(private transformer: Transformer) {}

  public process(observable: Observable<any>, context?: any): Observable<any> {
    return observable.pipe(
      mergeMap((o) => this.transformer.process(o, context))
    );
  }
}
