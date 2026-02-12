/**
 * Tests for VisitorConditional Effect Parser
 * Ensures conditional effects like "if X, then Y" are parsed correctly.
 */

import { describe, expect, it } from "bun:test";
import type { Effect } from "../../../types";
import type { VisitorCondition } from "../../../visitors/condition-visitor";
import { conditionalEffectParser } from "../conditional-effect";

describe("conditionalEffectParser", () => {
  describe("text parsing - happy path", () => {
    it("parses 'if X, then Y' pattern correctly", () => {
      const result = conditionalEffectParser.parse(
        "if you have another character, then gain 2 lore",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("conditional");
      const { condition } = result as Effect & { condition: VisitorCondition };
      const thenEffect = (result as Effect & { then: Effect }).then;
      expect(condition.type).toBe("if");
      expect(condition.expression).toBe("you have another character");
      expect(thenEffect.type).toBe("gain-lore");
    });

    it("parses 'if X, Y' pattern without 'then'", () => {
      const result = conditionalEffectParser.parse("if you have another character, gain 2 lore");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("conditional");
      const { condition } = result as Effect & { condition: VisitorCondition };
      const thenEffect = (result as Effect & { then: Effect }).then;
      expect(condition.type).toBe("if");
      expect(condition.expression).toBe("you have another character");
      expect(thenEffect.type).toBe("gain-lore");
    });

    it("parses conditional with draw effect", () => {
      const result = conditionalEffectParser.parse(
        "if you control 3 or more characters, draw 2 cards",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("conditional");
      const { condition } = result as Effect & { condition: VisitorCondition };
      const thenEffect = (result as Effect & { then: Effect }).then;
      expect(condition.type).toBe("if");
      expect(condition.expression).toBe("you control 3 or more characters");
      expect(thenEffect.type).toBe("draw");
    });

    it("parses conditional with damage effect", () => {
      const result = conditionalEffectParser.parse(
        "if this character is exerted, deal 3 damage to chosen character",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("conditional");
      const { condition } = result as Effect & { condition: VisitorCondition };
      const thenEffect = (result as Effect & { then: Effect }).then;
      expect(condition.type).toBe("if");
      expect(condition.expression).toBe("this character is exerted");
      expect(thenEffect.type).toBe("deal-damage");
    });

    it("parses conditional with discard effect", () => {
      const result = conditionalEffectParser.parse(
        "if your hand has 5 or more cards, discard 2 cards",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("conditional");
      const { condition } = result as Effect & { condition: VisitorCondition };
      const thenEffect = (result as Effect & { then: Effect }).then;
      expect(condition.type).toBe("if");
      expect(condition.expression).toBe("your hand has 5 or more cards");
      expect(thenEffect.type).toBe("discard");
    });
  });

  describe("text parsing - case insensitivity", () => {
    it("parses 'IF' in uppercase", () => {
      const result = conditionalEffectParser.parse("IF you have another character, gain 2 lore");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("conditional");
      const thenEffect = (result as Effect & { then: Effect }).then;
      expect(thenEffect.type).toBe("gain-lore");
    });

    it("parses 'If' with capital letter", () => {
      const result = conditionalEffectParser.parse("If you have another character, gain 2 lore");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("conditional");
    });

    it("parses 'THEN' in uppercase", () => {
      const result = conditionalEffectParser.parse(
        "if you have another character, THEN gain 2 lore",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("conditional");
      const thenEffect = (result as Effect & { then: Effect }).then;
      expect(thenEffect.type).toBe("gain-lore");
    });

    it("parses mixed case 'iF' and 'ThEn'", () => {
      const result = conditionalEffectParser.parse(
        "iF you have another character, ThEn gain 2 lore",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("conditional");
    });
  });

  describe("text parsing - non-matches", () => {
    it("returns null for text without 'if' pattern", () => {
      const result = conditionalEffectParser.parse("gain 2 lore when you have another character");

      expect(result).toBeNull();
    });

    it("returns null for 'if' without comma", () => {
      const result = conditionalEffectParser.parse("if you have another character gain 2 lore");

      expect(result).toBeNull();
    });

    it("returns null for empty string", () => {
      const result = conditionalEffectParser.parse("");

      expect(result).toBeNull();
    });

    it("returns null for 'if' without condition", () => {
      const result = conditionalEffectParser.parse("if, gain 2 lore");

      expect(result).toBeNull();
    });

    it("returns null for 'if' without effect", () => {
      const result = conditionalEffectParser.parse("if you have another character,");

      expect(result).toBeNull();
    });
  });

  describe("text parsing - unparseable effects", () => {
    it("returns null when the effect cannot be parsed", () => {
      const result = conditionalEffectParser.parse(
        "if you have another character, do something invalid",
      );

      expect(result).toBeNull();
    });

    it("returns null when effect part is empty after 'then'", () => {
      const result = conditionalEffectParser.parse("if you have another character, then ");

      expect(result).toBeNull();
    });
  });

  describe("text parsing - whitespace handling", () => {
    it("handles extra whitespace around comma", () => {
      const result = conditionalEffectParser.parse(
        "if you have another character   ,   gain 2 lore",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("conditional");
      const thenEffect = (result as Effect & { then: Effect }).then;
      expect(thenEffect.type).toBe("gain-lore");
    });

    it("handles leading and trailing whitespace", () => {
      const result = conditionalEffectParser.parse(
        "  if you have another character, gain 2 lore  ",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("conditional");
    });

    it("handles multiple spaces in condition", () => {
      const result = conditionalEffectParser.parse(
        "if   you   have   another   character, gain 2 lore",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("conditional");
      const { condition } = result as Effect & { condition: VisitorCondition };
      expect(condition.expression).toContain("you");
      expect(condition.expression).toContain("have");
    });

    it("handles extra whitespace around 'then'", () => {
      const result = conditionalEffectParser.parse(
        "if you have another character,   then   gain 2 lore",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("conditional");
      const thenEffect = (result as Effect & { then: Effect }).then;
      expect(thenEffect.type).toBe("gain-lore");
    });
  });

  describe("text parsing - condition variations", () => {
    it("preserves simple condition text", () => {
      const result = conditionalEffectParser.parse("if you have another character, gain 2 lore");

      const { condition } = result as Effect & { condition: VisitorCondition };
      expect(condition.type).toBe("if");
      expect(condition.expression).toBe("you have another character");
    });

    it("preserves complex condition with numbers", () => {
      const result = conditionalEffectParser.parse(
        "if you control 3 or more characters, gain 2 lore",
      );

      const { condition } = result as Effect & { condition: VisitorCondition };
      expect(condition.type).toBe("if");
      expect(condition.expression).toBe("you control 3 or more characters");
    });

    it("preserves condition with multiple clauses", () => {
      const result = conditionalEffectParser.parse(
        "if you have another character in play and 5 or more cards in hand, gain 2 lore",
      );

      const { condition } = result as Effect & { condition: VisitorCondition };
      expect(condition.type).toBe("if");
      expect(condition.expression).toContain("another character in play");
      expect(condition.expression).toContain("5 or more cards in hand");
    });
  });

  describe("text parsing - different effects", () => {
    it("parses conditional with exert effect", () => {
      const result = conditionalEffectParser.parse(
        "if you have another character, exert chosen character",
      );

      expect(result).not.toBeNull();
      const thenEffect = (result as Effect & { then: Effect }).then;
      expect(thenEffect.type).toBe("exert");
    });

    it("parses conditional with banish effect", () => {
      const result = conditionalEffectParser.parse(
        "if you have another character, banish chosen character",
      );

      expect(result).not.toBeNull();
      const thenEffect = (result as Effect & { then: Effect }).then;
      expect(thenEffect.type).toBe("banish");
    });

    it("parses conditional with lore effect", () => {
      const result = conditionalEffectParser.parse("if you have another character, gain 3 lore");

      expect(result).not.toBeNull();
      const thenEffect = (result as Effect & { then: Effect }).then;
      expect(thenEffect.type).toBe("gain-lore");
    });
  });

  describe("CST parsing", () => {
    it("returns null for CST node input (not yet implemented)", () => {
      const mockCstNode = { children: {}, name: "test" } as any;
      const result = conditionalEffectParser.parse(mockCstNode);

      expect(result).toBeNull();
    });
  });

  describe("parser metadata", () => {
    it("has correct pattern regex", () => {
      expect(conditionalEffectParser.pattern).toBeInstanceOf(RegExp);
    });

    it("has description", () => {
      expect(conditionalEffectParser.description).toBeDefined();
      expect(typeof conditionalEffectParser.description).toBe("string");
    });
  });
});
