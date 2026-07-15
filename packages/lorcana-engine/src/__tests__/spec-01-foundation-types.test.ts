/**
 * Spec 1: Foundation & Types Test Suite
 *
 * Tests for deck validation and card type guards per Lorcana rules.
 */

import { describe, expect, it } from "bun:test";
import type { InkType, LorcanaCardDefinition } from "@tcg/lorcana-types";
import {
  getAllKeywords,
  getFullName,
  getKeywordValue,
  getShiftCost,
  getSingerValue,
  hasKeyword,
  hasShift,
  isAction,
  isCharacter,
  isItem,
  isLocation,
  isSong,
} from "../card-utils";
import { getCardCounts, getDeckStats, getUniqueInkTypes, validateDeck } from "../deck-validation";

// Helper to create mock cards
function createMockCard(overrides: Partial<LorcanaCardDefinition> = {}): LorcanaCardDefinition {
  return {
    cardType: "character",
    cost: 3,
    fullName: "Test Card - Test Version",
    id: `card-${Math.random().toString(36).slice(2)}`,
    inkType: ["amber"],
    inkable: true,
    lore: 1,
    name: "Test Card",
    set: "TFC",
    strength: 2,
    version: "Test Version",
    willpower: 3,
    ...overrides,
  };
}

// Helper to create a valid 60-card deck with given ink types
function createValidDeck(
  inkType: InkType[] = ["amber"],
  secondInkType?: InkType,
): LorcanaCardDefinition[] {
  const cards: LorcanaCardDefinition[] = [];
  const halfSize = secondInkType ? 30 : 60;

  for (let i = 0; i < halfSize; i++) {
    cards.push(
      createMockCard({
        fullName: `Character ${i % 15} - Version ${Math.floor(i / 15)}`,
        id: `card-${i}`,
        inkType: inkType,
        name: `Character ${i % 15}`,
        version: `Version ${Math.floor(i / 15)}`,
      }),
    );
  }

  if (secondInkType) {
    for (let i = 0; i < 30; i++) {
      cards.push(
        createMockCard({
          fullName: `Character ${(i % 15) + 15} - Version ${Math.floor(i / 15)}`,
          id: `card-${i + 30}`,
          inkType: [secondInkType],
          name: `Character ${(i % 15) + 15}`,
          version: `Version ${Math.floor(i / 15)}`,
        }),
      );
    }
  }

  return cards;
}

