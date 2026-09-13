import { describe, expect, it } from "vite-plus/test";
import type { Card } from "@tcg/gundam-types";
import * as cardExports from "./cards/index.ts";
import {
  GUNDAM_CATALOG_REGION,
  GUNDAM_EDITORIAL_GAME_SLUG,
  GUNDAM_EN_US_EDITORIAL_RELEASE_CYCLES,
  GUNDAM_EN_US_PRODUCT_RELEASES,
  getGundamPrintingRelease,
  getGundamSetRelease,
  isGundamCanonicalCardReleaseEligible,
} from "./catalog-release.ts";

function isCard(value: unknown): value is Card {
  return (
    typeof value === "object" &&
    value !== null &&
    "cardNumber" in value &&
    "canonicalId" in value &&
    "type" in value
  );
}

const exportedCards = Object.values(cardExports).filter(isCard);

const EXPLICITLY_UNRESOLVED_CARD_SET_CODES = [
  "EVX-01",
  "EXB",
  "EXBP",
  "EXR",
  "EXRP",
  "PB01",
  "PB02",
  "PC01A",
  "PC02A",
  "R",
  "RP",
] as const;

const EXPLICITLY_UNRESOLVED_PRINTING_SET_CODES = [
  "EVX-01",
  "EVX05",
  "EXB",
  "EXBP",
  "EXR",
  "EXRP",
  "PB01",
  "PB02",
  "PC01A",
  "PC02A",
  "R",
  "RP",
  "T",
] as const;

