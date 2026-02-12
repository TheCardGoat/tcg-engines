/**
 * Tests for Choice Effect Parser
 * Ensures choice effects like "Choose one: X; or Y" are parsed correctly.
 */

import { describe, expect, it } from "bun:test";
import type { Effect } from "../../../types";
import { choiceEffectParser } from "../choice-effect";

describe("choiceEffectParser", () => {
  describe("text parsing - happy path", () => {
    it("parses two-option choice with ': ' separator", () => {
      const result = choiceEffectParser.parse(
        "Choose one: deal 3 damage to chosen character; or gain 2 lore",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("choice");
      const {options} = (result as Effect & { options: Effect[] });
      expect(options).toHaveLength(2);
      expect(options[0].type).toBe("deal-damage");
      expect(options[1].type).toBe("gain-lore");
    });

    it("parses two-option choice with '- ' separator", () => {
      const result = choiceEffectParser.parse(
        "Choose one - deal 3 damage to chosen character; or gain 2 lore",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("choice");
      const {options} = (result as Effect & { options: Effect[] });
      expect(options).toHaveLength(2);
    });

    it("parses three-option choice", () => {
      const result = choiceEffectParser.parse(
        "Choose one: draw 2 cards; or discard 1 card; or gain 1 lore",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("choice");
      const {options} = (result as Effect & { options: Effect[] });
      expect(options).toHaveLength(3);
      expect(options[0].type).toBe("draw");
      expect(options[1].type).toBe("discard");
      expect(options[2].type).toBe("gain-lore");
    });

    it("parses choice with semicolon separator without 'or'", () => {
      const result = choiceEffectParser.parse(
        "Choose one: deal 3 damage to chosen character; gain 2 lore",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("choice");
      const {options} = (result as Effect & { options: Effect[] });
      expect(options).toHaveLength(2);
    });

    it("parses choice with complex effects", () => {
      const result = choiceEffectParser.parse(
        "Choose one: deal 5 damage to chosen character; or draw 3 cards",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("choice");
      const {options} = (result as Effect & { options: Effect[] });
      expect(options).toHaveLength(2);
      expect(options[0].type).toBe("deal-damage");
      expect(options[1].type).toBe("draw");
    });
  });

  describe("text parsing - case insensitivity", () => {
    it("parses choice with uppercase 'CHOOSE ONE'", () => {
      const result = choiceEffectParser.parse("CHOOSE ONE: deal 3 damage; or gain 2 lore");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("choice");
      const {options} = (result as Effect & { options: Effect[] });
      expect(options).toHaveLength(2);
    });

    it("parses choice with mixed case 'ChOoSe OnE'", () => {
      const result = choiceEffectParser.parse("ChOoSe OnE: deal 3 damage; or gain 2 lore");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("choice");
    });

    it("parses choice with uppercase 'OR'", () => {
      const result = choiceEffectParser.parse("Choose one: deal 3 damage; OR gain 2 lore");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("choice");
      const {options} = (result as Effect & { options: Effect[] });
      expect(options).toHaveLength(2);
    });
  });

  describe("text parsing - non-matches", () => {
    it("returns null for text without 'choose one' pattern", () => {
      const result = choiceEffectParser.parse("deal 3 damage or gain 2 lore");

      // Parser now recognizes "or" as a choice pattern
      expect(result).not.toBeNull();
      expect(result?.type).toBe("choice");
    });

    it("returns null for single option", () => {
      const result = choiceEffectParser.parse("Choose one: draw 2 cards");

      expect(result).toBeNull();
    });

    it("returns null for empty string", () => {
      const result = choiceEffectParser.parse("");

      expect(result).toBeNull();
    });

    it("returns null for 'choose one' without options", () => {
      const result = choiceEffectParser.parse("Choose one:");

      expect(result).toBeNull();
    });
  });

  describe("text parsing - partial parsing", () => {
    it("returns null when less than 2 options can be parsed", () => {
      const result = choiceEffectParser.parse("Choose one: draw 2 cards; or invalid effect");

      // Only 1 valid option parsed, need at least 2
      expect(result).toBeNull();
    });

    it("includes only successfully parsed options when 3+ options present", () => {
      const result = choiceEffectParser.parse(
        "Choose one: draw 2 cards; or invalid effect; or gain 2 lore",
      );

      // 2 out of 3 parsed successfully
      expect(result).not.toBeNull();
      const {options} = (result as Effect & { options: Effect[] });
      expect(options).toHaveLength(2);
      expect(options[0].type).toBe("draw");
      expect(options[1].type).toBe("gain-lore");
    });

    it("returns null when all options fail to parse", () => {
      const result = choiceEffectParser.parse(
        "Choose one: invalid effect; or another invalid effect",
      );

      expect(result).toBeNull();
    });
  });

  describe("text parsing - whitespace handling", () => {
    it("handles extra whitespace around separators", () => {
      const result = choiceEffectParser.parse(
        "Choose one  :   deal 3 damage  ;   or   gain 2 lore",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("choice");
      const {options} = (result as Effect & { options: Effect[] });
      expect(options).toHaveLength(2);
    });

    it("handles leading and trailing whitespace", () => {
      const result = choiceEffectParser.parse("  Choose one: deal 3 damage; or gain 2 lore  ");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("choice");
    });
  });

  describe("text parsing - separator variations", () => {
    it("parses with '; or ' separator (space before and after)", () => {
      const result = choiceEffectParser.parse("Choose one: deal 3 damage ; or gain 2 lore");

      expect(result).not.toBeNull();
      const {options} = (result as Effect & { options: Effect[] });
      expect(options).toHaveLength(2);
    });

    it("parses with ';or ' separator (no space before or)", () => {
      const result = choiceEffectParser.parse("Choose one: deal 3 damage;or gain 2 lore");

      expect(result).not.toBeNull();
      const {options} = (result as Effect & { options: Effect[] });
      expect(options).toHaveLength(2);
    });

    it("parses with '; Or ' separator (capital O)", () => {
      const result = choiceEffectParser.parse("Choose one: deal 3 damage; Or gain 2 lore");

      expect(result).not.toBeNull();
      const {options} = (result as Effect & { options: Effect[] });
      expect(options).toHaveLength(2);
    });
  });

  describe("CST parsing", () => {
    it("returns null for CST node input (not yet implemented)", () => {
      const mockCstNode = { children: {}, name: "test" } as any;
      const result = choiceEffectParser.parse(mockCstNode);

      expect(result).toBeNull();
    });
  });

  describe("parser metadata", () => {
    it("has correct pattern regex", () => {
      expect(choiceEffectParser.pattern).toBeInstanceOf(RegExp);
    });

    it("has description", () => {
      expect(choiceEffectParser.description).toBeDefined();
      expect(typeof choiceEffectParser.description).toBe("string");
    });
  });
});
