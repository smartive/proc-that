import { from, of } from "rxjs";

import { MapTransformer } from "../src";

describe("MapTransformer", () => {
  it("should return an observable", () => {
    const spy = jest.fn();

    const subt = {
      process(o) {
        return of(o);
      },
    };

    subt.process = jest.fn(subt.process);

    const t = new MapTransformer(subt);

    t.process(from([1]), 2).subscribe(spy, null, () => {
      expect(spy.mock.calls.length).toBe(1);
      expect((subt.process as any).mock.calls.length).toBe(1);
    });
  });
});
