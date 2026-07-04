import { describe, expect, it } from "bun:test";

import { createRecordCardCatalog } from "./catalog.js";

describe("createRecordCardCatalog", () => {
  it("returns cards by id", () => {
    const catalog = createRecordCardCatalog("lorcana:test", {
      alpha: {
        canonicalId: "ci_alpha",
        slug: "lorcana-ci_alpha",
        name: "Alpha",
        printings: [
          {
            id: "alpha-001",
            artId: "alpha-001",
            setCode: "test",
            collectorNumber: "001",
            rarity: "common",
            imageUrl: "https://example.com/alpha.png",
          },
        ],
      },
    });

    expect(catalog.ref).toBe("lorcana:test");
    expect(catalog.has("alpha")).toBe(true);
    expect(catalog.get("alpha")?.canonicalId).toBe("ci_alpha");
    expect(catalog.get("beta")).toBeUndefined();
  });
});
