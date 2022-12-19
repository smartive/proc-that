import { join } from "path";

import { JsonExtractor } from "../src";

describe("JsonExtractor", () => {
  it("should return an observable", () => {
    const ext = new JsonExtractor(
      "./test/.testdata/json-extractor.object.json"
    );
    expect(ext.read()).toBeInstanceOf(Object);
  });

  it("should get correct path", () => {
    const ext = new JsonExtractor("hello");
    const anyExt: any = ext;
    const result = join(process.cwd(), "hello");
    expect(anyExt.filePath).toBe(result);
  });

  it("should receive a json object", (done) => {
    const ext = new JsonExtractor(
      "./test/.testdata/json-extractor.object.json"
    );
    ext.read().subscribe({
      next: (obj) => {
        expect(obj).toMatchObject({
          foo: "bar",
          hello: "world",
        });
        done();
      },
    });
  });

  it("should receive a json array", (done) => {
    const ext = new JsonExtractor("./test/.testdata/json-extractor.array.json");
    const spy = jest.fn();
    ext.read().subscribe({
      next: spy,
      complete: () => {
        expect(spy.mock.calls.length).toBe(3);
        done();
      },
    });
  });

  it("should throw on not found file", (done) => {
    const ext = new JsonExtractor("404.json");
    ext.read().subscribe({
      next: () => {
        done(new Error("did not throw"));
      },
      error: () => {
        done();
      },
    });
  });
});
