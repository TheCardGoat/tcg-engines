/**
 * Cost Parser Tests
 *
 * Unit tests for the cost parsing module.
 */

import { describe, expect, it } from "bun:test";
import {
  extractAndParseCost,
  isEmptyCost,
  mergeCosts,
  parseAdditionalCostText,
  parseCost,
} from "../../parsers/cost-parser";
import {
  extractCostStrings,
  hasCostTokens,
  isValidDomain,
} from "../../patterns/costs";

describe("Cost Parser", () => {
  describe("parseCost", () => {
    describe("energy-only costs", () => {
      it("should parse :rb_energy_1: -> { energy: 1 }", () => {
        const result = parseCost(":rb_energy_1:");
        expect(result).toEqual({ energy: 1 });
      });

      it("should parse :rb_energy_2: -> { energy: 2 }", () => {
        const result = parseCost(":rb_energy_2:");
        expect(result).toEqual({ energy: 2 });
      });

      it("should parse :rb_energy_3: -> { energy: 3 }", () => {
        const result = parseCost(":rb_energy_3:");
        expect(result).toEqual({ energy: 3 });
      });

      it("should parse :rb_energy_0: -> { energy: 0 }", () => {
        const result = parseCost(":rb_energy_0:");
        expect(result).toEqual({ energy: 0 });
      });
    });

    describe("power-only costs", () => {
      it("should parse :rb_rune_fury: -> { power: ['fury'] }", () => {
        const result = parseCost(":rb_rune_fury:");
        expect(result).toEqual({ power: ["fury"] });
      });

      it("should parse :rb_rune_calm: -> { power: ['calm'] }", () => {
        const result = parseCost(":rb_rune_calm:");
        expect(result).toEqual({ power: ["calm"] });
      });

      it("should parse :rb_rune_mind: -> { power: ['mind'] }", () => {
        const result = parseCost(":rb_rune_mind:");
        expect(result).toEqual({ power: ["mind"] });
      });

      it("should parse :rb_rune_body: -> { power: ['body'] }", () => {
        const result = parseCost(":rb_rune_body:");
        expect(result).toEqual({ power: ["body"] });
      });

      it("should parse :rb_rune_chaos: -> { power: ['chaos'] }", () => {
        const result = parseCost(":rb_rune_chaos:");
        expect(result).toEqual({ power: ["chaos"] });
      });

      it("should parse :rb_rune_order: -> { power: ['order'] }", () => {
        const result = parseCost(":rb_rune_order:");
        expect(result).toEqual({ power: ["order"] });
      });

      it("should parse :rb_rune_rainbow: -> { power: ['rainbow'] }", () => {
        const result = parseCost(":rb_rune_rainbow:");
        expect(result).toEqual({ power: ["rainbow"] });
      });
    });

    describe("exhaust-only costs", () => {
      it("should parse :rb_exhaust: -> { exhaust: true }", () => {
        const result = parseCost(":rb_exhaust:");
        expect(result).toEqual({ exhaust: true });
      });
    });

    describe("combined costs", () => {
      it("should parse :rb_energy_1::rb_rune_fury: -> { energy: 1, power: ['fury'] }", () => {
        const result = parseCost(":rb_energy_1::rb_rune_fury:");
        expect(result).toEqual({ energy: 1, power: ["fury"] });
      });

      it("should parse :rb_energy_2::rb_rune_mind: -> { energy: 2, power: ['mind'] }", () => {
        const result = parseCost(":rb_energy_2::rb_rune_mind:");
        expect(result).toEqual({ energy: 2, power: ["mind"] });
      });

      it("should parse :rb_energy_1:, :rb_exhaust: -> { energy: 1, exhaust: true }", () => {
        const result = parseCost(":rb_energy_1:, :rb_exhaust:");
        expect(result).toEqual({ energy: 1, exhaust: true });
      });

      it("should parse :rb_rune_rainbow:, :rb_exhaust: -> { power: ['rainbow'], exhaust: true }", () => {
        const result = parseCost(":rb_rune_rainbow:, :rb_exhaust:");
        expect(result).toEqual({ power: ["rainbow"], exhaust: true });
      });

      it("should parse :rb_energy_1::rb_rune_body:, :rb_exhaust: -> { energy: 1, power: ['body'], exhaust: true }", () => {
        const result = parseCost(":rb_energy_1::rb_rune_body:, :rb_exhaust:");
        expect(result).toEqual({ energy: 1, power: ["body"], exhaust: true });
      });
    });

    describe("multiple power costs", () => {
      it("should parse :rb_rune_body::rb_rune_body: -> { power: ['body', 'body'] }", () => {
        const result = parseCost(":rb_rune_body::rb_rune_body:");
        expect(result).toEqual({ power: ["body", "body"] });
      });

      it("should parse :rb_rune_fury::rb_rune_mind: -> { power: ['fury', 'mind'] }", () => {
        const result = parseCost(":rb_rune_fury::rb_rune_mind:");
        expect(result).toEqual({ power: ["fury", "mind"] });
      });

      it("should parse :rb_rune_rainbow::rb_rune_rainbow: -> { power: ['rainbow', 'rainbow'] }", () => {
        const result = parseCost(":rb_rune_rainbow::rb_rune_rainbow:");
        expect(result).toEqual({ power: ["rainbow", "rainbow"] });
      });
    });

    describe("empty and invalid inputs", () => {
      it("should return empty object for empty string", () => {
        const result = parseCost("");
        expect(result).toEqual({});
      });

      it("should return empty object for text without cost tokens", () => {
        const result = parseCost("Draw 1.");
        expect(result).toEqual({});
      });

      it("should return empty object for invalid cost notation", () => {
        const result = parseCost(":rb_invalid:");
        expect(result).toEqual({});
      });
    });
  });

  describe("extractAndParseCost", () => {
    it("should extract cost from ability text", () => {
      const result = extractAndParseCost(":rb_exhaust:: Draw 1.");
      expect(result).toEqual({ exhaust: true });
    });

    it("should extract combined cost from ability text", () => {
      const result = extractAndParseCost(
        ":rb_energy_1::rb_rune_fury:, :rb_exhaust:: Give me +2 :rb_might:.",
      );
      expect(result).toEqual({ energy: 1, power: ["fury"] });
    });

    it("should return null for text without cost", () => {
      const result = extractAndParseCost("Draw 1.");
      expect(result).toBeNull();
    });
  });

  describe("isEmptyCost", () => {
    it("should return true for empty object", () => {
      expect(isEmptyCost({})).toBe(true);
    });

    it("should return true for object with empty power array", () => {
      expect(isEmptyCost({ power: [] })).toBe(true);
    });

    it("should return false for object with energy", () => {
      expect(isEmptyCost({ energy: 1 })).toBe(false);
    });

    it("should return false for object with power", () => {
      expect(isEmptyCost({ power: ["fury"] })).toBe(false);
    });

    it("should return false for object with exhaust", () => {
      expect(isEmptyCost({ exhaust: true })).toBe(false);
    });
  });

  describe("parseAdditionalCostText", () => {
    it("should parse 'Recycle 2 cards'", () => {
      const result = parseAdditionalCostText("Recycle 2 cards from your trash");
      expect(result).toEqual({ recycle: 2 });
    });

    it("should parse 'Kill a friendly unit'", () => {
      const result = parseAdditionalCostText("Kill a friendly unit");
      expect(result).toEqual({
        kill: {
          type: "unit",
          controller: "friendly",
        },
      });
    });

    it("should return empty object for text without additional costs", () => {
      const result = parseAdditionalCostText("Draw 1.");
      expect(result).toEqual({});
    });
  });

  describe("mergeCosts", () => {
    it("should merge energy costs", () => {
      const result = mergeCosts({ energy: 1 }, { energy: 2 });
      expect(result).toEqual({ energy: 3 });
    });

    it("should merge power costs", () => {
      const result = mergeCosts({ power: ["fury"] }, { power: ["mind"] });
      expect(result).toEqual({ power: ["fury", "mind"] });
    });

    it("should merge exhaust into base", () => {
      const result = mergeCosts({ energy: 1 }, { exhaust: true });
      expect(result).toEqual({ energy: 1, exhaust: true });
    });

    it("should merge recycle cost", () => {
      const result = mergeCosts({ power: ["chaos"] }, { recycle: 2 });
      expect(result).toEqual({ power: ["chaos"], recycle: 2 });
    });
  });
});

