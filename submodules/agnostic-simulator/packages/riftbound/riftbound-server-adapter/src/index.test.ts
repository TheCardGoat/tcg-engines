import { describe, expect, it } from "vitest";
import type { RiftboundCatalog } from "@tcg/riftbound-types";
import { createRiftboundGameAdapter } from "./index";

const catalog = {
  schemaVersion: 1,
  game: "riftbound",
  provenance: {
    source: "riot-card-gallery",
    sourceUrl: "https://playriftbound.com/",
    locale: "en-us",
    fetchedAt: new Date(0).toISOString(),
    sha256: "0".repeat(64),
    productionEligible: false,
  },
  sets: [],
  cards: [],
} as RiftboundCatalog;

describe("createRiftboundGameAdapter", () => {
  it("builds stable owner maps without exposing server-engine methods", () => {
    const riftboundServerAdapter = createRiftboundGameAdapter(catalog);
    const maps = riftboundServerAdapter.buildCardInstances([
      { owner: "p1", deck: [{ cardId: "card-1", qty: 2 }] },
    ]);
    expect(maps.owners.p1).toHaveLength(2);
    expect(Object.values(maps.cardInstances)).toEqual(["card-1", "card-1"]);
    expect(riftboundServerAdapter.createServerEngine).toBeUndefined();
  });
});