describe("Gundam EN-US catalog releases", () => {
  it("stores the audited official product schedule with region and source URL", () => {
    expect(
      Object.fromEntries(
        Object.entries(GUNDAM_EN_US_PRODUCT_RELEASES).map(([code, release]) => [
          code,
          release.releaseDate,
        ]),
      ),
    ).toEqual({
      BETA: "2024-12-07",
      ST01: "2025-07-11",
      ST02: "2025-07-11",
      ST03: "2025-07-11",
      ST04: "2025-07-11",
      GD01: "2025-07-25",
      ST05: "2025-09-26",
      GD02: "2025-10-24",
      ST06: "2025-10-24",
      ST07: "2026-01-16",
      ST08: "2026-01-16",
      GD03: "2026-01-30",
      ST09: "2026-03-27",
      GD04: "2026-04-24",
      EB01: "2026-06-26",
      ST10: "2026-06-26",
      GD05: "2026-07-24",
      SC01: "2026-07-24",
    });
    expect(
      Object.values(GUNDAM_EN_US_PRODUCT_RELEASES).every(
        (release) =>
          release.region === GUNDAM_CATALOG_REGION &&
          release.sourceUrl.startsWith("https://www.gundam-gcg.com/en/"),
      ),
    ).toBe(true);
    expect(GUNDAM_EN_US_PRODUCT_RELEASES.SC01).toMatchObject({
      title: "Deck Build Box Freedom Ascension",
      productType: "deck_build_box",
      region: "en-US",
      releaseDate: "2026-07-24",
      sourceUrl: "https://www.gundam-gcg.com/en/products/deck-build-box.html",
    });
  });

  it("keeps official product metadata complete and release identities unique", () => {
    const releases = Object.values(GUNDAM_EN_US_PRODUCT_RELEASES);

    expect(
      releases.every(
        (release) =>
          release.title.length > 0 &&
          release.productType.length > 0 &&
          release.setCode.length > 0 &&
          release.sourceUrl.startsWith("https://www.gundam-gcg.com/en/products/"),
      ),
    ).toBe(true);
    expect(new Set(releases.map((release) => release.setCode)).size).toBe(releases.length);
    expect(new Set(GUNDAM_EN_US_EDITORIAL_RELEASE_CYCLES.map((cycle) => cycle.cycleId)).size).toBe(
      GUNDAM_EN_US_EDITORIAL_RELEASE_CYCLES.length,
    );
  });

  it("exports one adapter record per eligible booster cycle", () => {
    expect(
      GUNDAM_EN_US_EDITORIAL_RELEASE_CYCLES.map((cycle) => ({
        cycleId: cycle.cycleId,
        gameSlug: cycle.gameSlug,
        anchorProductCode: cycle.anchorProductCode,
        productType: cycle.productType,
        editorialEligible: cycle.editorialEligible,
      })),
    ).toEqual([
      {
        cycleId: "gundam-en-us-gd01",
        gameSlug: GUNDAM_EDITORIAL_GAME_SLUG,
        anchorProductCode: "GD01",
        productType: "booster_pack",
        editorialEligible: true,
      },
      {
        cycleId: "gundam-en-us-gd02",
        gameSlug: GUNDAM_EDITORIAL_GAME_SLUG,
        anchorProductCode: "GD02",
        productType: "booster_pack",
        editorialEligible: true,
      },
      {
        cycleId: "gundam-en-us-gd03",
        gameSlug: GUNDAM_EDITORIAL_GAME_SLUG,
        anchorProductCode: "GD03",
        productType: "booster_pack",
        editorialEligible: true,
      },
      {
        cycleId: "gundam-en-us-gd04",
        gameSlug: GUNDAM_EDITORIAL_GAME_SLUG,
        anchorProductCode: "GD04",
        productType: "booster_pack",
        editorialEligible: true,
      },
      {
        cycleId: "gundam-en-us-eb01",
        gameSlug: GUNDAM_EDITORIAL_GAME_SLUG,
        anchorProductCode: "EB01",
        productType: "extra_booster",
        editorialEligible: true,
      },
      {
        cycleId: "gundam-en-us-gd05",
        gameSlug: GUNDAM_EDITORIAL_GAME_SLUG,
        anchorProductCode: "GD05",
        productType: "booster_pack",
        editorialEligible: true,
      },
    ]);
  });

  it("groups same-day companion products without creating duplicate cycles", () => {
    expect(
      GUNDAM_EN_US_EDITORIAL_RELEASE_CYCLES.map((cycle) => [
        cycle.anchorProductCode,
        cycle.productCodes,
      ]),
    ).toEqual([
      ["GD01", ["GD01"]],
      ["GD02", ["GD02", "ST06"]],
      ["GD03", ["GD03"]],
      ["GD04", ["GD04"]],
      ["EB01", ["EB01", "ST10"]],
      ["GD05", ["GD05", "SC01"]],
    ]);

    for (const cycle of GUNDAM_EN_US_EDITORIAL_RELEASE_CYCLES) {
      const products = cycle.productCodes.map(
        (setCode) =>
          GUNDAM_EN_US_PRODUCT_RELEASES[setCode as keyof typeof GUNDAM_EN_US_PRODUCT_RELEASES],
      );
      expect(products.filter((product) => product.editorialCycleRole === "anchor")).toHaveLength(1);
      expect(
        products.every(
          (product) =>
            product.editorialCycleId === cycle.cycleId &&
            product.releaseDate === cycle.releaseDate &&
            product.region === cycle.region,
        ),
      ).toBe(true);
    }
  });

  it("makes GD05 the Freedom Ascension anchor and SC01 its non-anchor companion", () => {
    expect(GUNDAM_EN_US_PRODUCT_RELEASES.GD05).toMatchObject({
      title: "Freedom Ascension",
      productType: "booster_pack",
      editorialCycleId: "gundam-en-us-gd05",
      editorialCycleRole: "anchor",
    });
    expect(GUNDAM_EN_US_PRODUCT_RELEASES.SC01).toMatchObject({
      title: "Deck Build Box Freedom Ascension",
      productType: "deck_build_box",
      editorialCycleId: "gundam-en-us-gd05",
      editorialCycleRole: "companion",
    });
    expect(
      GUNDAM_EN_US_EDITORIAL_RELEASE_CYCLES.filter(
        (cycle) => cycle.cycleId === "gundam-en-us-gd05",
      ),
    ).toHaveLength(1);
  });

  it("derives preview and released states at the injected date boundary", () => {
    expect(getGundamSetRelease("gd05", "2026-07-23")).toMatchObject({
      setCode: "GD05",
      releaseDate: "2026-07-24",
      state: "preview",
    });
    expect(getGundamSetRelease({ code: "gd05" }, "2026-07-24")).toMatchObject({
      setCode: "GD05",
      releaseDate: "2026-07-24",
      state: "released",
    });
    expect(getGundamPrintingRelease({ setCode: "ST10" }, "2026-06-26").state).toBe("released");
  });

  it("keeps unmapped namespaces explicitly unknown without a fallback date", () => {
    expect(getGundamSetRelease("promo-future", "2030-01-01")).toEqual({
      setCode: "PROMO-FUTURE",
      region: "en-US",
      releaseDate: null,
      sourceUrl: null,
      state: "unknown",
    });
  });

  it("rejects ambiguous or invalid asOf dates", () => {
    expect(() => getGundamSetRelease("GD01", "2025-7-25")).toThrow("asOf must be an ISO date");
    expect(() => getGundamSetRelease("GD01", "2025-02-30")).toThrow(
      "asOf must be a valid calendar date",
    );
  });

  it("accounts for every exported card set code and snapshots unresolved namespaces", () => {
    const setCodes = [
      ...new Set(exportedCards.map((card) => card.set?.code).filter((code) => code != null)),
    ].sort();
    const unresolved = setCodes.filter(
      (setCode) => getGundamSetRelease(setCode, "2026-07-28").state === "unknown",
    );

    expect(unresolved).toEqual(EXPLICITLY_UNRESOLVED_CARD_SET_CODES);
    expect(setCodes).toHaveLength(29);
  });

  it("accounts for every exported printing set code and snapshots unresolved namespaces", () => {
    const setCodes = [
      ...new Set(
        exportedCards.flatMap((card) => card.printings.map((printing) => printing.setCode)),
      ),
    ].sort();
    const unresolved = setCodes.filter(
      (setCode) => getGundamSetRelease(setCode, "2026-07-28").state === "unknown",
    );

    expect(unresolved).toEqual(EXPLICITLY_UNRESOLVED_PRINTING_SET_CODES);
    expect(setCodes).toHaveLength(31);
  });

  it("keeps a canonical card playable when an earlier printing is released", () => {
    const releasedCardWithFutureReprint = {
      printings: [{ setCode: "GD01" }, { setCode: "GD05" }],
    };

    expect(isGundamCanonicalCardReleaseEligible(releasedCardWithFutureReprint, "2025-08-01")).toBe(
      true,
    );
    expect(
      isGundamCanonicalCardReleaseEligible({ printings: [{ setCode: "GD05" }] }, "2025-08-01"),
    ).toBe(false);
    expect(
      isGundamCanonicalCardReleaseEligible({ printings: [{ setCode: "UNMAPPED" }] }, "2030-01-01"),
    ).toBe(false);
  });
});
