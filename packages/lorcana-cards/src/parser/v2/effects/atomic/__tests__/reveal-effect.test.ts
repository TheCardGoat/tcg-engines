/**
 * Tests for Reveal Effect Parser
 * Ensures reveal effects are parsed correctly from text.
 */

import { describe, expect, it } from "bun:test";
import type { Effect } from "../../../types";
import { revealEffectParser } from "../reveal-effect";

describe("revealEffectParser", () => {
  describe("text parsing - reveal hand", () => {
    it("parses 'reveal your hand' correctly", () => {
      const result = revealEffectParser.parse("reveal your hand");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("reveal-hand");
      expect((result as Effect & { target: string }).target).toBe("controller");
    });

    it("parses 'reveal hand' without 'your' correctly", () => {
      const result = revealEffectParser.parse("reveal hand");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("reveal-hand");
      expect((result as Effect & { target: string }).target).toBe("controller");
    });

    it("parses 'reveal opponent hand' correctly", () => {
      const result = revealEffectParser.parse("reveal opponent hand");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("reveal-hand");
      expect((result as Effect & { target: string }).target).toBe("opponent");
    });

    it("parses 'reveal opponent's hand' with apostrophe", () => {
      const result = revealEffectParser.parse("reveal opponent's hand");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("reveal-hand");
      expect((result as Effect & { target: string }).target).toBe("opponent");
    });
  });

  describe("text parsing - reveal top card", () => {
    it("parses 'reveal the top card' correctly", () => {
      const result = revealEffectParser.parse("reveal the top card");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("reveal-top-card");
      expect((result as Effect & { amount: number }).amount).toBe(1);
    });

    it("parses 'reveal the top card of your deck' correctly", () => {
      const result = revealEffectParser.parse(
        "reveal the top card of your deck",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("reveal-top-card");
      expect((result as Effect & { amount: number }).amount).toBe(1);
    });
  });

  describe("text parsing - reveal X cards", () => {
    it("parses 'reveal 2 cards' correctly", () => {
      const result = revealEffectParser.parse("reveal 2 cards");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("reveal-cards");
      expect((result as Effect & { amount: number }).amount).toBe(2);
      expect((result as Effect & { from: string }).from).toBe("top-of-deck");
    });

    it("parses 'reveal the top 3 cards' correctly", () => {
      const result = revealEffectParser.parse("reveal the top 3 cards");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("reveal-cards");
      expect((result as Effect & { amount: number }).amount).toBe(3);
      expect((result as Effect & { from: string }).from).toBe("top-of-deck");
    });

    it("parses 'reveal 1 card' with singular form", () => {
      const result = revealEffectParser.parse("reveal 1 card");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("reveal-cards");
      expect((result as Effect & { amount: number }).amount).toBe(1);
    });

    it("parses 'reveal top 5 cards' without 'the'", () => {
      const result = revealEffectParser.parse("reveal top 5 cards");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("reveal-cards");
      expect((result as Effect & { amount: number }).amount).toBe(5);
    });

    it("parses 'reveal 10 cards' with double-digit number", () => {
      const result = revealEffectParser.parse("reveal 10 cards");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("reveal-cards");
      expect((result as Effect & { amount: number }).amount).toBe(10);
    });
  });

  describe("text parsing - reveal and put in hand", () => {
    it("parses 'reveal and put it into your hand' correctly", () => {
      const result = revealEffectParser.parse(
        "reveal and put it into your hand",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("reveal-and-put-in-hand");
      expect((result as Effect & { from: string }).from).toBe("look-at");
    });

    it("parses 'reveal and put them into your hand' with plural", () => {
      const result = revealEffectParser.parse(
        "reveal and put them into your hand",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("reveal-and-put-in-hand");
    });

    it("parses 'reveal and put it into hand' without 'your'", () => {
      const result = revealEffectParser.parse("reveal and put it into hand");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("reveal-and-put-in-hand");
    });
  });

  describe("text parsing - case insensitivity", () => {
    it("parses 'REVEAL YOUR HAND' in uppercase", () => {
      const result = revealEffectParser.parse("REVEAL YOUR HAND");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("reveal-hand");
    });

    it("parses 'Reveal The Top Card' in mixed case", () => {
      const result = revealEffectParser.parse("Reveal The Top Card");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("reveal-top-card");
    });

    it("parses 'rEvEaL 3 CaRdS' in random case", () => {
      const result = revealEffectParser.parse("rEvEaL 3 CaRdS");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("reveal-cards");
    });
  });

  describe("text parsing - whitespace variations", () => {
    it("parses with single spaces", () => {
      const result = revealEffectParser.parse("reveal your hand");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("reveal-hand");
    });

    it("parses with multiple spaces", () => {
      const result = revealEffectParser.parse("reveal  your  hand");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("reveal-hand");
    });

    it("parses with tabs", () => {
      const result = revealEffectParser.parse("reveal\tyour\thand");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("reveal-hand");
    });
  });

  describe("text parsing - non-matching patterns", () => {
    it("returns null for 'draw 2 cards'", () => {
      const result = revealEffectParser.parse("draw 2 cards");

      expect(result).toBeNull();
    });

    it("returns null for 'discard a card'", () => {
      const result = revealEffectParser.parse("discard a card");

      expect(result).toBeNull();
    });

    it("returns null for 'deal 3 damage'", () => {
      const result = revealEffectParser.parse("deal 3 damage");

      expect(result).toBeNull();
    });

    it("returns null for empty string", () => {
      const result = revealEffectParser.parse("");

      expect(result).toBeNull();
    });

    it("returns null for unrelated text", () => {
      const result = revealEffectParser.parse("gain 2 lore");

      expect(result).toBeNull();
    });
  });

  describe("edge cases", () => {
    it("handles 'reveal 0 cards' edge case", () => {
      const result = revealEffectParser.parse("reveal 0 cards");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("reveal-cards");
      expect((result as Effect & { amount: number }).amount).toBe(0);
    });

    it("prioritizes reveal-and-put-in-hand over reveal-cards", () => {
      const result = revealEffectParser.parse(
        "reveal 3 cards and put them into your hand",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("reveal-and-put-in-hand");
    });

    it("prioritizes reveal-hand over other patterns", () => {
      const result = revealEffectParser.parse(
        "reveal your hand and discard a card",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("reveal-hand");
    });

    it("prioritizes reveal-top-card over reveal-cards when matching", () => {
      const result = revealEffectParser.parse(
        "reveal the top card of your deck",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("reveal-top-card");
    });
  });

  describe("CST parsing", () => {
    it("returns null for CST input with warning log", () => {
      const mockCstNode = {} as any;
      const result = revealEffectParser.parse(mockCstNode);

      expect(result).toBeNull();
    });
  });
});
