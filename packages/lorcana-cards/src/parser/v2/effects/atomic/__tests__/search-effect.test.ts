/**
 * Tests for Search Effect Parser
 * Ensures search and look-at effects are parsed correctly from text.
 */

import { describe, expect, it } from "bun:test";
import type { Effect } from "../../../types";
import { searchEffectParser } from "../search-effect";

describe("searchEffectParser", () => {
  describe("text parsing - search deck and shuffle", () => {
    it("parses 'search your deck for a character and shuffle' correctly", () => {
      const result = searchEffectParser.parse(
        "search your deck for a character and shuffle",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("search-deck");
      expect((result as Effect & { cardType: string }).cardType).toBe(
        "character",
      );
      expect((result as Effect & { putInto: string }).putInto).toBe("hand");
      expect((result as Effect & { shuffle: boolean }).shuffle).toBe(true);
    });

    it("parses 'search your deck for an action, then shuffle' correctly", () => {
      const result = searchEffectParser.parse(
        "search your deck for an action, then shuffle",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("search-deck");
      expect((result as Effect & { cardType: string }).cardType).toBe("action");
      expect((result as Effect & { shuffle: boolean }).shuffle).toBe(true);
    });

    it("parses 'search your deck for item and shuffle your deck' correctly", () => {
      const result = searchEffectParser.parse(
        "search your deck for item and shuffle your deck",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("search-deck");
      expect((result as Effect & { cardType: string }).cardType).toBe("item");
      expect((result as Effect & { shuffle: boolean }).shuffle).toBe(true);
    });
  });

  describe("text parsing - search deck and put", () => {
    it("parses 'search your deck for a character and put it into your hand' correctly", () => {
      const result = searchEffectParser.parse(
        "search your deck for a character and put it into your hand",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("search-deck");
      expect((result as Effect & { cardType: string }).cardType).toBe(
        "character",
      );
      expect((result as Effect & { putInto: string }).putInto).toBe("hand");
      expect((result as Effect & { shuffle: boolean }).shuffle).toBe(false);
    });

    it("parses 'search your deck for a card and put it into play' correctly", () => {
      const result = searchEffectParser.parse(
        "search your deck for a card and put it into play",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("search-deck");
      expect((result as Effect & { putInto: string }).putInto).toBe("play");
      expect((result as Effect & { shuffle: boolean }).shuffle).toBe(false);
    });

    it("parses 'search your deck for a character and put it on top' correctly", () => {
      const result = searchEffectParser.parse(
        "search your deck for a character and put it on top",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("search-deck");
      expect((result as Effect & { putInto: string }).putInto).toBe(
        "top-of-deck",
      );
      expect((result as Effect & { shuffle: boolean }).shuffle).toBe(false);
    });
  });

  describe("text parsing - basic search deck", () => {
    it("parses 'search your deck for a character' correctly", () => {
      const result = searchEffectParser.parse(
        "search your deck for a character",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("search-deck");
      expect((result as Effect & { cardType: string }).cardType).toBe(
        "character",
      );
      expect((result as Effect & { putInto: string }).putInto).toBe("hand");
      expect((result as Effect & { shuffle: boolean }).shuffle).toBe(false);
    });

    it("parses 'search your deck for an item' correctly", () => {
      const result = searchEffectParser.parse("search your deck for an item");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("search-deck");
      expect((result as Effect & { cardType: string }).cardType).toBe("item");
    });

    it("parses 'search your deck for card' without 'a' correctly", () => {
      const result = searchEffectParser.parse("search your deck for card");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("search-deck");
      expect((result as Effect & { cardType: string }).cardType).toBe("card");
    });
  });

  describe("text parsing - look at top X with action", () => {
    it("parses 'look at the top 3 cards of your deck, put 1 into your hand' correctly", () => {
      const result = searchEffectParser.parse(
        "look at the top 3 cards of your deck, put 1 into your hand",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("look-at-cards");
      expect((result as Effect & { amount: number }).amount).toBe(3);
      expect((result as Effect & { from: string }).from).toBe("top-of-deck");
      expect((result as Effect & { target: string }).target).toBe("controller");
      const then = (
        result as Effect & { then?: { action: string; count: number } }
      ).then;
      expect(then?.action).toBe("put-in-hand");
      expect(then?.count).toBe(1);
    });

    it("parses 'look at the top 5 cards, put 2 on top' correctly", () => {
      const result = searchEffectParser.parse(
        "look at the top 5 cards of your deck, put 2 on top",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("look-at-cards");
      expect((result as Effect & { amount: number }).amount).toBe(5);
      const then = (
        result as Effect & { then?: { action: string; count: number } }
      ).then;
      expect(then?.action).toBe("put-on-top");
      expect(then?.count).toBe(2);
    });

    it("parses 'look at the top 4 cards, put 1 on the bottom' correctly", () => {
      const result = searchEffectParser.parse(
        "look at the top 4 cards of your deck, put 1 on the bottom",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("look-at-cards");
      expect((result as Effect & { amount: number }).amount).toBe(4);
      const then = (
        result as Effect & { then?: { action: string; count: number } }
      ).then;
      expect(then?.action).toBe("put-on-bottom");
      expect(then?.count).toBe(1);
    });
  });

  describe("text parsing - look at top X basic", () => {
    it("parses 'look at the top 3 cards of your deck' correctly", () => {
      const result = searchEffectParser.parse(
        "look at the top 3 cards of your deck",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("look-at-cards");
      expect((result as Effect & { amount: number }).amount).toBe(3);
      expect((result as Effect & { from: string }).from).toBe("top-of-deck");
      expect((result as Effect & { target: string }).target).toBe("controller");
    });

    it("parses 'look at the top 1 card' with singular form", () => {
      const result = searchEffectParser.parse(
        "look at the top 1 card of your deck",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("look-at-cards");
      expect((result as Effect & { amount: number }).amount).toBe(1);
    });

    it("parses 'look at the top 10 cards' with double-digit number", () => {
      const result = searchEffectParser.parse(
        "look at the top 10 cards of your deck",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("look-at-cards");
      expect((result as Effect & { amount: number }).amount).toBe(10);
    });
  });

  describe("text parsing - case insensitivity", () => {
    it("parses 'SEARCH YOUR DECK FOR A CHARACTER' in uppercase", () => {
      const result = searchEffectParser.parse(
        "SEARCH YOUR DECK FOR A CHARACTER",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("search-deck");
      expect((result as Effect & { cardType: string }).cardType).toBe(
        "character",
      );
    });

    it("parses 'Look At The Top 3 Cards' in mixed case", () => {
      const result = searchEffectParser.parse(
        "Look At The Top 3 Cards Of Your Deck",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("look-at-cards");
    });

    it("parses 'sEaRcH yOuR dEcK' in random case", () => {
      const result = searchEffectParser.parse("sEaRcH yOuR dEcK fOr A cArD");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("search-deck");
    });
  });

  describe("text parsing - whitespace variations", () => {
    it("parses with single spaces", () => {
      const result = searchEffectParser.parse(
        "search your deck for a character",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("search-deck");
    });

    it("parses with multiple spaces", () => {
      const result = searchEffectParser.parse(
        "search  your  deck  for  a  character",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("search-deck");
    });

    it("parses with tabs", () => {
      const result = searchEffectParser.parse(
        "search\tyour\tdeck\tfor\ta\tcharacter",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("search-deck");
    });
  });

  describe("text parsing - non-matching patterns", () => {
    it("returns null for 'draw 2 cards'", () => {
      const result = searchEffectParser.parse("draw 2 cards");

      expect(result).toBeNull();
    });

    it("returns null for 'discard a card'", () => {
      const result = searchEffectParser.parse("discard a card");

      expect(result).toBeNull();
    });

    it("returns null for 'deal 3 damage'", () => {
      const result = searchEffectParser.parse("deal 3 damage");

      expect(result).toBeNull();
    });

    it("returns null for empty string", () => {
      const result = searchEffectParser.parse("");

      expect(result).toBeNull();
    });

    it("returns null for unrelated text", () => {
      const result = searchEffectParser.parse("gain 2 lore");

      expect(result).toBeNull();
    });
  });

  describe("edge cases", () => {
    it("handles 'look at 0 cards' edge case", () => {
      const result = searchEffectParser.parse(
        "look at the top 0 cards of your deck",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("look-at-cards");
      expect((result as Effect & { amount: number }).amount).toBe(0);
    });

    it("prioritizes search-and-shuffle over search-and-put", () => {
      const result = searchEffectParser.parse(
        "search your deck for a character, put it into your hand, and shuffle",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("search-deck");
      expect((result as Effect & { shuffle: boolean }).shuffle).toBe(true);
    });

    it("prioritizes search-and-put over basic search", () => {
      const result = searchEffectParser.parse(
        "search your deck for a character and put it into play",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("search-deck");
      expect((result as Effect & { putInto: string }).putInto).toBe("play");
    });

    it("prioritizes look-at-with-action over basic look-at", () => {
      const result = searchEffectParser.parse(
        "look at the top 3 cards of your deck and put 1 into your hand",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("look-at-cards");
      const then = (result as Effect & { then?: { action: string } }).then;
      expect(then?.action).toBe("put-in-hand");
    });
  });

  describe("CST parsing", () => {
    it("returns null for CST input with warning log", () => {
      const mockCstNode = {} as any;
      const result = searchEffectParser.parse(mockCstNode);

      expect(result).toBeNull();
    });
  });
});
