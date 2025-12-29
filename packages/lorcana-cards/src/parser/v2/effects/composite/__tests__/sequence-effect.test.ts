/**
 * Tests for Sequence Effect Parser
 * Ensures sequence effects like "Do X, then Y, then Z" are parsed correctly.
 */

import { describe, expect, it } from "bun:test";
import type { Effect } from "../../../types";
import { sequenceEffectParser } from "../sequence-effect";

describe("sequenceEffectParser", () => {
  describe("text parsing - happy path", () => {
    it("parses two-step sequence with ', then ' separator", () => {
      const result = sequenceEffectParser.parse(
        "draw 2 cards, then discard 1 card",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("sequence");
      const effects = (result as Effect & { effects: Effect[] }).effects;
      expect(effects).toHaveLength(2);
      expect(effects[0].type).toBe("draw");
      expect(effects[1].type).toBe("discard");
    });

    it("parses three-step sequence with multiple ', then ' separators", () => {
      const result = sequenceEffectParser.parse(
        "draw 1 card, then discard 1 card, then gain 2 lore",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("sequence");
      const effects = (result as Effect & { effects: Effect[] }).effects;
      expect(effects).toHaveLength(3);
      expect(effects[0].type).toBe("draw");
      expect(effects[1].type).toBe("discard");
      expect(effects[2].type).toBe("lore");
    });

    it("parses sequence with '. Then ' separator (capital T)", () => {
      const result = sequenceEffectParser.parse(
        "draw 2 cards. Then discard 1 card",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("sequence");
      const effects = (result as Effect & { effects: Effect[] }).effects;
      expect(effects).toHaveLength(2);
      expect(effects[0].type).toBe("draw");
      expect(effects[1].type).toBe("discard");
    });

    it("parses sequence with ', and then ' separator", () => {
      const result = sequenceEffectParser.parse(
        "draw 2 cards, and then discard 1 card",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("sequence");
      const effects = (result as Effect & { effects: Effect[] }).effects;
      expect(effects).toHaveLength(2);
      expect(effects[0].type).toBe("draw");
      expect(effects[1].type).toBe("discard");
    });

    it("parses complex three-step sequence with different effects", () => {
      const result = sequenceEffectParser.parse(
        "deal 3 damage to chosen character, then draw 1 card, then exert chosen character",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("sequence");
      const effects = (result as Effect & { effects: Effect[] }).effects;
      expect(effects).toHaveLength(3);
      expect(effects[0].type).toBe("damage");
      expect(effects[1].type).toBe("draw");
      expect(effects[2].type).toBe("exert");
    });
  });

  describe("text parsing - case insensitivity", () => {
    it("parses sequence with uppercase 'THEN'", () => {
      const result = sequenceEffectParser.parse(
        "draw 2 cards, THEN discard 1 card",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("sequence");
      const effects = (result as Effect & { effects: Effect[] }).effects;
      expect(effects).toHaveLength(2);
    });

    it("parses sequence with mixed case 'ThEn'", () => {
      const result = sequenceEffectParser.parse(
        "draw 2 cards, ThEn discard 1 card",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("sequence");
    });

    it("parses sequence with '. THEN ' separator", () => {
      const result = sequenceEffectParser.parse(
        "draw 2 cards. THEN discard 1 card",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("sequence");
      const effects = (result as Effect & { effects: Effect[] }).effects;
      expect(effects).toHaveLength(2);
    });
  });

  describe("text parsing - non-matches", () => {
    it("returns null for single effect without 'then'", () => {
      const result = sequenceEffectParser.parse("draw 2 cards");

      expect(result).toBeNull();
    });

    it("returns null for text without sequence separator", () => {
      const result = sequenceEffectParser.parse(
        "draw 2 cards and discard 1 card",
      );

      expect(result).toBeNull();
    });

    it("returns null for empty string", () => {
      const result = sequenceEffectParser.parse("");

      expect(result).toBeNull();
    });

    it("returns null for text with only separator", () => {
      const result = sequenceEffectParser.parse(", then ");

      expect(result).toBeNull();
    });
  });

  describe("text parsing - partial parsing", () => {
    it("includes only successfully parsed steps", () => {
      // Second step won't parse, so should only have 1 effect
      const result = sequenceEffectParser.parse(
        "draw 2 cards, then invalid effect text",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("sequence");
      const effects = (result as Effect & { effects: Effect[] }).effects;
      expect(effects).toHaveLength(1);
      expect(effects[0].type).toBe("draw");
    });

    it("returns null when no steps can be parsed", () => {
      const result = sequenceEffectParser.parse(
        "invalid effect, then another invalid effect",
      );

      expect(result).toBeNull();
    });
  });

  describe("text parsing - whitespace handling", () => {
    it("trims whitespace from effect text after splitting", () => {
      // The separator itself must be exact, but individual effects are trimmed
      const result = sequenceEffectParser.parse(
        "  draw 2 cards  , then   discard 1 card  ",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("sequence");
      const effects = (result as Effect & { effects: Effect[] }).effects;
      expect(effects).toHaveLength(2);
      expect(effects[0].type).toBe("draw");
      expect(effects[1].type).toBe("discard");
    });

    it("handles leading and trailing whitespace", () => {
      const result = sequenceEffectParser.parse(
        "  draw 2 cards, then discard 1 card  ",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("sequence");
    });
  });

  describe("CST parsing", () => {
    it("returns null for CST node input (not yet implemented)", () => {
      const mockCstNode = { name: "test", children: {} } as any;
      const result = sequenceEffectParser.parse(mockCstNode);

      expect(result).toBeNull();
    });
  });

  describe("parser metadata", () => {
    it("has correct pattern regex", () => {
      expect(sequenceEffectParser.pattern).toBeInstanceOf(RegExp);
    });

    it("has description", () => {
      expect(sequenceEffectParser.description).toBeDefined();
      expect(typeof sequenceEffectParser.description).toBe("string");
    });
  });
});
