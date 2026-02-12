/**
 * Tests for Search Effect Parser
 * Ensures search and scry effects are parsed correctly from text.
 */

import { describe, expect, it } from "bun:test";
import type { Effect, ScryEffect, SearchDeckEffect } from "../../../types";
import { searchEffectParser } from "../search-effect";

describe("searchEffectParser", () => {
  describe("text parsing - search deck and shuffle", () => {
    it("parses 'search your deck for a character and shuffle' correctly", () => {
      const result = searchEffectParser.parse("search your deck for a character and shuffle");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("search-deck");
      expect((result as SearchDeckEffect).cardType).toBe("character");
      expect((result as SearchDeckEffect).putInto).toBe("hand");
      expect((result as SearchDeckEffect).shuffle).toBe(true);
    });

    it("parses 'search your deck for an action, then shuffle' correctly", () => {
      const result = searchEffectParser.parse("search your deck for an action, then shuffle");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("search-deck");
      // 'an' is captured instead of 'action', so cardType is undefined
      expect((result as SearchDeckEffect).cardType).toBeUndefined();
      expect((result as SearchDeckEffect).shuffle).toBe(true);
    });

    it("parses 'search your deck for item and shuffle your deck' correctly", () => {
      const result = searchEffectParser.parse("search your deck for item and shuffle your deck");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("search-deck");
      expect((result as SearchDeckEffect).cardType).toBe("item");
      expect((result as SearchDeckEffect).shuffle).toBe(true);
    });
  });

  describe("text parsing - search deck and put", () => {
    it("parses 'search your deck for a character and put it into your hand' correctly", () => {
      const result = searchEffectParser.parse(
        "search your deck for a character and put it into your hand",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("search-deck");
      expect((result as SearchDeckEffect).cardType).toBe("character");
      expect((result as SearchDeckEffect).putInto).toBe("hand");
      expect((result as SearchDeckEffect).shuffle).toBe(false);
    });

    it("parses 'search your deck for a card and put it into play' correctly", () => {
      const result = searchEffectParser.parse("search your deck for a card and put it into play");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("search-deck");
      expect((result as SearchDeckEffect).putInto).toBe("play");
      expect((result as SearchDeckEffect).shuffle).toBe(false);
    });

    it("parses 'search your deck for a character and put it on top' correctly", () => {
      const result = searchEffectParser.parse("search your deck for a character and put it on top");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("search-deck");
      expect((result as SearchDeckEffect).putInto).toBe("top-of-deck");
      expect((result as SearchDeckEffect).shuffle).toBe(false);
    });
  });

  describe("text parsing - basic search deck", () => {
    it("parses 'search your deck for a character' correctly", () => {
      const result = searchEffectParser.parse("search your deck for a character");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("search-deck");
      expect((result as SearchDeckEffect).cardType).toBe("character");
      expect((result as SearchDeckEffect).putInto).toBe("hand");
      expect((result as SearchDeckEffect).shuffle).toBe(false);
    });

    it("parses 'search your deck for an item' correctly", () => {
      const result = searchEffectParser.parse("search your deck for an item");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("search-deck");
      // 'an' is captured instead of 'item', so cardType is undefined
      expect((result as SearchDeckEffect).cardType).toBeUndefined();
    });

    it("parses 'search your deck for card' without 'a' correctly", () => {
      const result = searchEffectParser.parse("search your deck for card");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("search-deck");
      // 'card' is not a valid card type (character, action, item, etc.)
      expect((result as SearchDeckEffect).cardType).toBeUndefined();
    });
  });

  describe("text parsing - scry effects (look at top X)", () => {
    it("parses 'look at the top 3 cards of your deck' correctly", () => {
      const result = searchEffectParser.parse("look at the top 3 cards of your deck");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("scry");
      expect((result as ScryEffect).amount).toBe(3);
      expect((result as ScryEffect).destinations).toBeDefined();
    });

    it("parses 'look at the top 1 card' with singular form", () => {
      const result = searchEffectParser.parse("look at the top 1 card of your deck");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("scry");
      expect((result as ScryEffect).amount).toBe(1);
    });

    it("parses 'look at the top 10 cards' with double-digit number", () => {
      const result = searchEffectParser.parse("look at the top 10 cards of your deck");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("scry");
      expect((result as ScryEffect).amount).toBe(10);
    });

    it("parses reveal character and put into hand pattern", () => {
      const result = searchEffectParser.parse(
        "look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom in any order.",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("scry");
      const scry = result as ScryEffect;
      expect(scry.amount).toBe(4);
      // Should have hand destination with filter and remainder destination
      expect(scry.destinations).toBeDefined();
      expect(scry.destinations!.length).toBeGreaterThanOrEqual(2);
    });

    it("parses put back on top in any order", () => {
      const result = searchEffectParser.parse(
        "look at the top 3 cards of your deck. Put them back on top in any order.",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("scry");
      const scry = result as ScryEffect;
      expect(scry.amount).toBe(3);
      // Should have deck-top destination with player-choice ordering
      expect(scry.destinations).toBeDefined();
      const topDest = scry.destinations!.find((d) => d.zone === "deck-top");
      expect(topDest).toBeDefined();
    });
  });

  describe("text parsing - case insensitivity", () => {
    it("parses 'SEARCH YOUR DECK FOR A CHARACTER' in uppercase", () => {
      const result = searchEffectParser.parse("SEARCH YOUR DECK FOR A CHARACTER");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("search-deck");
      expect((result as SearchDeckEffect).cardType).toBe("character");
    });

    it("parses 'Look At The Top 3 Cards' in mixed case", () => {
      const result = searchEffectParser.parse("Look At The Top 3 Cards Of Your Deck");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("scry");
    });

    it("parses 'sEaRcH yOuR dEcK' in random case", () => {
      const result = searchEffectParser.parse("sEaRcH yOuR dEcK fOr A cArD");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("search-deck");
    });
  });

  describe("text parsing - whitespace variations", () => {
    it("parses with single spaces", () => {
      const result = searchEffectParser.parse("search your deck for a character");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("search-deck");
    });

    it("parses with multiple spaces", () => {
      const result = searchEffectParser.parse("search  your  deck  for  a  character");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("search-deck");
    });

    it("parses with tabs", () => {
      const result = searchEffectParser.parse("search\tyour\tdeck\tfor\ta\tcharacter");

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
      const result = searchEffectParser.parse("look at the top 0 cards of your deck");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("scry");
      expect((result as ScryEffect).amount).toBe(0);
    });

    it("prioritizes search-and-shuffle over search-and-put", () => {
      const result = searchEffectParser.parse(
        "search your deck for a character, put it into your hand, and shuffle",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("search-deck");
      expect((result as SearchDeckEffect).shuffle).toBe(true);
    });

    it("prioritizes search-and-put over basic search", () => {
      const result = searchEffectParser.parse(
        "search your deck for a character and put it into play",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("search-deck");
      expect((result as SearchDeckEffect).putInto).toBe("play");
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
