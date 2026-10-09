import { describe, expect, it } from "vite-plus/test";

import {
  legacyAccentMangledSlugAliases,
  CYBERPUNK_RARITY_TO_CODE,
  cyberpunkPrintingEffectiveRarityCode,
  cyberpunkRarityCode,
  defaultCyberpunkPrintingId,
  getCyberpunkCardDisplay,
  getCyberpunkFreeArtIdsForCanonical,
  getCyberpunkPrintingImageUrl,
  getCyberpunkCanonicalForCardId,
  getCyberpunkPrintingInfo,
  getCyberpunkPrintingInfosForCanonical,
  isCyberpunkAlternateArtId,
  isCyberpunkAlternateArtPrinting,
  isCyberpunkPrintingOfCanonical,
} from "../src/index.ts";

// ---------------------------------------------------------------------------
// Fixtures (verified against the authored card data)
// ---------------------------------------------------------------------------
//
// Lucyna Kushinada — promo card, single printing, rarity null. The whole promo
// set is alt-art, so this is a "promo-only" card: every printing is alt-art.
const LUCYNA_PROMO_CARD_ID = "3f2e5d58-dea3-4090-8fe7-0f5f4af2d333";
const LUCYNA_CANONICAL_ID = "lucyna-kushinada";
const LUCYNA_PROMO_PRINTING_ID = "14dc2e38-a373-4b25-be12-e74b1f79e3b2";

// Jackie Welles — Pour One Out For Me: exists in boxtoppers retail (Epic) and
// the-heist retail starter deck (Epic). They share an id and slug, so they
// merge into ONE runtime canonical carrying released printings across sets.
// These are PRINTING ids; the canonical is resolved from them via
// getCyberpunkPrintingInfo (printing ids and card ids are distinct namespaces).
const JACKIE_WELLES_BOXTOPPERS_PRINTING_ID = "e4e17d32-3ec4-4c74-927c-fd0911b86e72"; // set boxtoppersretail
const JACKIE_WELLES_BOXTOPPERS_BETA_PRINTING_ID = "328cd3e4-4177-4d6a-86c0-00d1a5a12b38"; // set boxtoppersbeta
const JACKIE_WELLES_THEHEIST_PRINTING_ID = "a33d3324-fe48-4a9f-80a8-8545a0a4727f"; // set theheistretailstarterdeck
// Canonical merged card id for the Jackie Welles slug, resolved once from any of
// its printings. Computed at module load (the card pool is memoized).
const JACKIE_WELLES_CANONICAL_ID = getCyberpunkPrintingInfo(
  JACKIE_WELLES_THEHEIST_PRINTING_ID,
)!.canonicalId;

describe("CYBERPUNK_RARITY_TO_CODE + cyberpunkRarityCode", () => {
  it("maps every authored Title-Case rarity to its lowercase code", () => {
    expect(CYBERPUNK_RARITY_TO_CODE.Common).toBe("common");
    expect(CYBERPUNK_RARITY_TO_CODE.Uncommon).toBe("uncommon");
    expect(CYBERPUNK_RARITY_TO_CODE.Rare).toBe("rare");
    expect(CYBERPUNK_RARITY_TO_CODE.Epic).toBe("epic");
  });

  it("normalizes empty-string rarity to common (the bulk of Cyberpunk printings)", () => {
    expect(cyberpunkRarityCode({ rarity: "" })).toBe("common");
  });

  it("falls back to common for values outside the known CardRarity union", () => {
    // Runtime defense only — TypeScript rejects these at compile time, but the
    // function still guards against bad data that sneaks in via JSON/scrapers.
    expect(cyberpunkRarityCode({ rarity: "Mythic" as "Common" })).toBe("common");
  });

  it("maps a populated rarity through the table", () => {
    expect(cyberpunkRarityCode({ rarity: "Epic" })).toBe("epic");
    expect(cyberpunkRarityCode({ rarity: "Rare" })).toBe("rare");
  });
});

