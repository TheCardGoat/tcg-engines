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
      expect((result as Effect & { target: string }).target).toBe("CONTROLLER");
    });

    it("parses 'reveal hand' without 'your' correctly", () => {
      const result = revealEffectParser.parse("reveal hand");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("reveal-hand");
      expect((result as Effect & { target: string }).target).toBe("CONTROLLER");
    });

    it("returns null for 'reveal opponent hand' - pattern doesn't match", () => {
      const result = revealEffectParser.parse("reveal opponent hand");

      // Pattern /reveal\s+(?:your\s+)?hand/i only matches "reveal hand" or "reveal your hand"
      // "opponent" is not in the pattern, so it doesn't match
      expect(result).toBeNull();
    });

    it("returns null for 'reveal opponent's hand' - pattern doesn't match", () => {
      const result = revealEffectParser.parse("reveal opponent's hand");

      // Pattern /reveal\s+(?:your\s+)?hand/i only matches "reveal hand" or "reveal your hand"
      // "opponent's" is not in the pattern, so it doesn't match
      expect(result).toBeNull();
    });
  });

  describe("text parsing - reveal top card", () => {
    it("parses 'reveal the top card' correctly", () => {
      const result = revealEffectParser.parse("reveal the top card");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("reveal-top-card");
      expect((result as Effect & { target: string }).target).toBe("CONTROLLER");
    });

    it("parses 'reveal the top card of your deck' correctly", () => {
      const result = revealEffectParser.parse("reveal the top card of your deck");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("reveal-top-card");
      expect((result as Effect & { target: string }).target).toBe("CONTROLLER");
    });
  });

  describe("text parsing - reveal X cards (not yet implemented)", () => {
    it("returns null for 'reveal 2 cards' (not yet implemented)", () => {
      const result = revealEffectParser.parse("reveal 2 cards");

      // Parser doesn't currently support reveal X cards
      expect(result).toBeNull();
    });

    it("returns null for 'reveal the top 3 cards' (not yet implemented)", () => {
      const result = revealEffectParser.parse("reveal the top 3 cards");

      // Parser doesn't currently support reveal X cards
      expect(result).toBeNull();
    });

    it("returns null for 'reveal 1 card' with singular form (not yet implemented)", () => {
      const result = revealEffectParser.parse("reveal 1 card");

      // Parser doesn't currently support reveal X cards
      expect(result).toBeNull();
    });

    it("returns null for 'reveal top 5 cards' without 'the' (not yet implemented)", () => {
      const result = revealEffectParser.parse("reveal top 5 cards");

      // Parser doesn't currently support reveal X cards
      expect(result).toBeNull();
    });

    it("returns null for 'reveal 10 cards' with double-digit number (not yet implemented)", () => {
      const result = revealEffectParser.parse("reveal 10 cards");

      // Parser doesn't currently support reveal X cards
      expect(result).toBeNull();
    });
  });

  describe("text parsing - reveal and put in hand (not yet implemented)", () => {
    it("returns null for 'reveal and put it into your hand' (not yet implemented)", () => {
      const result = revealEffectParser.parse("reveal and put it into your hand");

      // Parser doesn't currently support reveal-and-put-in-hand
      expect(result).toBeNull();
    });

    it("returns null for 'reveal and put them into your hand' (not yet implemented)", () => {
      const result = revealEffectParser.parse("reveal and put them into your hand");

      // Parser doesn't currently support reveal-and-put-in-hand
      expect(result).toBeNull();
    });

    it("returns null for 'reveal and put it into hand' (not yet implemented)", () => {
      const result = revealEffectParser.parse("reveal and put it into hand");

      // Parser doesn't currently support reveal-and-put-in-hand
      expect(result).toBeNull();
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

    it("returns null for 'rEvEaL 3 CaRdS' in random case (not implemented)", () => {
      const result = revealEffectParser.parse("rEvEaL 3 CaRdS");

      // Parser doesn't currently support reveal X cards
      expect(result).toBeNull();
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
    it("returns null for 'reveal 0 cards' edge case (not implemented)", () => {
      const result = revealEffectParser.parse("reveal 0 cards");

      // Parser doesn't currently support reveal X cards
      expect(result).toBeNull();
    });

    it("returns null for 'reveal 3 cards and put them into your hand' (not implemented)", () => {
      const result = revealEffectParser.parse("reveal 3 cards and put them into your hand");

      // Parser doesn't currently support reveal-and-put-in-hand
      expect(result).toBeNull();
    });

    it("prioritizes reveal-hand over other patterns", () => {
      const result = revealEffectParser.parse("reveal your hand and discard a card");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("reveal-hand");
    });

    it("prioritizes reveal-top-card over reveal-cards when matching", () => {
      const result = revealEffectParser.parse("reveal the top card of your deck");

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
