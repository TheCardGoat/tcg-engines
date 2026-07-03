import { describe, expect, it } from "bun:test";
import { lorcanaServerAdapter } from "./adapter";

/**
 * Focused tests for the Lorcana GameAdapter's identity-resolution method.
 *
 * `getCanonicalCardId` resolves the game-native public id (the Lorcana engine
 * short id, e.g. "0Tb") to the card's `canonicalId` (e.g. "ci_0Tb"). It is the
 * analytics canonicalization seam (RFC §5 gap 8, ADR-2) — NOT an identity map,
 * because Lorcana's `canonicalId` (`ci_*`) is distinct from the short id
 * (RFC §4 Lorcana row, §3 worked-example table, ADR-1).
 *
 * The method is declared optional on `GameAdapter`, so call sites use optional
 * chaining (`?.`) per the contract ("Callers MUST null-check and fall back to
 * the raw publicId when this returns null or is absent"). The tests mirror that
 * caller pattern.
 */
describe("lorcanaServerAdapter.getCanonicalCardId", () => {
  it("is implemented — Lorcana opts into the canonicalization contract", () => {
    // The method is optional on the interface; assert Lorcana provides it.
    expect(lorcanaServerAdapter.getCanonicalCardId).toBeTypeOf("function");
  });

  it("resolves a known short id to its canonicalId", () => {
    // Bashful - Hopeless Romantic (set 002): id "0Tb", canonicalId "ci_0Tb".
    expect(lorcanaServerAdapter.getCanonicalCardId?.("0Tb")).toBe("ci_0Tb");
  });

  it("returns a canonical id that differs from the input short id", () => {
    // Guards against an accidental identity implementation: canonicalizing a
    // short id must produce the `ci_*` canonical key, not echo the input.
    const canonical = lorcanaServerAdapter.getCanonicalCardId?.("0Tb");
    expect(canonical).not.toBe("0Tb");
    expect(canonical).toBe("ci_0Tb");
  });

  it("returns null for an unknown public id", () => {
    expect(lorcanaServerAdapter.getCanonicalCardId?.("does-not-exist-999")).toBeNull();
  });

  it("returns null for the empty string", () => {
    // No card is keyed by "" — treat it as unknown so callers fall back to the
    // raw publicId per the GameAdapter contract.
    expect(lorcanaServerAdapter.getCanonicalCardId?.("")).toBeNull();
  });
});

describe("lorcanaServerAdapter.validateDeckForFormat", () => {
  it("preserves structured rule details for adapter consumers", () => {
    const result = lorcanaServerAdapter.validateDeckForFormat("attack-of-the-vine", [
      { cardId: "0Tb", quantity: 60 },
    ]);
    const setRule = result.rules.find((rule) => rule.kind === "CARD_SET");

    expect(setRule?.passed).toBe(false);
    expect(setRule?.details).toEqual({
      type: "CARD_SET",
      formatLabel: "Attack of the Vine",
      cards: [
        expect.objectContaining({
          publicId: "0Tb",
          fullName: "Bashful - Hopeless Romantic",
          quantity: 60,
        }),
      ],
    });
  });

  it("keeps Set 5 through Set 8 cards legal for Core Constructed", () => {
    const deck = [
      { cardId: "284", quantity: 1 }, // Set 5, Shimmering Skies
      { cardId: "178", quantity: 1 }, // Set 6, Azurite Sea
      { cardId: "156", quantity: 1 }, // Set 7, Archazia's Island
      { cardId: "460", quantity: 1 }, // Set 8, Reign of Jafar
    ];

    const core = lorcanaServerAdapter.validateDeckForFormat("core-constructed", deck);
    const earlyAccess = lorcanaServerAdapter.validateDeckForFormat("attack-of-the-vine", deck);

    expect(core.rules.find((rule) => rule.kind === "CARD_SET")?.passed).toBe(true);
    expect(earlyAccess.rules.find((rule) => rule.kind === "CARD_SET")?.passed).toBe(false);
  });

  it("validates the Set 5-12 steel-ruby location deck in Core Constructed", () => {
    const deck = [
      { cardId: "qUy", quantity: 4 }, // Doc - Bold Knight
      { cardId: "1uO", quantity: 4 }, // Seven Dwarfs' Mine - Secure Fortress
      { cardId: "uh8", quantity: 4 }, // Mulan - Disguised Soldier
      { cardId: "a5f", quantity: 4 }, // Get to Safety!
      { cardId: "eWQ", quantity: 4 }, // Sleepy Hollow - The Bridge
      { cardId: "M5d", quantity: 4 }, // Castle Wyvern - Above the Clouds
      { cardId: "hOa", quantity: 4 }, // Zootopia - Police Headquarters
      { cardId: "bEk", quantity: 4 }, // Beast - Snowfield Troublemaker
      { cardId: "qvC", quantity: 4 }, // Gantu - Hamsterviel's Accomplice
      { cardId: "5Yu", quantity: 4 }, // Winterspell
      { cardId: "cXq", quantity: 4 }, // Scrooge McDuck - Ghostly Ebenezer
      { cardId: "v2A", quantity: 4 }, // Pocahontas - Steadfast Traveler
      { cardId: "IZd", quantity: 4 }, // Fat Cat's Club - Seedy Headquarters
      { cardId: "mXi", quantity: 4 }, // The Island of Nomanisan - Syndrome's Headquarters
      { cardId: "kCm", quantity: 4 }, // Jack-Jack Parr - Incredible Potential
    ];

    const result = lorcanaServerAdapter.validateDeckForFormat("core-constructed", deck);

    expect(result.valid).toBe(true);
  });
});