describe("Spec 1: Foundation & Types", () => {
  describe("Deck Validation (Rule 2.1)", () => {
    it("rejects deck with fewer than 60 cards (Rule 2.1.1.1)", () => {
      const deck = createValidDeck().slice(0, 59);
      const result = validateDeck(deck);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].type).toBe("TOO_FEW_CARDS");
      if (result.errors[0].type === "TOO_FEW_CARDS") {
        expect(result.errors[0].count).toBe(59);
        expect(result.errors[0].minimum).toBe(60);
      }
    });

    it("accepts deck with exactly 60 cards", () => {
      const deck = createValidDeck();
      const result = validateDeck(deck);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("accepts deck with more than 60 cards", () => {
      const deck = [...createValidDeck(), createMockCard({ id: "extra-1" })];
      const result = validateDeck(deck);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("rejects deck with 3+ ink types (Rule 2.1.1.2)", () => {
      const deck: LorcanaCardDefinition[] = [];

      // Add 20 cards of each of 3 ink types
      for (let i = 0; i < 20; i++) {
        deck.push(
          createMockCard({
            fullName: `Amber ${i}`,
            id: `amber-${i}`,
            inkType: ["amber"],
          }),
        );
        deck.push(
          createMockCard({
            fullName: `Ruby ${i}`,
            id: `ruby-${i}`,
            inkType: ["ruby"],
          }),
        );
        deck.push(
          createMockCard({
            fullName: `Sapphire ${i}`,
            id: `sapphire-${i}`,
            inkType: ["sapphire"],
          }),
        );
      }

      const result = validateDeck(deck);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.type === "TOO_MANY_INK_TYPES")).toBe(true);
    });

    it("accepts mono-ink deck", () => {
      const deck = createValidDeck(["amber"]);
      const result = validateDeck(deck);

      expect(result.valid).toBe(true);
      expect(getUniqueInkTypes(deck)).toEqual(["amber"]);
    });

    it("accepts dual-ink deck", () => {
      const deck = createValidDeck(["amber"], "ruby");
      const result = validateDeck(deck);

      expect(result.valid).toBe(true);
      expect(getUniqueInkTypes(deck).toSorted()).toEqual(["amber", "ruby"]);
    });

    it("rejects deck with 5+ copies of same full name (Rule 2.1.1.3)", () => {
      const deck = createValidDeck();
      // Replace 5 cards with same full name
      for (let i = 0; i < 5; i++) {
        deck[i] = createMockCard({
          fullName: "Elsa - Ice Queen",
          id: `elsa-${i}`,
          name: "Elsa",
          version: "Ice Queen",
        });
      }

      const result = validateDeck(deck);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.type === "TOO_MANY_COPIES")).toBe(true);
      const copyError = result.errors.find((e) => e.type === "TOO_MANY_COPIES");
      if (copyError && copyError.type === "TOO_MANY_COPIES") {
        expect(copyError.fullName).toBe("Elsa - Ice Queen");
        expect(copyError.count).toBe(5);
      }
    });

    it("accepts 4 copies of same full name", () => {
      const deck = createValidDeck();
      // Replace 4 cards with same full name
      for (let i = 0; i < 4; i++) {
        deck[i] = createMockCard({
          fullName: "Elsa - Ice Queen",
          id: `elsa-${i}`,
          name: "Elsa",
          version: "Ice Queen",
        });
      }

      const result = validateDeck(deck);
      const copyErrors = result.errors.filter((e) => e.type === "TOO_MANY_COPIES");

      expect(copyErrors).toHaveLength(0);
    });

    it("treats different versions as different cards", () => {
      const deck = createValidDeck();
      // Replace 4 cards with "Elsa - Ice Queen"
      for (let i = 0; i < 4; i++) {
        deck[i] = createMockCard({
          fullName: "Elsa - Ice Queen",
          id: `elsa-ice-${i}`,
          name: "Elsa",
          version: "Ice Queen",
        });
      }
      // Replace 4 more cards with "Elsa - Snow Queen"
      for (let i = 4; i < 8; i++) {
        deck[i] = createMockCard({
          fullName: "Elsa - Snow Queen",
          id: `elsa-snow-${i}`,
          name: "Elsa",
          version: "Snow Queen",
        });
      }

      const result = validateDeck(deck);
      const copyErrors = result.errors.filter((e) => e.type === "TOO_MANY_COPIES");

      expect(copyErrors).toHaveLength(0);
    });

    it("allows unlimited copies when cardCopyLimit is 'no-limit'", () => {
      const deck = createValidDeck();
      // Replace 10 cards with Microbots (no limit)
      for (let i = 0; i < 10; i++) {
        deck[i] = createMockCard({
          cardCopyLimit: "no-limit",
          fullName: "Microbots - Tiny Helpers",
          id: `microbots-${i}`,
          name: "Microbots",
          version: "Tiny Helpers",
        });
      }

      const result = validateDeck(deck);
      const copyErrors = result.errors.filter((e) => e.type === "TOO_MANY_COPIES");

      expect(copyErrors).toHaveLength(0);
    });

    it("respects custom cardCopyLimit of 2 (Perfect Pair rule)", () => {
      const deck = createValidDeck();
      // Replace 3 cards with The Glass Slipper (limit 2)
      for (let i = 0; i < 3; i++) {
        deck[i] = createMockCard({
          cardCopyLimit: 2,
          fullName: "The Glass Slipper - Perfect Fit",
          id: `glass-slipper-${i}`,
          name: "The Glass Slipper",
          version: "Perfect Fit",
        });
      }

      const result = validateDeck(deck);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.type === "TOO_MANY_COPIES")).toBe(true);
      const copyError = result.errors.find((e) => e.type === "TOO_MANY_COPIES");
      if (copyError && copyError.type === "TOO_MANY_COPIES") {
        expect(copyError.fullName).toBe("The Glass Slipper - Perfect Fit");
        expect(copyError.count).toBe(3);
        expect(copyError.maximum).toBe(2);
      }
    });

    it("accepts exactly 2 copies when cardCopyLimit is 2", () => {
      const deck = createValidDeck();
      // Replace 2 cards with The Glass Slipper (limit 2)
      for (let i = 0; i < 2; i++) {
        deck[i] = createMockCard({
          cardCopyLimit: 2,
          fullName: "The Glass Slipper - Perfect Fit",
          id: `glass-slipper-${i}`,
          name: "The Glass Slipper",
          version: "Perfect Fit",
        });
      }

      const result = validateDeck(deck);
      const copyErrors = result.errors.filter(
        (e) => e.type === "TOO_MANY_COPIES" && e.fullName === "The Glass Slipper - Perfect Fit",
      );

      expect(copyErrors).toHaveLength(0);
    });
  });

  describe("Card Type Guards (Section 6)", () => {
    it("identifies character by cardType (Rule 6.1.2)", () => {
      const card = createMockCard({
        cardType: "character",
        strength: 3,
        willpower: 4,
      });

      expect(isCharacter(card)).toBe(true);
      expect(isAction(card)).toBe(false);
      expect(isItem(card)).toBe(false);
      expect(isLocation(card)).toBe(false);
    });

    it("identifies action by cardType (Rule 6.3.1)", () => {
      const card = createMockCard({
        cardType: "action",
        strength: undefined,
        willpower: undefined,
      });

      expect(isAction(card)).toBe(true);
      expect(isCharacter(card)).toBe(false);
      expect(isSong(card)).toBe(false);
    });

    it("identifies song by actionSubtype (Rule 6.3.3)", () => {
      const card = createMockCard({
        actionSubtype: "song",
        cardType: "action",
        strength: undefined,
        willpower: undefined,
      });

      expect(isSong(card)).toBe(true);
      expect(isAction(card)).toBe(true);
    });

    it("identifies item by cardType (Rule 6.4.1)", () => {
      const card = createMockCard({
        cardType: "item",
        strength: undefined,
        willpower: undefined,
      });

      expect(isItem(card)).toBe(true);
    });

    it("identifies location by cardType (Rule 6.5.1)", () => {
      const card = createMockCard({
        cardType: "location",
        lore: 2,
        moveCost: 1,
        strength: undefined,
        willpower: 5,
      });

      expect(isLocation(card)).toBe(true);
    });
  });

  describe("Card Anatomy (Rule 6.2)", () => {
    it("generates full name from name + version", () => {
      const card = createMockCard({
        fullName: "Elsa - Ice Queen",
        name: "Elsa",
        version: "Ice Queen",
      });

      expect(getFullName(card)).toBe("Elsa - Ice Queen");
    });

    it("handles dual-ink cards (Rule 6.2.3.1)", () => {
      const card = createMockCard({
        inkType: ["amber", "ruby"],
      });

      expect(Array.isArray(card.inkType)).toBe(true);
      if (Array.isArray(card.inkType)) {
        expect(card.inkType).toContain("amber");
        expect(card.inkType).toContain("ruby");
      }
    });

    it("handles cards with two names using ampersand (Rule 6.2.4.1)", () => {
      const card = createMockCard({
        fullName: "Flotsam & Jetsam - Slippery Eels",
        name: "Flotsam & Jetsam",
        version: "Slippery Eels",
      });

      expect(card.name).toBe("Flotsam & Jetsam");
      expect(card.name.includes(" & ")).toBe(true);
    });
  });

  describe("Keywords", () => {
    it("detects simple keywords (Bodyguard, Evasive, etc.)", () => {
      const card = createMockCard({
        abilities: [
          {
            id: "ab1",
            keyword: "Bodyguard",
            text: "Bodyguard",
            type: "keyword",
          },
          { id: "ab2", keyword: "Ward", text: "Ward", type: "keyword" },
        ],
      });

      expect(hasKeyword(card, "Bodyguard")).toBe(true);
      expect(hasKeyword(card, "Ward")).toBe(true);
      expect(hasKeyword(card, "Rush")).toBe(false);
    });

    it("extracts value from parameterized keywords (Challenger +2)", () => {
      const card = createMockCard({
        abilities: [
          {
            id: "ab1",
            keyword: "Challenger",
            text: "Challenger +2",
            type: "keyword",
            value: 2,
          },
        ],
      });

      expect(getKeywordValue(card, "Challenger")).toBe(2);
      expect(getKeywordValue(card, "Resist")).toBe(null);
    });

    it("handles multiple keywords on same card", () => {
      const card = createMockCard({
        abilities: [
          {
            id: "ab1",
            keyword: "Bodyguard",
            text: "Bodyguard",
            type: "keyword",
          },
          {
            id: "ab2",
            keyword: "Challenger",
            text: "Challenger +2",
            type: "keyword",
            value: 2,
          },
          {
            id: "ab3",
            keyword: "Resist",
            text: "Resist +1",
            type: "keyword",
            value: 1,
          },
        ],
      });

      const keywords = getAllKeywords(card);
      expect(keywords).toHaveLength(3);
    });

    it("detects Shift keyword and extracts cost", () => {
      const card = createMockCard({
        abilities: [
          {
            cost: { ink: 4 },
            id: "ab1",
            keyword: "Shift",
            shiftTarget: "Elsa",
            text: "Shift 4",
            type: "keyword",
          },
        ],
      });

      expect(hasShift(card)).toBe(true);
      expect(getShiftCost(card)).toBe(4);
    });

    it("detects Singer keyword and extracts value", () => {
      const card = createMockCard({
        abilities: [
          {
            id: "ab1",
            keyword: "Singer",
            text: "Singer 5",
            type: "keyword",
            value: 5,
          },
        ],
      });

      expect(getSingerValue(card)).toBe(5);
    });
  });

  describe("Deck Statistics", () => {
    it("calculates deck statistics correctly", () => {
      const deck = createValidDeck(["amber"], "ruby");
      const stats = getDeckStats(deck);

      expect(stats.totalCards).toBe(60);
      expect(stats.inkTypes.toSorted()).toEqual(["amber", "ruby"]);
      expect(stats.cardTypeBreakdown.characters).toBe(60);
    });

    it("counts card copies correctly", () => {
      const deck = createValidDeck();
      const counts = getCardCounts(deck);

      // Each unique fullName should have at most 4 copies
      for (const [, count] of counts) {
        expect(count).toBeLessThanOrEqual(4);
      }
    });
  });
});
