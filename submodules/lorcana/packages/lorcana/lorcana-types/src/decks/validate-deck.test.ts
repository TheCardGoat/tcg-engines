import { describe, expect, it } from "bun:test";
import {
  getDeckFormats,
  validateDeckForFormat,
  LORCANA_FORMATS,
  type CardFormatData,
  type DeckCard,
  type LorcanaFormat,
  type LorcanaSetCode,
} from "./validate-deck";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Minimal format for testing: 60-card minimum, 2-ink max. */
function coreFormat(overrides?: Partial<LorcanaFormat>): LorcanaFormat {
  return {
    id: "core-constructed",
    label: "Core Constructed",
    allowedSets: ["SSK", "AZS", "ARC", "ROJ", "FAB", "WIW", "WSP", "WUN"] as LorcanaSetCode[],
    requiredRotationState: "CoreConstructed",
    excludedSets: ["013"] as LorcanaSetCode[],
    ...overrides,
  };
}

function historyFormat(overrides?: Partial<LorcanaFormat>): LorcanaFormat {
  return {
    id: "shimmering-skies",
    label: "Shimmering Skies",
    allowedSets: ["TFC", "ROF", "ITI", "URR", "SSK"] as LorcanaSetCode[],
    // No requiredRotationState — historical snapshot format
    ...overrides,
  };
}

function card(id: string, overrides?: Partial<CardFormatData>): CardFormatData {
  return {
    canonicalId: `ci_${id}`,
    fullName: `Test Card ${id}`,
    sets: ["SSK"] as LorcanaSetCode[],
    inkTypes: ["amber"],
    ...overrides,
  };
}

function deck(entries: Array<{ id: string; qty?: number }>): DeckCard[] {
  return entries.map((e) => ({ cardId: e.id, quantity: e.qty ?? 4 }));
}

