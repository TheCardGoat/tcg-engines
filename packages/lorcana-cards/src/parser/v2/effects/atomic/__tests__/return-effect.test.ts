/**
 * Tests for Return Effect Parser
 * Ensures return effects are parsed correctly from text.
 */

import { describe, expect, it } from "bun:test";
import type { Effect } from "../../../types";
import { returnEffectParser } from "../return-effect";

describe("returnEffectParser", () => {
  describe("text parsing - return to hand", () => {
    it("parses 'return to hand' correctly", () => {
      const result = returnEffectParser.parse("return to hand");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("return-to-hand");
      expect((result as Effect & { target: string }).target).toBe(
        "CHOSEN_CHARACTER",
      );
    });

    it("parses 'return to your hand' correctly", () => {
      const result = returnEffectParser.parse("return to your hand");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("return-to-hand");
    });

    it("parses 'return chosen character to hand' correctly", () => {
      const result = returnEffectParser.parse(
        "return chosen character to hand",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("return-to-hand");
      expect((result as Effect & { target: string }).target).toBe(
        "CHOSEN_CHARACTER",
      );
    });

    it("parses 'return this card to hand' correctly", () => {
      const result = returnEffectParser.parse("return this card to hand");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("return-to-hand");
      expect((result as Effect & { target: string }).target).toBe("SELF");
    });

    it("parses 'return to their hand' for opponent correctly", () => {
      const result = returnEffectParser.parse("return to their hand");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("return-to-hand");
    });
  });

  describe("text parsing - put on bottom", () => {
    it("parses 'put on bottom' correctly", () => {
      const result = returnEffectParser.parse("put on bottom");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("put-on-bottom");
      expect((result as Effect & { target: string }).target).toBe(
        "CHOSEN_CHARACTER",
      );
    });

    it("parses 'put on bottom of deck' correctly", () => {
      const result = returnEffectParser.parse("put on bottom of deck");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("put-on-bottom");
    });

    it("parses 'put this card on bottom' correctly", () => {
      const result = returnEffectParser.parse("put this card on bottom");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("put-on-bottom");
      expect((result as Effect & { target: string }).target).toBe("SELF");
    });
  });

  describe("text parsing - shuffle into deck", () => {
    it("parses 'shuffle into deck' correctly", () => {
      const result = returnEffectParser.parse("shuffle into deck");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("shuffle-into-deck");
      expect((result as Effect & { target: string }).target).toBe(
        "CHOSEN_CHARACTER",
      );
      expect((result as Effect & { intoDeck: string }).intoDeck).toBe("owner");
    });

    it("parses 'shuffle into your deck' correctly", () => {
      const result = returnEffectParser.parse("shuffle into your deck");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("shuffle-into-deck");
    });

    it("parses 'shuffle chosen character into deck' correctly", () => {
      const result = returnEffectParser.parse(
        "shuffle chosen character into deck",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("shuffle-into-deck");
      expect((result as Effect & { target: string }).target).toBe(
        "CHOSEN_CHARACTER",
      );
    });

    it("parses 'shuffle this card into deck' correctly", () => {
      const result = returnEffectParser.parse("shuffle this card into deck");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("shuffle-into-deck");
      expect((result as Effect & { target: string }).target).toBe("SELF");
    });
  });

  describe("text parsing - return from discard", () => {
    it("parses 'return a character card from your discard' correctly", () => {
      const result = returnEffectParser.parse(
        "return a character card from your discard",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("return-from-discard");
      expect((result as Effect & { cardType: string }).cardType).toBe(
        "character",
      );
      expect((result as Effect & { target: string }).target).toBe("CONTROLLER");
    });

    it("parses 'return an action card from your discard' correctly", () => {
      const result = returnEffectParser.parse(
        "return an action card from your discard",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("return-from-discard");
      expect((result as Effect & { cardType: string }).cardType).toBe("action");
    });

    it("parses 'return item card from your discard' without 'a' correctly", () => {
      const result = returnEffectParser.parse(
        "return item card from your discard",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("return-from-discard");
      expect((result as Effect & { cardType: string }).cardType).toBe("item");
    });
  });

  describe("text parsing - case insensitivity", () => {
    it("parses 'RETURN TO HAND' in uppercase", () => {
      const result = returnEffectParser.parse("RETURN TO HAND");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("return-to-hand");
    });

    it("parses 'Shuffle Into Deck' in mixed case", () => {
      const result = returnEffectParser.parse("Shuffle Into Deck");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("shuffle-into-deck");
    });

    it("parses 'ShUfFlE iNtO dEcK' in random case", () => {
      const result = returnEffectParser.parse("ShUfFlE iNtO dEcK");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("shuffle-into-deck");
    });
  });

  describe("text parsing - whitespace variations", () => {
    it("parses with single spaces", () => {
      const result = returnEffectParser.parse("return to hand");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("return-to-hand");
    });

    it("parses with multiple spaces", () => {
      const result = returnEffectParser.parse("return  to  hand");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("return-to-hand");
    });

    it("parses with tabs", () => {
      const result = returnEffectParser.parse("return\tto\thand");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("return-to-hand");
    });
  });

  describe("text parsing - non-matching patterns", () => {
    it("returns null for 'draw 2 cards'", () => {
      const result = returnEffectParser.parse("draw 2 cards");

      expect(result).toBeNull();
    });

    it("returns null for 'discard a card'", () => {
      const result = returnEffectParser.parse("discard a card");

      expect(result).toBeNull();
    });

    it("returns null for 'deal 3 damage'", () => {
      const result = returnEffectParser.parse("deal 3 damage");

      expect(result).toBeNull();
    });

    it("returns null for empty string", () => {
      const result = returnEffectParser.parse("");

      expect(result).toBeNull();
    });

    it("returns null for unrelated text", () => {
      const result = returnEffectParser.parse("gain 2 lore");

      expect(result).toBeNull();
    });
  });

  describe("edge cases", () => {
    it("prioritizes return-from-discard over return-to-hand", () => {
      const result = returnEffectParser.parse(
        "return a character card from your discard to hand",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("return-from-discard");
    });

    it("handles shuffle into deck", () => {
      const result = returnEffectParser.parse("shuffle into deck");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("shuffle-into-deck");
    });

    it("handles complex return phrases", () => {
      const result = returnEffectParser.parse(
        "return chosen character you control to hand",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("return-to-hand");
    });
  });

  describe("CST parsing", () => {
    it("returns null for CST input with warning log", () => {
      const mockCstNode = {} as any;
      const result = returnEffectParser.parse(mockCstNode);

      expect(result).toBeNull();
    });
  });
});