describe("getCyberpunkCanonicalForCardId", () => {
  it("resolves an authored card id to its canonical merged id", () => {
    expect(getCyberpunkCanonicalForCardId(LUCYNA_PROMO_CARD_ID)).toBe(LUCYNA_CANONICAL_ID);
  });

  it("resolves the stable canonical slug to itself", () => {
    expect(getCyberpunkCanonicalForCardId(LUCYNA_CANONICAL_ID)).toBe(LUCYNA_CANONICAL_ID);
  });

  it("returns null for a truly-unknown card id (strict rejection preserved)", () => {
    expect(getCyberpunkCanonicalForCardId("00000000-0000-0000-0000-000000000000")).toBeNull();
  });

  it("maps the accent-folded Gilded Matón display slug to the retail canonical", () => {
    expect(getCyberpunkCanonicalForCardId("gilded-maton")).toBe("gilded-maton");
  });

  it("maps legacy accent-mangled slugs to the folded canonical", () => {
    for (const [legacySlug, canonicalSlug] of Object.entries(legacyAccentMangledSlugAliases)) {
      expect(getCyberpunkCanonicalForCardId(legacySlug)).toBe(canonicalSlug);
    }
  });
});

describe("getCyberpunkPrintingInfosForCanonical + getCyberpunkPrintingInfo", () => {
  it("projects every printing of a canonical card with the cross-game shape", () => {
    const canonical = getCyberpunkCanonicalForCardId(LUCYNA_PROMO_CARD_ID)!;
    const infos = getCyberpunkPrintingInfosForCanonical(canonical);
    expect(infos).toHaveLength(1);

    const info = infos[0]!;
    expect(info.printingId).toBe(LUCYNA_PROMO_PRINTING_ID);
    expect(info.canonicalId).toBe(canonical);
    expect(info.set).toBe("promo");
    expect(info.cardNumber).toBe("N001");
    // Lucyna's promo printing carries no rarity, which serializes as the empty
    // string under the unified `Printing.rarity: string` contract (priced as
    // "common" via cyberpunkRarityCode).
    expect(info.rarity).toBe("");
    // specialRarity is always null for Cyberpunk (no such field in authored data).
    expect(info.specialRarity).toBeNull();
    // sortNumber derives from setPriority so retail sets rank higher.
    expect(typeof info.sortNumber).toBe("number");
    // imageUrl is resolved deterministically from (set, cardNumber) so the
    // acquire modal surfaces the per-printing art the deckbuilder renders.
    expect(info.imageUrl).toBe(getCyberpunkPrintingImageUrl("promo", "N001"));
    expect(info.imageUrl).toContain("/promo/");
    expect(info.imageUrl).toMatch(/\.webp$/);
  });

  it("unions cross-set printings onto the canonical (Jackie Welles multi-set)", () => {
    const infos = getCyberpunkPrintingInfosForCanonical(JACKIE_WELLES_CANONICAL_ID);
    const printingIds = infos.map((i) => i.printingId);

    // The boxtoppersretail (alt-art), boxtoppersbeta (alt-art), and the-heist
    // printings must all be present on the single merged canonical.
    expect(printingIds).toContain(JACKIE_WELLES_BOXTOPPERS_PRINTING_ID);
    expect(printingIds).toContain(JACKIE_WELLES_BOXTOPPERS_BETA_PRINTING_ID);
    expect(printingIds).toContain(JACKIE_WELLES_THEHEIST_PRINTING_ID);
    expect(new Set(printingIds).size).toBe(printingIds.length);
  });

  it("round-trips: getCyberPrintingInfo(printingId) returns the same projection", () => {
    const info = getCyberpunkPrintingInfo(LUCYNA_PROMO_PRINTING_ID);
    expect(info).not.toBeNull();
    expect(info!.printingId).toBe(LUCYNA_PROMO_PRINTING_ID);
    expect(info!.canonicalId).toBe(LUCYNA_CANONICAL_ID);

    // Consistency with the canonical-scoped enumeration.
    const canonicalInfos = getCyberpunkPrintingInfosForCanonical(info!.canonicalId);
    expect(canonicalInfos.find((i) => i.printingId === info!.printingId)).toBeDefined();
  });

  it("returns null for an unknown printing id", () => {
    expect(getCyberpunkPrintingInfo("does-not-exist")).toBeNull();
  });

  it("returns [] for an unknown canonical id", () => {
    expect(getCyberpunkPrintingInfosForCanonical("00000000-0000-0000-0000-000000000000")).toEqual(
      [],
    );
  });

  it("marks appearance-level variants via the shared helper", () => {
    const infos = getCyberpunkPrintingInfosForCanonical(JACKIE_WELLES_CANONICAL_ID);

    const boxtoppers = infos.find((i) => i.printingId === JACKIE_WELLES_BOXTOPPERS_PRINTING_ID)!;
    expect(isCyberpunkAlternateArtPrinting({ printingId: boxtoppers.printingId })).toBe(true);

    const boxtoppersBeta = infos.find(
      (i) => i.printingId === JACKIE_WELLES_BOXTOPPERS_BETA_PRINTING_ID,
    )!;
    expect(isCyberpunkAlternateArtPrinting({ printingId: boxtoppersBeta.printingId })).toBe(true);

    const theheist = infos.find((i) => i.printingId === JACKIE_WELLES_THEHEIST_PRINTING_ID)!;
    expect(isCyberpunkAlternateArtPrinting({ printingId: theheist.printingId })).toBe(false);
    expect(boxtoppers.artId).toBe(boxtoppersBeta.artId);
    expect(isCyberpunkAlternateArtId(boxtoppers.artId)).toBe(true);
  });
});