function buildLookup(
  cards: Record<string, CardFormatData>,
): (id: string) => CardFormatData | undefined {
  return (id: string) => cards[id];
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("validateDeckForFormat", () => {
  describe("structured details", () => {
    it("reports too few cards with counts", () => {
      const lookup = buildLookup({ amber: card("amber") });
      const result = validateDeckForFormat(
        [{ cardId: "amber", quantity: 2 }],
        lookup,
        coreFormat({ minDeckSize: 3 }),
      );
      const rule = result.rules.find((r) => r.kind === "DECK_SIZE");

      expect(rule?.passed).toBe(false);
      expect(rule?.details).toEqual({ type: "DECK_SIZE", count: 2, minimum: 3 });
    });

    it("reports too many ink types with the offending inks", () => {
      const lookup = buildLookup({
        amber: card("amber", { inkTypes: ["amber"] }),
        ruby: card("ruby", { inkTypes: ["ruby"] }),
        steel: card("steel", { inkTypes: ["steel"] }),
      });
      const result = validateDeckForFormat(
        deck([
          { id: "amber", qty: 1 },
          { id: "ruby", qty: 1 },
          { id: "steel", qty: 1 },
        ]),
        lookup,
        coreFormat({ minDeckSize: 3 }),
      );
      const rule = result.rules.find((r) => r.kind === "INK_TYPES");

      expect(rule?.passed).toBe(false);
      expect(rule?.details).toEqual({
        type: "INK_TYPES",
        inkTypes: ["amber", "ruby", "steel"],
        maximum: 2,
      });
    });

    it("reports too many copies with card ids and copy limits", () => {
      const lookup = buildLookup({
        stitch: card("stitch", { fullName: "Stitch - Alien Dancer" }),
      });
      const result = validateDeckForFormat(
        [{ cardId: "stitch", quantity: 5 }],
        lookup,
        coreFormat({ minDeckSize: 5 }),
      );
      const rule = result.rules.find((r) => r.kind === "CARD_QUANTITY");

      expect(rule?.passed).toBe(false);
      expect(rule?.details).toEqual({
        type: "CARD_QUANTITY",
        cards: [
          {
            publicId: "stitch",
            fullName: "Stitch - Alien Dancer",
            sets: ["SSK"],
            quantity: 5,
            maximum: 4,
          },
        ],
      });
    });

    it("reports cards outside the Attack of the Vine legality window", () => {
      const lookup = buildLookup({
        roj: card("roj", {
          fullName: "Mickey Mouse - Brave Little Tailor",
          sets: ["ROJ"] as LorcanaSetCode[],
        }),
        fab: card("fab", { sets: ["FAB"] as LorcanaSetCode[] }),
      });
      const result = validateDeckForFormat(
        [
          { cardId: "roj", quantity: 4 },
          { cardId: "fab", quantity: 56 },
        ],
        lookup,
        LORCANA_FORMATS["attack-of-the-vine"],
      );
      const rule = result.rules.find((r) => r.kind === "CARD_SET");

      expect(rule?.passed).toBe(false);
      expect(rule?.details).toEqual({
        type: "CARD_SET",
        formatLabel: "Attack of the Vine",
        cards: [
          {
            publicId: "roj",
            fullName: "Mickey Mouse - Brave Little Tailor",
            sets: ["ROJ"],
            quantity: 4,
          },
        ],
      });
    });

    it("reports banned cards with card ids", () => {
      const lookup = buildLookup({
        hiram: card("hiram", { fullName: "Hiram Flaversham - Toymaker" }),
        legal: card("legal"),
      });
      const result = validateDeckForFormat(
        [
          { cardId: "hiram", quantity: 4 },
          { cardId: "legal", quantity: 56 },
        ],
        lookup,
        coreFormat({ bannedCardIds: ["hiram"] }),
      );
      const rule = result.rules.find((r) => r.kind === "BANNED_CARD");

      expect(rule?.passed).toBe(false);
      expect(rule?.details).toEqual({
        type: "BANNED_CARD",
        formatLabel: "Core Constructed",
        cards: [
          {
            publicId: "hiram",
            fullName: "Hiram Flaversham - Toymaker",
            sets: ["SSK"],
            quantity: 4,
          },
        ],
      });
    });

    it("reports required set failures", () => {
      const lookup = buildLookup({
        fab: card("fab", { sets: ["FAB"] as LorcanaSetCode[] }),
      });
      const result = validateDeckForFormat(
        [{ cardId: "fab", quantity: 60 }],
        lookup,
        {
          ...LORCANA_FORMATS["attack-of-the-vine"],
          requiresAnySet: ["013"] as LorcanaSetCode[],
        },
      );
      const rule = result.rules.find((r) => r.kind === "REQUIRES_ANY_SET");

      expect(rule?.passed).toBe(false);
      expect(rule?.details).toEqual({
        type: "REQUIRES_ANY_SET",
        requiredSets: ["013"],
      });
    });
  });

  describe("INK_TYPES rule", () => {
    it("ignores other Hunny character ink types when Christopher Robin grants that deck construction rule", () => {
      const lookup = buildLookup({
        christopher: card("christopher", {
          fullName: "Christopher Robin - Hunny Sage",
          inkTypes: ["amethyst", "sapphire"],
          cardType: "character",
          classifications: ["Dreamborn", "Hero", "Hunny"],
          deckConstructionRules: [
            {
              type: "ignore-ink-types",
              filter: { cardType: "character", classification: "Hunny" },
              excludeSourceCard: true,
            },
          ],
        }),
        rubyHunny: card("rubyHunny", {
          inkTypes: ["ruby"],
          cardType: "character",
          classifications: ["Dreamborn", "Hunny"],
        }),
        emeraldHunny: card("emeraldHunny", {
          inkTypes: ["emerald"],
          cardType: "character",
          classifications: ["Storyborn", "Hunny"],
        }),
      });
      const result = validateDeckForFormat(
        deck([
          { id: "christopher", qty: 1 },
          { id: "rubyHunny", qty: 1 },
          { id: "emeraldHunny", qty: 1 },
        ]),
        lookup,
        coreFormat({ minDeckSize: 3 }),
      );
      const inkRule = result.rules.find((r) => r.kind === "INK_TYPES");
      expect(inkRule?.passed).toBe(true);
      expect(inkRule?.message).toContain("Deck uses 2 ink type(s)");
    });

    it("counts Hunny character ink types normally without Christopher Robin's rule", () => {
      const lookup = buildLookup({
        sapphire: card("sapphire", {
          inkTypes: ["sapphire"],
          cardType: "character",
        }),
        rubyHunny: card("rubyHunny", {
          inkTypes: ["ruby"],
          cardType: "character",
          classifications: ["Dreamborn", "Hunny"],
        }),
        emeraldHunny: card("emeraldHunny", {
          inkTypes: ["emerald"],
          cardType: "character",
          classifications: ["Storyborn", "Hunny"],
        }),
      });
      const result = validateDeckForFormat(
        deck([
          { id: "sapphire", qty: 1 },
          { id: "rubyHunny", qty: 1 },
          { id: "emeraldHunny", qty: 1 },
        ]),
        lookup,
        coreFormat({ minDeckSize: 3 }),
      );
      const inkRule = result.rules.find((r) => r.kind === "INK_TYPES");
      expect(inkRule?.passed).toBe(false);
      expect(inkRule?.message).toContain("sapphire, ruby, emerald");
    });

    it("still counts non-Hunny character ink types with Christopher Robin in the deck", () => {
      const lookup = buildLookup({
        christopher: card("christopher", {
          inkTypes: ["amethyst", "sapphire"],
          cardType: "character",
          classifications: ["Dreamborn", "Hero", "Hunny"],
          deckConstructionRules: [
            {
              type: "ignore-ink-types",
              filter: { cardType: "character", classification: "Hunny" },
              excludeSourceCard: true,
            },
          ],
        }),
        rubyNonHunny: card("rubyNonHunny", {
          inkTypes: ["ruby"],
          cardType: "character",
          classifications: ["Storyborn", "Ally"],
        }),
      });
      const result = validateDeckForFormat(
        deck([
          { id: "christopher", qty: 1 },
          { id: "rubyNonHunny", qty: 1 },
        ]),
        lookup,
        coreFormat({ minDeckSize: 2 }),
      );
      const inkRule = result.rules.find((r) => r.kind === "INK_TYPES");
      expect(inkRule?.passed).toBe(false);
      expect(inkRule?.message).toContain("amethyst, sapphire, ruby");
    });

    it("still counts Hunny non-character ink types with Christopher Robin in the deck", () => {
      const lookup = buildLookup({
        christopher: card("christopher", {
          inkTypes: ["amethyst", "sapphire"],
          cardType: "character",
          classifications: ["Dreamborn", "Hero", "Hunny"],
          deckConstructionRules: [
            {
              type: "ignore-ink-types",
              filter: { cardType: "character", classification: "Hunny" },
              excludeSourceCard: true,
            },
          ],
        }),
        rubyHunnyItem: card("rubyHunnyItem", {
          inkTypes: ["ruby"],
          cardType: "item",
          classifications: ["Hunny"],
        }),
      });
      const result = validateDeckForFormat(
        deck([
          { id: "christopher", qty: 1 },
          { id: "rubyHunnyItem", qty: 1 },
        ]),
        lookup,
        coreFormat({ minDeckSize: 2 }),
      );
      const inkRule = result.rules.find((r) => r.kind === "INK_TYPES");
      expect(inkRule?.passed).toBe(false);
      expect(inkRule?.message).toContain("amethyst, sapphire, ruby");
    });

    it("still counts Christopher Robin's own ink types", () => {
      const lookup = buildLookup({
        christopher: card("christopher", {
          inkTypes: ["amethyst", "sapphire"],
          cardType: "character",
          classifications: ["Dreamborn", "Hero", "Hunny"],
          deckConstructionRules: [
            {
              type: "ignore-ink-types",
              filter: { cardType: "character", classification: "Hunny" },
              excludeSourceCard: true,
            },
          ],
        }),
        amberCard: card("amberCard", {
          inkTypes: ["amber"],
          cardType: "character",
        }),
      });
      const result = validateDeckForFormat(
        deck([
          { id: "christopher", qty: 1 },
          { id: "amberCard", qty: 1 },
        ]),
        lookup,
        coreFormat({ minDeckSize: 2 }),
      );
      const inkRule = result.rules.find((r) => r.kind === "INK_TYPES");
      expect(inkRule?.passed).toBe(false);
      expect(inkRule?.message).toContain("amethyst, sapphire, amber");
    });
  });

  describe("CARD_SET rule", () => {
    it("passes when card has printing in an allowed set", () => {
      const lookup = buildLookup({
        a: card("a", { sets: ["FAB"] as LorcanaSetCode[] }),
      });
      const result = validateDeckForFormat(deck([{ id: "a", qty: 60 }]), lookup, coreFormat());
      const setRule = result.rules.find((r) => r.kind === "CARD_SET");
      expect(setRule?.passed).toBe(true);
    });

    it("fails when card has no printing in an allowed set", () => {
      const lookup = buildLookup({
        a: card("a", { sets: ["TFC"] as LorcanaSetCode[] }),
      });
      const result = validateDeckForFormat(deck([{ id: "a", qty: 60 }]), lookup, coreFormat());
      const setRule = result.rules.find((r) => r.kind === "CARD_SET");
      expect(setRule?.passed).toBe(false);
      expect(setRule?.message).toContain("Test Card a");
    });

    it("passes via rotationState when card set is not in allowedSets", () => {
      const lookup = buildLookup({
        a: card("a", {
          sets: ["TFC"] as LorcanaSetCode[], // old set, not in allowedSets
          rotationStates: ["CoreConstructed"], // but rotation matches
        }),
      });
      const result = validateDeckForFormat(deck([{ id: "a", qty: 60 }]), lookup, coreFormat());
      const setRule = result.rules.find((r) => r.kind === "CARD_SET");
      expect(setRule?.passed).toBe(true);
    });

    it("falls back to set-only when rotationStates is undefined (backward compat)", () => {
      const lookup = buildLookup({
        a: card("a", {
          sets: ["TFC"] as LorcanaSetCode[], // not in core
          rotationStates: undefined, // no rotation data
        }),
      });
      const result = validateDeckForFormat(deck([{ id: "a", qty: 60 }]), lookup, coreFormat());
      const setRule = result.rules.find((r) => r.kind === "CARD_SET");
      expect(setRule?.passed).toBe(false);
    });

    it("ignores rotationState for historical formats (no requiredRotationState)", () => {
      const lookup = buildLookup({
        a: card("a", {
          sets: ["AZS"] as LorcanaSetCode[], // NOT in shimmering-skies allowed sets
          rotationStates: ["CoreConstructed"],
        }),
      });
      const result = validateDeckForFormat(deck([{ id: "a", qty: 60 }]), lookup, historyFormat());
      const setRule = result.rules.find((r) => r.kind === "CARD_SET");
      expect(setRule?.passed).toBe(false);
    });

    it("rejects cards whose only printings live in excludedSets, even when rotation matches", () => {
      const lookup = buildLookup({
        a: card("a", {
          sets: ["WUN"] as LorcanaSetCode[],
          rotationStates: ["CoreConstructed"],
        }),
      });
      const result = validateDeckForFormat(
        deck([{ id: "a", qty: 60 }]),
        lookup,
        coreFormat({ excludedSets: ["WUN"] as LorcanaSetCode[] }),
      );
      const setRule = result.rules.find((r) => r.kind === "CARD_SET");
      expect(setRule?.passed).toBe(false);
    });

    it("allows excluded-set cards when they also have a printing in an allowed set", () => {
      const lookup = buildLookup({
        a: card("a", {
          sets: ["WUN", "SSK"] as LorcanaSetCode[],
          rotationStates: ["CoreConstructed"],
        }),
      });
      const result = validateDeckForFormat(
        deck([{ id: "a", qty: 60 }]),
        lookup,
        coreFormat({ excludedSets: ["WUN"] as LorcanaSetCode[] }),
      );
      const setRule = result.rules.find((r) => r.kind === "CARD_SET");
      expect(setRule?.passed).toBe(true);
    });

    it("specialAllowedCardIds bypass both set and rotation checks", () => {
      const lookup = buildLookup({
        promo: card("promo", {
          sets: ["TFC"] as LorcanaSetCode[], // not in core
          rotationStates: ["InfinityConstructed"], // doesn't match
        }),
      });
      const result = validateDeckForFormat(
        deck([{ id: "promo", qty: 60 }]),
        lookup,
        coreFormat({ specialAllowedCardIds: ["promo"] }),
      );
      const setRule = result.rules.find((r) => r.kind === "CARD_SET");
      expect(setRule?.passed).toBe(true);
    });
  });

  describe("CARD_QUANTITY rule (copy limits across reprints)", () => {
    it("enforces copy limit across different shortIds sharing same canonicalId", () => {
      // Two different shortIds, same canonical card
      const lookup = buildLookup({
        v1: card("shared", { sets: ["SSK"] as LorcanaSetCode[] }),
        v2: card("shared", { sets: ["SSK", "FAB"] as LorcanaSetCode[] }),
      });
      const result = validateDeckForFormat(
        [
          { cardId: "v1", quantity: 3 },
          { cardId: "v2", quantity: 3 },
        ],
        lookup,
        coreFormat({ minDeckSize: 6 }),
      );
      const qtyRule = result.rules.find((r) => r.kind === "CARD_QUANTITY");
      expect(qtyRule?.passed).toBe(false);
      expect(qtyRule?.message).toContain("6 copies");
    });

    it("passes when combined copies are within limit", () => {
      const lookup = buildLookup({
        v1: card("shared", { sets: ["SSK"] as LorcanaSetCode[] }),
        v2: card("shared", { sets: ["SSK"] as LorcanaSetCode[] }),
      });
      const result = validateDeckForFormat(
        [
          { cardId: "v1", quantity: 2 },
          { cardId: "v2", quantity: 2 },
        ],
        lookup,
        coreFormat({ minDeckSize: 4 }),
      );
      const qtyRule = result.rules.find((r) => r.kind === "CARD_QUANTITY");
      expect(qtyRule?.passed).toBe(true);
    });

    it("honors cardCopyLimit raised above 4 (Tail Wagger - 99)", () => {
      const lookup = buildLookup({
        wagger: card("wagger", { cardCopyLimit: 99 }),
      });
      const result = validateDeckForFormat(
        [{ cardId: "wagger", quantity: 60 }],
        lookup,
        coreFormat(),
      );
      const qtyRule = result.rules.find((r) => r.kind === "CARD_QUANTITY");
      expect(qtyRule?.passed).toBe(true);
    });

    it("honors cardCopyLimit = 'no-limit' (Microbots)", () => {
      const lookup = buildLookup({
        bots: card("bots", { cardCopyLimit: "no-limit" }),
      });
      const result = validateDeckForFormat(
        [{ cardId: "bots", quantity: 60 }],
        lookup,
        coreFormat(),
      );
      const qtyRule = result.rules.find((r) => r.kind === "CARD_QUANTITY");
      expect(qtyRule?.passed).toBe(true);
    });

    it("honors cardCopyLimit lowered below 4 (Glass Slipper - 2)", () => {
      const lookup = buildLookup({
        slipper: card("slipper", { cardCopyLimit: 2 }),
      });
      const result = validateDeckForFormat(
        [{ cardId: "slipper", quantity: 3 }],
        lookup,
        coreFormat({ minDeckSize: 3 }),
      );
      const qtyRule = result.rules.find((r) => r.kind === "CARD_QUANTITY");
      expect(qtyRule?.passed).toBe(false);
      expect(qtyRule?.message).toContain("3 copies (maximum 2)");
    });

    it("aggregates reprints/variants under one canonicalId against the override limit", () => {
      // Both variants share canonicalId "ci_slipper" via the card() helper.
      const lookup = buildLookup({
        base: card("slipper", { cardCopyLimit: 2 }),
        enchanted: card("slipper", { cardCopyLimit: 2 }),
      });
      const result = validateDeckForFormat(
        [
          { cardId: "base", quantity: 2 },
          { cardId: "enchanted", quantity: 1 },
        ],
        lookup,
        coreFormat({ minDeckSize: 3 }),
      );
      const qtyRule = result.rules.find((r) => r.kind === "CARD_QUANTITY");
      expect(qtyRule?.passed).toBe(false);
      expect(qtyRule?.message).toContain("3 copies (maximum 2)");
    });
  });

  describe("format definitions", () => {
    it("core-constructed has requiredRotationState", () => {
      expect(LORCANA_FORMATS["core-constructed"].requiredRotationState).toBe("CoreConstructed");
    });

    it("infinity has no requiredRotationState", () => {
      expect(LORCANA_FORMATS.infinity.requiredRotationState).toBeUndefined();
    });

    it("historical formats have no requiredRotationState", () => {
      expect(LORCANA_FORMATS["shimmering-skies"].requiredRotationState).toBeUndefined();
      expect(LORCANA_FORMATS["azurite-sea"].requiredRotationState).toBeUndefined();
      expect(LORCANA_FORMATS["archazias-island"].requiredRotationState).toBeUndefined();
    });

    it("infinity excludes Set 13 during early access", () => {
      expect(LORCANA_FORMATS.infinity.allowedSets).toContain("WUN");
      expect(LORCANA_FORMATS.infinity.allowedSets).not.toContain("013");
    });

    it("core-constructed keeps the pre-Set 13 rotation window during early access", () => {
      expect(LORCANA_FORMATS["core-constructed"].allowedSets).toEqual([
        "SSK",
        "AZS",
        "ARC",
        "ROJ",
        "FAB",
        "WIW",
        "WSP",
        "WUN",
      ]);
      expect(LORCANA_FORMATS["core-constructed"].allowedSets).toContain("ROJ");
      expect(LORCANA_FORMATS["core-constructed"].allowedSets).toContain("WUN");
      expect(LORCANA_FORMATS["core-constructed"].allowedSets).not.toContain("013");
      expect(LORCANA_FORMATS["core-constructed"].excludedSets).toEqual(["013"]);
    });

    it("Set 13 cards are legal only in the early-access queue during early access", () => {
      const lookup = buildLookup({
        wun: card("wun", {
          sets: ["WUN"] as LorcanaSetCode[],
          rotationStates: ["CoreConstructed"],
        }),
        atv: card("atv", {
          sets: ["013"] as LorcanaSetCode[],
          rotationStates: ["CoreConstructed"],
        }),
      });
      const deckCards: DeckCard[] = [
        { cardId: "wun", quantity: 4 },
        { cardId: "atv", quantity: 56 },
      ];

      const infinity = validateDeckForFormat(deckCards, lookup, LORCANA_FORMATS.infinity);
      expect(infinity.rules.find((r) => r.kind === "CARD_SET")?.passed).toBe(false);

      const cc = validateDeckForFormat(deckCards, lookup, LORCANA_FORMATS["core-constructed"]);
      expect(cc.rules.find((r) => r.kind === "CARD_SET")?.passed).toBe(false);

      const earlyAccess = validateDeckForFormat(
        deckCards,
        lookup,
        LORCANA_FORMATS["attack-of-the-vine"],
      );
      expect(earlyAccess.rules.find((r) => r.kind === "CARD_SET")?.passed).toBe(true);
    });

    it("core-constructed still accepts Set 5-8 cards before the Set 13 rotation", () => {
      const lookup = buildLookup({
        roj: card("roj", {
          sets: ["ROJ"] as LorcanaSetCode[],
          rotationStates: ["CoreConstructed"],
        }),
        fab: card("fab", {
          sets: ["FAB"] as LorcanaSetCode[],
          rotationStates: ["CoreConstructed"],
        }),
      });
      const deckCards: DeckCard[] = [
        { cardId: "roj", quantity: 4 },
        { cardId: "fab", quantity: 56 },
      ];

      const result = validateDeckForFormat(deckCards, lookup, LORCANA_FORMATS["core-constructed"]);
      const setRule = result.rules.find((r) => r.kind === "CARD_SET");

      expect(setRule?.passed).toBe(true);
    });

    it("core-constructed accepts older printings when the canonical card also has a current legal printing", () => {
      const lookup = buildLookup({
        reprint: card("reprint", {
          sets: ["TFC", "ROJ"] as LorcanaSetCode[],
          rotationStates: ["CoreConstructed"],
        }),
        fab: card("fab", {
          sets: ["FAB"] as LorcanaSetCode[],
          rotationStates: ["CoreConstructed"],
        }),
      });
      const deckCards: DeckCard[] = [
        { cardId: "reprint", quantity: 4 },
        { cardId: "fab", quantity: 56 },
      ];

      const result = validateDeckForFormat(deckCards, lookup, LORCANA_FORMATS["core-constructed"]);

      expect(result.rules.find((r) => r.kind === "CARD_SET")?.passed).toBe(true);
    });

    it("getDeckFormats can limit detection to supplied formats", () => {
      const lookup = buildLookup({
        ssk: card("ssk", { sets: ["SSK"] as LorcanaSetCode[] }),
      });
      const deckCards: DeckCard[] = [{ cardId: "ssk", quantity: 1 }];
      const core = coreFormat({ minDeckSize: 1 });
      const history = historyFormat({ allowedSets: ["TFC"] as LorcanaSetCode[], minDeckSize: 1 });

      expect(getDeckFormats(deckCards, lookup, [core, history])).toEqual(["core-constructed"]);
      expect(getDeckFormats(deckCards, lookup, [history])).toEqual([]);
    });

    it("attack-of-the-vine validates the new rotation window plus Set 13", () => {
      const lookup = buildLookup(
        Object.fromEntries([
          ...Array.from({ length: 4 }, (_, index) => [
            `fab-${index}`,
            card(`fab-${index}`, { sets: ["FAB"] as LorcanaSetCode[] }),
          ]),
          ...Array.from({ length: 4 }, (_, index) => [
            `wiw-${index}`,
            card(`wiw-${index}`, { sets: ["WIW"] as LorcanaSetCode[] }),
          ]),
          ...Array.from({ length: 4 }, (_, index) => [
            `wsp-${index}`,
            card(`wsp-${index}`, { sets: ["WSP"] as LorcanaSetCode[] }),
          ]),
          ...Array.from({ length: 4 }, (_, index) => [
            `wun-${index}`,
            card(`wun-${index}`, { sets: ["WUN"] as LorcanaSetCode[] }),
          ]),
          ...Array.from({ length: 4 }, (_, index) => [
            `atv-${index}`,
            card(`atv-${index}`, { sets: ["013"] as LorcanaSetCode[] }),
          ]),
          ["roj", card("roj", { sets: ["ROJ"] as LorcanaSetCode[] })],
        ]),
      );

      const earlyAccessDeck = validateDeckForFormat(
        ["fab", "wiw", "wsp", "wun", "atv"].flatMap((set) =>
          Array.from({ length: 3 }, (_, index) => ({ cardId: `${set}-${index}`, quantity: 4 })),
        ),
        lookup,
        LORCANA_FORMATS["attack-of-the-vine"],
      );
      expect(earlyAccessDeck.valid).toBe(true);

      const oldWindowDeck = validateDeckForFormat(
        [
          ...["fab", "wiw", "wsp", "wun"].flatMap((set) =>
            Array.from({ length: 3 }, (_, index) => ({ cardId: `${set}-${index}`, quantity: 4 })),
          ),
          { cardId: "roj", quantity: 4 },
          { cardId: "fab-3", quantity: 4 },
          { cardId: "wiw-3", quantity: 4 },
        ],
        lookup,
        LORCANA_FORMATS["attack-of-the-vine"],
      );
      expect(oldWindowDeck.valid).toBe(false);
      expect(oldWindowDeck.rules.find((r) => r.kind === "CARD_SET")?.passed).toBe(false);
    });
  });
});
