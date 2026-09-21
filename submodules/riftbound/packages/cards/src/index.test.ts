import { describe, expect, it } from "vitest";

import type { RiftboundCatalog } from "@tcg/riftbound-types";
import {
  assertProductionEligibleRiftboundCatalog,
  createRiftboundCatalogIndex,
  riftboundCatalog,
} from "./index.ts";

const catalog: RiftboundCatalog = {
  schemaVersion: 1,
  game: "riftbound",
  provenance: {
    source: "riot-card-gallery",
    sourceUrl: "https://playriftbound.com/en-us/card-gallery/",
    locale: "en-US",
    fetchedAt: "2026-07-20T12:00:00.000Z",
    sha256: "a".repeat(64),
    productionEligible: false,
  },
  sets: [{ id: "OGN", name: "Origins", collectorNumberMax: 298 }],
  cards: [
    {
      canonicalId: "ogn-001-298",
      slug: "ogn-001-298",
      name: "Test Unit",
      printings: [
        {
          id: "ogn-001-298",
          artId: "official-art",
          upstreamPrintingId: "ogn-001-298",
          setCode: "OGN",
          collectorNumber: "001",
          rarity: "common",
          imageUrl: "https://cmsassets.rgpub.io/card.png",
          artist: "Official Artist",
        },
      ],
      cardType: "unit",
      domains: ["order"],
      tags: ["Demacia"],
      keywords: ["Test Keyword"],
      flags: [],
      rulesTextPlain: "Printed reference text.",
      effectTextPlain: "When summoned, ward another allied unit.",
      flavorText: "Stalwart flavor prose.",
      orientation: "portrait",
    },
  ],
};

describe("Riftbound card catalog", () => {
  it("ships an explicit empty catalog until approved data is generated", () => {
    expect(riftboundCatalog.cards).toEqual([]);
    expect(riftboundCatalog.sets).toEqual([]);
    expect(riftboundCatalog.provenance).toBeNull();
    expect(() => assertProductionEligibleRiftboundCatalog()).toThrow(
      "authenticated Riot API provenance",
    );
  });

  it("indexes canonical, printing, set, collector, and search metadata", () => {
    const index = createRiftboundCatalogIndex(catalog);
    expect(index.getCard("ogn-001-298")?.name).toBe("Test Unit");
    expect(index.getSet("OGN")?.name).toBe("Origins");
    expect(index.cardsBySetCollectorNumber.get("OGN:001")?.name).toBe("Test Unit");
    for (const query of [
      "test unit",
      "unit",
      "order",
      "demacia",
      "keyword",
      "ogn",
      "001",
      "ward another allied",
      "stalwart flavor",
    ]) {
      expect(index.search(query), query).toHaveLength(1);
    }
  });

  it("rejects local gallery data at the production boundary", () => {
    expect(() => assertProductionEligibleRiftboundCatalog(catalog)).toThrow(
      "authenticated Riot API provenance",
    );
  });
});
