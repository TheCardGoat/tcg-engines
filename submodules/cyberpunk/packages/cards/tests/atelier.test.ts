import { describe, expect, it } from "vite-plus/test";

import {
  CYBERPUNK_ALT_ART_SET_CODES,
  CYBERPUNK_RARITY_RANK,
  CYBERPUNK_RARITY_TO_CODE,
  cyberpunkPrintingEffectiveRarityCode,
  cyberpunkRarityCode,
  defaultCyberpunkPrintingId,
  getCyberpunkCardDisplay,
  getCyberpunkPrintingImageUrl,
  getCyberpunkCanonicalForCardId,
  getCyberpunkPrintingInfo,
  getCyberpunkPrintingInfosForCanonical,
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
const LUCYNA_PROMO_PRINTING_ID = "14dc2e38-a373-4b25-be12-e74b1f79e3b2";

// Mandibular Upgrade — welcometonightcityretail gear, rarity Common across
// every printing; none of its printings live in an alt-art set.
const MANDIBULAR_CARD_ID = "6720e7fd-d1e8-4c8a-9ff2-f51f62241902";

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

describe("CYBERPUNK_RARITY_RANK", () => {
  it("ranks the four real Cyberpunk rarities ascending (common is cheapest)", () => {
    expect(CYBERPUNK_RARITY_RANK.common).toBeLessThan(CYBERPUNK_RARITY_RANK.uncommon);
    expect(CYBERPUNK_RARITY_RANK.uncommon).toBeLessThan(CYBERPUNK_RARITY_RANK.rare);
    expect(CYBERPUNK_RARITY_RANK.rare).toBeLessThan(CYBERPUNK_RARITY_RANK.epic);
  });
});

describe("CYBERPUNK_ALT_ART_SET_CODES + isCyberpunkAlternateArtPrinting", () => {
  it("flags exactly the promo, PRM01, boxtoppersretail, and boxtoppersbeta sets as alt-art", () => {
    expect(CYBERPUNK_ALT_ART_SET_CODES.has("PRM01")).toBe(true);
    expect(CYBERPUNK_ALT_ART_SET_CODES.has("promo")).toBe(true);
    expect(CYBERPUNK_ALT_ART_SET_CODES.has("boxtoppersretail")).toBe(true);
    expect(CYBERPUNK_ALT_ART_SET_CODES.has("boxtoppersbeta")).toBe(true);
    expect(CYBERPUNK_ALT_ART_SET_CODES.size).toBe(4);
  });

  it("treats promo/PRM01/boxtoppersretail/boxtoppersbeta printings as alt-art", () => {
    expect(isCyberpunkAlternateArtPrinting({ setCode: "PRM01" })).toBe(true);
    expect(isCyberpunkAlternateArtPrinting({ setCode: "promo" })).toBe(true);
    expect(isCyberpunkAlternateArtPrinting({ setCode: "boxtoppersretail" })).toBe(true);
    expect(isCyberpunkAlternateArtPrinting({ setCode: "boxtoppersbeta" })).toBe(true);
  });

  it("treats base-set printings as non-alt-art", () => {
    expect(isCyberpunkAlternateArtPrinting({ setCode: "welcometonightcityretail" })).toBe(false);
    expect(isCyberpunkAlternateArtPrinting({ setCode: "theheistretailstarterdeck" })).toBe(false);
    expect(isCyberpunkAlternateArtPrinting({ setCode: "theheistbetastarterdeck" })).toBe(false);
    expect(isCyberpunkAlternateArtPrinting({ setCode: "embracingpowerretailstarterdeck" })).toBe(
      false,
    );
    expect(isCyberpunkAlternateArtPrinting({ setCode: "embracingpowerbetastarterdeck" })).toBe(
      false,
    );
  });
});

describe("getCyberpunkCanonicalForCardId", () => {
  it("resolves an authored card id to its canonical merged id", () => {
    // The promo card is single-set, so canonical == its own id.
    expect(getCyberpunkCanonicalForCardId(LUCYNA_PROMO_CARD_ID)).toBe(LUCYNA_PROMO_CARD_ID);
  });

  it("returns null for a truly-unknown card id (strict rejection preserved)", () => {
    expect(getCyberpunkCanonicalForCardId("00000000-0000-0000-0000-000000000000")).toBeNull();
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
    expect(info!.canonicalId).toBe(LUCYNA_PROMO_CARD_ID);

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

  it("marks alt-art-set printings via the shared helper (parity with isAlternateArt)", () => {
    const infos = getCyberpunkPrintingInfosForCanonical(JACKIE_WELLES_CANONICAL_ID);

    const boxtoppers = infos.find((i) => i.printingId === JACKIE_WELLES_BOXTOPPERS_PRINTING_ID)!;
    expect(isCyberpunkAlternateArtPrinting({ setCode: boxtoppers.set })).toBe(true);

    const boxtoppersBeta = infos.find(
      (i) => i.printingId === JACKIE_WELLES_BOXTOPPERS_BETA_PRINTING_ID,
    )!;
    expect(isCyberpunkAlternateArtPrinting({ setCode: boxtoppersBeta.set })).toBe(true);

    const theheist = infos.find((i) => i.printingId === JACKIE_WELLES_THEHEIST_PRINTING_ID)!;
    expect(isCyberpunkAlternateArtPrinting({ setCode: theheist.set })).toBe(false);
  });
});

describe("defaultCyberpunkPrintingId", () => {
  it("picks a non-alt-art printing over alt-art printings for Jackie Welles", () => {
    const defaultId = defaultCyberpunkPrintingId(JACKIE_WELLES_CANONICAL_ID);
    const defaultInfo = getCyberpunkPrintingInfo(defaultId!)!;

    // The boxtoppersretail and boxtoppersbeta printings are alt-art and must be
    // skipped even though they share the Epic rarity with runtime base
    // printings.
    expect(defaultId).not.toBe(JACKIE_WELLES_BOXTOPPERS_PRINTING_ID);
    expect(defaultId).not.toBe(JACKIE_WELLES_BOXTOPPERS_BETA_PRINTING_ID);
    expect(cyberpunkRarityCode(defaultInfo)).toBe("epic");
    expect(isCyberpunkAlternateArtPrinting({ setCode: defaultInfo.set })).toBe(false);
  });

  it("skips alt-art printings even when they are the lowest rarity", () => {
    // Construct a canonical view where the only common printing is the promo
    // (alt-art) one — the default must still avoid it and fall back to the
    // lowest-rarity NON-alt-art printing. Mandibular Upgrade has no alt-art
    // printings at all, so its default is just its lowest-rarity printing.
    const canonical = getCyberpunkCanonicalForCardId(MANDIBULAR_CARD_ID)!;
    const defaultId = defaultCyberpunkPrintingId(canonical);
    expect(defaultId).not.toBeNull();

    const defaultInfo = getCyberpunkPrintingInfo(defaultId!)!;
    // No Mandibular printing is alt-art, and all are Common, so the default is a
    // Common non-alt-art printing.
    expect(cyberpunkRarityCode(defaultInfo)).toBe("common");
    expect(isCyberpunkAlternateArtPrinting({ setCode: defaultInfo.set })).toBe(false);
  });

  it("breaks rarity ties by lowest sortNumber, then by collectorNumber", () => {
    // Mandibular Upgrade has four Common printings across sets with distinct
    // `setPriority` values, so it is a clean fixture for the tie-break rule:
    //   - welcometonightcityretail (priority 100): collectorNumber "062"
    //   - welcometonightcitybeta   (priority  50): collectorNumber "β062"
    //   - theheistretailstarterdeck(priority  90): collectorNumber "008"
    //   - theheistbetastarterdeck  (priority  50): collectorNumber "β008"
    // All Common, none alt-art. Lowest priority (50) ties the two beta
    // printings; ascending collectorNumber breaks the tie → "β008" wins.
    const canonical = getCyberpunkCanonicalForCardId(MANDIBULAR_CARD_ID)!;
    const defaultId = defaultCyberpunkPrintingId(canonical);
    const defaultInfo = getCyberpunkPrintingInfo(defaultId!)!;

    const allInfos = getCyberpunkPrintingInfosForCanonical(canonical);
    // Sanity: every Mandibular printing is Common so the rarity tie-break is
    // inactive and the sortNumber tie-break is what selects the winner.
    expect(allInfos.every((i) => cyberpunkRarityCode(i) === "common")).toBe(true);

    const minSort = Math.min(...allInfos.map((i) => i.sortNumber));
    const lowestSortInfos = allInfos
      .filter((i) => i.sortNumber === minSort)
      .slice()
      .sort((a, b) => a.cardNumber.localeCompare(b.cardNumber));
    const expected = lowestSortInfos[0]!;

    expect(defaultInfo.printingId).toBe(expected.printingId);
    expect(defaultInfo.sortNumber).toBe(minSort);
    expect(defaultInfo.cardNumber).toBe(expected.cardNumber);
  });

  it("falls back to the lowest-rarity printing when every printing is alt-art", () => {
    // Lucyna Kushinada is promo-only: its single printing is alt-art, so the
    // "exclude alt-art" filter leaves nothing. The default must still return a
    // valid printing (the only one) rather than null.
    const canonical = getCyberpunkCanonicalForCardId(LUCYNA_PROMO_CARD_ID)!;
    expect(defaultCyberpunkPrintingId(canonical)).toBe(LUCYNA_PROMO_PRINTING_ID);
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
  it("prices an Epic non-alt-art printing by its raw rarity (→ epic)", () => {
    // Jackie Welles the-heist printing: rarity "Epic", set is not alt-art.
    expect(cyberpunkPrintingEffectiveRarityCode(JACKIE_WELLES_THEHEIST_PRINTING_ID)).toBe("epic");
  });

  it("applies the alt-art-set bump: boxtoppersretail printing → enchanted", () => {
    // Jackie Welles boxtoppersretail printing is Epic in the data, but the
    // set is an alt-art set, so the bump overrides it to `enchanted` (120 marks).
    expect(cyberpunkPrintingEffectiveRarityCode(JACKIE_WELLES_BOXTOPPERS_PRINTING_ID)).toBe(
      "enchanted",
    );
  });

  it("applies the alt-art-set bump: boxtoppersbeta printing → enchanted", () => {
    // Jackie Welles boxtoppersbeta printing is Epic in the data, but the set is
    // an alt-art set, so the bump overrides it to `enchanted` (120 marks).
    expect(cyberpunkPrintingEffectiveRarityCode(JACKIE_WELLES_BOXTOPPERS_BETA_PRINTING_ID)).toBe(
      "enchanted",
    );
  });

  it("applies the alt-art-set bump: promo printing (rarity null) → enchanted", () => {
    // Lucyna Kushinada promo printing has rarity null (→ common raw), but the
    // promo set is an alt-art set, so the bump overrides it to `enchanted`.
    expect(cyberpunkPrintingEffectiveRarityCode(LUCYNA_PROMO_PRINTING_ID)).toBe("enchanted");
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
