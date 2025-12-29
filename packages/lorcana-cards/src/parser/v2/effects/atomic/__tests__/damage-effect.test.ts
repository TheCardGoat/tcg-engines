/**
 * Tests for Damage Effect Parser
 * Ensures damage effects are parsed correctly from text and CST nodes.
 */

import { describe, expect, it } from "bun:test";
import type { Effect } from "../../../types";
import { damageEffectParser } from "../damage-effect";

describe("damageEffectParser", () => {
  describe("text parsing - happy path", () => {
    it("parses 'deal 2 damage' correctly", () => {
      const result = damageEffectParser.parse("deal 2 damage");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("damage");
      expect((result as Effect & { amount: number }).amount).toBe(2);
    });

    it("parses 'deal 1 damage' with single point", () => {
      const result = damageEffectParser.parse("deal 1 damage");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("damage");
      expect((result as Effect & { amount: number }).amount).toBe(1);
    });

    it("parses 'deal 3 damage' with larger number", () => {
      const result = damageEffectParser.parse("deal 3 damage");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("damage");
      expect((result as Effect & { amount: number }).amount).toBe(3);
    });

    it("parses 'deal 5 damage' with medium number", () => {
      const result = damageEffectParser.parse("deal 5 damage");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("damage");
      expect((result as Effect & { amount: number }).amount).toBe(5);
    });

    it("parses damage in longer text", () => {
      const result = damageEffectParser.parse(
        "deal 2 damage to chosen character",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("damage");
      expect((result as Effect & { amount: number }).amount).toBe(2);
    });
  });

  describe("text parsing - case insensitivity", () => {
    it("parses 'DEAL 2 DAMAGE' in uppercase", () => {
      const result = damageEffectParser.parse("DEAL 2 DAMAGE");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("damage");
      expect((result as Effect & { amount: number }).amount).toBe(2);
    });

    it("parses 'Deal 2 Damage' in mixed case", () => {
      const result = damageEffectParser.parse("Deal 2 Damage");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("damage");
      expect((result as Effect & { amount: number }).amount).toBe(2);
    });

    it("parses 'dEaL 3 DaMaGe' in random case", () => {
      const result = damageEffectParser.parse("dEaL 3 DaMaGe");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("damage");
      expect((result as Effect & { amount: number }).amount).toBe(3);
    });
  });

  describe("text parsing - whitespace variations", () => {
    it("parses with single spaces", () => {
      const result = damageEffectParser.parse("deal 2 damage");

      expect(result).not.toBeNull();
      expect((result as Effect & { amount: number }).amount).toBe(2);
    });

    it("parses with multiple spaces", () => {
      const result = damageEffectParser.parse("deal  4  damage");

      expect(result).not.toBeNull();
      expect((result as Effect & { amount: number }).amount).toBe(4);
    });

    it("parses with tabs", () => {
      const result = damageEffectParser.parse("deal\t3\tdamage");

      expect(result).not.toBeNull();
      expect((result as Effect & { amount: number }).amount).toBe(3);
    });
  });

  describe("text parsing - edge cases", () => {
    it("parses deal 0 damage (edge case)", () => {
      const result = damageEffectParser.parse("deal 0 damage");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("damage");
      expect((result as Effect & { amount: number }).amount).toBe(0);
    });

    it("parses large damage values", () => {
      const result = damageEffectParser.parse("deal 99 damage");

      expect(result).not.toBeNull();
      expect((result as Effect & { amount: number }).amount).toBe(99);
    });

    it("parses double-digit damage", () => {
      const result = damageEffectParser.parse("deal 10 damage");

      expect(result).not.toBeNull();
      expect((result as Effect & { amount: number }).amount).toBe(10);
    });
  });

  describe("text parsing - pattern non-matches", () => {
    it("returns null for draw text", () => {
      const result = damageEffectParser.parse("draw 2 cards");

      expect(result).toBeNull();
    });

    it("returns null for discard text", () => {
      const result = damageEffectParser.parse("discard 2 cards");

      expect(result).toBeNull();
    });

    it("returns null for missing number", () => {
      const result = damageEffectParser.parse("deal damage");

      expect(result).toBeNull();
    });

    it("returns null for missing 'damage' keyword", () => {
      const result = damageEffectParser.parse("deal 2");

      expect(result).toBeNull();
    });

    it("returns null for lore text", () => {
      const result = damageEffectParser.parse("gain 2 lore");

      expect(result).toBeNull();
    });

    it("returns null for empty string", () => {
      const result = damageEffectParser.parse("");

      expect(result).toBeNull();
    });

    it("returns null for unrelated text", () => {
      const result = damageEffectParser.parse("banish chosen character");

      expect(result).toBeNull();
    });

    it("returns null for 'take damage' (not 'deal')", () => {
      const result = damageEffectParser.parse("take 2 damage");

      expect(result).toBeNull();
    });
  });

  describe("CST parsing", () => {
    it("parses CST node with Number token", () => {
      const cstNode = {
        Number: [{ image: "2" }],
      };

      const result = damageEffectParser.parse(cstNode);

      expect(result).not.toBeNull();
      expect(result?.type).toBe("damage");
      expect((result as Effect & { amount: number }).amount).toBe(2);
    });

    it("parses CST node with single damage", () => {
      const cstNode = {
        Number: [{ image: "1" }],
      };

      const result = damageEffectParser.parse(cstNode);

      expect(result).not.toBeNull();
      expect((result as Effect & { amount: number }).amount).toBe(1);
    });

    it("parses CST node with large damage", () => {
      const cstNode = {
        Number: [{ image: "8" }],
      };

      const result = damageEffectParser.parse(cstNode);

      expect(result).not.toBeNull();
      expect((result as Effect & { amount: number }).amount).toBe(8);
    });

    it("returns null when Number token is missing", () => {
      const cstNode = {
        OtherToken: [{ image: "something" }],
      };

      const result = damageEffectParser.parse(cstNode);

      expect(result).toBeNull();
    });

    it("returns null when Number array is empty", () => {
      const cstNode = {
        Number: [],
      };

      const result = damageEffectParser.parse(cstNode);

      expect(result).toBeNull();
    });

    it("returns null when number is not parseable", () => {
      const cstNode = {
        Number: [{ image: "invalid" }],
      };

      const result = damageEffectParser.parse(cstNode);

      expect(result).toBeNull();
    });
  });

  describe("parser metadata", () => {
    it("has correct pattern", () => {
      expect(damageEffectParser.pattern).toBeDefined();
      expect(damageEffectParser.pattern).toBeInstanceOf(RegExp);
    });

    it("has description", () => {
      expect(damageEffectParser.description).toBeDefined();
      expect(typeof damageEffectParser.description).toBe("string");
      expect(damageEffectParser.description.length).toBeGreaterThan(0);
    });

    it("has parse function", () => {
      expect(damageEffectParser.parse).toBeDefined();
      expect(typeof damageEffectParser.parse).toBe("function");
    });
  });
});
