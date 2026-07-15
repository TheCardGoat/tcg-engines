import { describe, expect, it } from "bun:test";

import { createRecordCardCatalog } from "./catalog";

describe("createRecordCardCatalog", () => {
  it("returns cards by id", () => {
    const catalog = createRecordCardCatalog("lorcana:test", {
      alpha: { id: "alpha", name: "Alpha" },
    });

    expect(catalog.ref).toBe("lorcana:test");
    expect(catalog.has("alpha")).toBe(true);
    expect(catalog.get("alpha")).toEqual({ id: "alpha", name: "Alpha" });
    expect(catalog.get("beta")).toBeUndefined();
  });
});