describe("Cost Patterns", () => {
  describe("hasCostTokens", () => {
    it("should return true for text with energy token", () => {
      expect(hasCostTokens(":rb_energy_1:")).toBe(true);
    });

    it("should return true for text with power token", () => {
      expect(hasCostTokens(":rb_rune_fury:")).toBe(true);
    });

    it("should return true for text with exhaust token", () => {
      expect(hasCostTokens(":rb_exhaust:")).toBe(true);
    });

    it("should return false for text without cost tokens", () => {
      expect(hasCostTokens("Draw 1.")).toBe(false);
    });
  });

  describe("extractCostStrings", () => {
    it("should extract single cost string", () => {
      const result = extractCostStrings(":rb_exhaust:: Draw 1.");
      expect(result).toEqual([":rb_exhaust:"]);
    });

    it("should extract combined cost string", () => {
      const result = extractCostStrings(":rb_energy_1::rb_rune_fury:: Effect");
      expect(result).toEqual([":rb_energy_1::rb_rune_fury:"]);
    });

    it("should extract multiple separate cost strings", () => {
      const result = extractCostStrings(":rb_energy_1:, :rb_exhaust:: Draw 1.");
      expect(result).toEqual([":rb_energy_1:", ":rb_exhaust:"]);
    });

    it("should return empty array for text without costs", () => {
      const result = extractCostStrings("Draw 1.");
      expect(result).toEqual([]);
    });
  });

  describe("isValidDomain", () => {
    it("should return true for valid domains", () => {
      expect(isValidDomain("fury")).toBe(true);
      expect(isValidDomain("calm")).toBe(true);
      expect(isValidDomain("mind")).toBe(true);
      expect(isValidDomain("body")).toBe(true);
      expect(isValidDomain("chaos")).toBe(true);
      expect(isValidDomain("order")).toBe(true);
      expect(isValidDomain("rainbow")).toBe(true);
    });

    it("should return false for invalid domains", () => {
      expect(isValidDomain("invalid")).toBe(false);
      expect(isValidDomain("fire")).toBe(false);
      expect(isValidDomain("")).toBe(false);
    });
  });
});