describe("defaultCyberpunkPrintingId", () => {
  it("picks the explicitly free simple art for Jackie Welles", () => {
    const defaultId = defaultCyberpunkPrintingId(JACKIE_WELLES_CANONICAL_ID);
    const defaultInfo = getCyberpunkPrintingInfo(defaultId!)!;

    expect(getCyberpunkFreeArtIdsForCanonical(JACKIE_WELLES_CANONICAL_ID)).toContain(
      defaultInfo.artId,
    );
    expect(isCyberpunkAlternateArtPrinting({ printingId: defaultInfo.printingId })).toBe(false);
  });

  it("keeps a valid free printing for a promo-only canonical", () => {
    const canonical = getCyberpunkCanonicalForCardId(LUCYNA_PROMO_CARD_ID)!;
    expect(defaultCyberpunkPrintingId(canonical)).toBe(LUCYNA_PROMO_PRINTING_ID);
    expect(isCyberpunkAlternateArtPrinting({ printingId: LUCYNA_PROMO_PRINTING_ID })).toBe(false);
  });

  it("returns null for an unknown canonical id", () => {
    expect(defaultCyberpunkPrintingId("00000000-0000-0000-0000-000000000000")).toBeNull();
  });
});

describe("isCyberpunkPrintingOfCanonical", () => {
  it("accepts a printing that belongs to the canonical", () => {
    expect(
      isCyberpunkPrintingOfCanonical(
        JACKIE_WELLES_BOXTOPPERS_PRINTING_ID,
        JACKIE_WELLES_CANONICAL_ID,
      ),
    ).toBe(true);
    expect(
      isCyberpunkPrintingOfCanonical(
        JACKIE_WELLES_THEHEIST_PRINTING_ID,
        JACKIE_WELLES_CANONICAL_ID,
      ),
    ).toBe(true);
  });

  it("rejects a printing from a different canonical (security boundary)", () => {
    const lucynaCanonical = getCyberpunkCanonicalForCardId(LUCYNA_PROMO_CARD_ID)!;
    // The Lucyna promo printing does NOT belong to the Jackie Welles canonical.
    expect(
      isCyberpunkPrintingOfCanonical(LUCYNA_PROMO_PRINTING_ID, JACKIE_WELLES_CANONICAL_ID),
    ).toBe(false);
    // And vice versa: a Jackie Welles printing does not belong to Lucyna.
    expect(
      isCyberpunkPrintingOfCanonical(JACKIE_WELLES_THEHEIST_PRINTING_ID, lucynaCanonical),
    ).toBe(false);
  });

  it("rejects an unknown printing id", () => {
    expect(isCyberpunkPrintingOfCanonical("does-not-exist", JACKIE_WELLES_CANONICAL_ID)).toBe(
      false,
    );
  });

  it("rejects an unknown canonical id even for a real printing", () => {
    expect(
      isCyberpunkPrintingOfCanonical(
        JACKIE_WELLES_THEHEIST_PRINTING_ID,
        "00000000-0000-0000-0000-000000000000",
      ),
    ).toBe(false);
  });
});

