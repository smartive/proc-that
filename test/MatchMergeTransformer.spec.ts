import { from } from "rxjs";

import { MatchMergeTransformer } from "../src/transformers/MatchMergeTransformer";

describe("MatchMergeTransformer", () => {
  it("should return an observable", () => {
    const spy = jest.fn();

    class TestMatchMergeTransformer extends MatchMergeTransformer {
      match(o1, o2) {
        return o1 === o2;
      }

      merge(o1) {
        return o1;
      }
    }

    const t = new TestMatchMergeTransformer();

    t.process(from([1, 2, 3, 2, 3])).subscribe({
      next: spy,
      complete: () => {
        expect(spy.mock.calls.length).toBe(3);
      },
    });
  });
});
