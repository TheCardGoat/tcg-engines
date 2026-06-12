import { describe, expect, test } from "vite-plus/test";
import { RecordCardCatalog } from "../src/index.ts";

describe("@tcg/op-types", () => {
  test("RecordCardCatalog stores and retrieves items", () => {
    const catalog = new RecordCardCatalog("sample", {
      A: { id: "A", value: 1 },
      B: { id: "B", value: 2 },
    });

    expect(catalog.ref).toBe("sample");
    expect(catalog.has("A")).toBe(true);
    expect(catalog.has("Z")).toBe(false);
    expect(catalog.get("B")).toEqual({ id: "B", value: 2 });
    expect(catalog.all()).toEqual([
      { id: "A", value: 1 },
      { id: "B", value: 2 },
    ]);
  });
});
