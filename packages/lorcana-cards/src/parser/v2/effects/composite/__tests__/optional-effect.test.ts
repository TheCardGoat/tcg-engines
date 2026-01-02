/**
 * Tests for Optional Effect Parser
 * Ensures optional effects like "You may X" are parsed correctly.
 */

import { describe, expect, it } from "bun:test";
import type { Effect } from "../../../types";
import { optionalEffectParser } from "../optional-effect";

describe("optionalEffectParser", () => {
  describe("text parsing - happy path", () => {
    it("parses 'you may draw 2 cards' correctly", () => {
      const result = optionalEffectParser.parse("you may draw 2 cards");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("optional");
      const effect = (result as Effect & { effect: Effect }).effect;
      expect(effect).toBeDefined();
      expect(effect.type).toBe("draw");
    });

    it("parses 'you may discard 1 card' correctly", () => {
      const result = optionalEffectParser.parse("you may discard 1 card");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("optional");
      const effect = (result as Effect & { effect: Effect }).effect;
      expect(effect.type).toBe("discard");
    });

    it("parses 'you may gain 2 lore' correctly", () => {
      const result = optionalEffectParser.parse("you may gain 2 lore");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("optional");
      const effect = (result as Effect & { effect: Effect }).effect;
      expect(effect.type).toBe("gain-lore");
    });

    it("parses 'you may deal 3 damage' correctly", () => {
      const result = optionalEffectParser.parse(
        "you may deal 3 damage to chosen character",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("optional");
      const effect = (result as Effect & { effect: Effect }).effect;
      expect(effect.type).toBe("deal-damage");
    });

    it("parses 'you may exert chosen character' correctly", () => {
      const result = optionalEffectParser.parse(
        "you may exert chosen character",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("optional");
      const effect = (result as Effect & { effect: Effect }).effect;
      expect(effect.type).toBe("exert");
    });
  });

  describe("text parsing - case insensitivity", () => {
    it("parses 'YOU MAY' in uppercase", () => {
      const result = optionalEffectParser.parse("YOU MAY draw 2 cards");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("optional");
      const effect = (result as Effect & { effect: Effect }).effect;
      expect(effect.type).toBe("draw");
    });

    it("parses 'YoU MaY' in mixed case", () => {
      const result = optionalEffectParser.parse("YoU MaY draw 2 cards");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("optional");
    });

    it("parses 'You May' with capital letters", () => {
      const result = optionalEffectParser.parse("You May draw 2 cards");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("optional");
    });
  });

  describe("text parsing - non-matches", () => {
    it("returns null for text without 'you may' pattern", () => {
      const result = optionalEffectParser.parse("draw 2 cards");

      expect(result).toBeNull();
    });

    it("returns null for 'may' without 'you'", () => {
      const result = optionalEffectParser.parse("may draw 2 cards");

      expect(result).toBeNull();
    });

    it("returns null for empty string", () => {
      const result = optionalEffectParser.parse("");

      expect(result).toBeNull();
    });

    it("returns null for 'you may' without effect", () => {
      const result = optionalEffectParser.parse("you may");

      expect(result).toBeNull();
    });
  });

  describe("text parsing - unparseable effects", () => {
    it("returns null when the effect cannot be parsed", () => {
      const result = optionalEffectParser.parse("you may do something invalid");

      expect(result).toBeNull();
    });

    it("returns null for 'you may' with non-effect text", () => {
      const result = optionalEffectParser.parse("you may not draw cards");

      expect(result).toBeNull();
    });
  });

  describe("text parsing - whitespace handling", () => {
    it("handles extra whitespace after 'you may'", () => {
      const result = optionalEffectParser.parse("you may    draw 2 cards");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("optional");
      const effect = (result as Effect & { effect: Effect }).effect;
      expect(effect.type).toBe("draw");
    });

    it("handles leading and trailing whitespace", () => {
      const result = optionalEffectParser.parse("  you may draw 2 cards  ");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("optional");
    });

    it("handles multiple spaces between words", () => {
      const result = optionalEffectParser.parse("you   may   draw   2   cards");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("optional");
    });
  });

  describe("text parsing - complex effects", () => {
    it("parses optional banish effect", () => {
      const result = optionalEffectParser.parse(
        "you may banish chosen character",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("optional");
      const effect = (result as Effect & { effect: Effect }).effect;
      expect(effect.type).toBe("banish");
    });

    it("parses optional effect with target clause", () => {
      const result = optionalEffectParser.parse(
        "you may deal 2 damage to each opposing character",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("optional");
      const effect = (result as Effect & { effect: Effect }).effect;
      expect(effect.type).toBe("deal-damage");
    });
  });

  describe("CST parsing", () => {
    it("returns null for CST node input (not yet implemented)", () => {
      const mockCstNode = { name: "test", children: {} } as any;
      const result = optionalEffectParser.parse(mockCstNode);

      expect(result).toBeNull();
    });
  });

  describe("parser metadata", () => {
    it("has correct pattern regex", () => {
      expect(optionalEffectParser.pattern).toBeInstanceOf(RegExp);
    });

    it("has description", () => {
      expect(optionalEffectParser.description).toBeDefined();
      expect(typeof optionalEffectParser.description).toBe("string");
    });
  });
});