describe("cyberpunkPrintingEffectiveRarityCode", () => {
  it("prices all simple appearances at the same free tier", () => {
    expect(cyberpunkPrintingEffectiveRarityCode(JACKIE_WELLES_THEHEIST_PRINTING_ID)).toBe("common");
  });

  it("prices a distinct box-topper appearance at enchanted", () => {
    expect(cyberpunkPrintingEffectiveRarityCode(JACKIE_WELLES_BOXTOPPERS_PRINTING_ID)).toBe(
      "enchanted",
    );
  });

  it("uses the same price for equivalent box-topper printings", () => {
    expect(cyberpunkPrintingEffectiveRarityCode(JACKIE_WELLES_BOXTOPPERS_BETA_PRINTING_ID)).toBe(
      "enchanted",
    );
  });

  it("prices a promo-only canonical's simple free art at the free tier", () => {
    expect(cyberpunkPrintingEffectiveRarityCode(LUCYNA_PROMO_PRINTING_ID)).toBe("common");
  });

  it("returns common for an unknown printing id (never silently grants top tier)", () => {
    expect(cyberpunkPrintingEffectiveRarityCode("does-not-exist")).toBe("common");
  });
});

describe("getCyberpunkPrintingImageUrl", () => {
  it("builds a CDN URL from (setCode, collectorNumber) matching the catalog transform", () => {
    // Verbatim parity with `cyberpunkCardImageUrl` in
    // `platform/apps/general-api/src/modules/cyberpunk/service.ts`.
    expect(getCyberpunkPrintingImageUrl("promo", "N001")).toBe(
      "https://cdn.tcg.online/public/cyberpunk/cards/promo/n001.webp",
    );
    expect(getCyberpunkPrintingImageUrl("welcometonightcityretail", "062")).toBe(
      "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/062.webp",
    );
  });

  it("normalizes Greek-prefix collector numbers to ASCII for the asset path", () => {
    // α062 → a062, β008 → b008 (the assets repo layout). Catalog parity.
    expect(getCyberpunkPrintingImageUrl("welcometonightcityretail", "\u03b1062")).toBe(
      "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/a062.webp",
    );
    expect(getCyberpunkPrintingImageUrl("theheistbetastarterdeck", "\u03b2008")).toBe(
      "https://cdn.tcg.online/public/cyberpunk/cards/theheistbetastarterdeck/b008.webp",
    );
  });
});

describe("getCyberpunkCardDisplay", () => {
  it("returns the card's display name + default-printing image for a known canonical", () => {
    const display = getCyberpunkCardDisplay(JACKIE_WELLES_CANONICAL_ID);
    expect(display).not.toBeNull();
    // Name is the authored display name (or falls back to `name`).
    expect(typeof display!.name).toBe("string");
    expect(display!.name.length).toBeGreaterThan(0);
    // Image is the default printing's URL (default = lowest-rarity non-alt-art).
    const defaultId = defaultCyberpunkPrintingId(JACKIE_WELLES_CANONICAL_ID)!;
    const defaultInfo = getCyberpunkPrintingInfo(defaultId)!;
    expect(display!.imageUrl).toBe(defaultInfo.imageUrl);
    expect(display!.imageUrl).toMatch(/^https:\/\/cdn\.tcg\.online\//);
  });

  it("resolves a promo-only card's display from its single (alt-art) printing", () => {
    // Lucyna Kushinada: promo-only, so the default falls back to the only
    // printing. The display image must still resolve (no null) so the acquire
    // modal renders.
    const canonical = getCyberpunkCanonicalForCardId(LUCYNA_PROMO_CARD_ID)!;
    const display = getCyberpunkCardDisplay(canonical);
    expect(display).not.toBeNull();
    expect(display!.imageUrl).toBe(getCyberpunkPrintingImageUrl("promo", "N001"));
  });

  it("returns null for an unknown canonical id", () => {
    expect(getCyberpunkCardDisplay("00000000-0000-0000-0000-000000000000")).toBeNull();
  });
});
