/**
 * Tests for Keyword Ability Parser
 *
 * Tests parsing of all keyword ability variants:
 * - Simple keywords (Rush, Ward, Evasive, etc.)
 * - Parameterized keywords (Challenger +N, Resist +N)
 * - Value keywords (Singer N)
 * - Shift keywords with costs
 */

import { describe, expect, it } from "bun:test";
import type { KeywordAbility } from "@tcg/lorcana-types";
import { parseKeywordAbility } from "../parsers/keyword-parser";

describe("Keyword Parser", () => {
  describe("Simple Keywords", () => {
    it("should parse Rush", () => {
      const result = parseKeywordAbility("Rush");

      expect(result.success).toBe(true);
      expect(result.ability?.ability).toEqual({
        type: "keyword",
        keyword: "Rush",
      });
    });

    it("should parse Ward", () => {
      const result = parseKeywordAbility("Ward");

      expect(result.success).toBe(true);
      expect(result.ability?.ability).toEqual({
        type: "keyword",
        keyword: "Ward",
      });
    });

    it("should parse Evasive", () => {
      const result = parseKeywordAbility("Evasive");

      expect(result.success).toBe(true);
      expect(result.ability?.ability).toEqual({
        type: "keyword",
        keyword: "Evasive",
      });
    });
  });

  describe("Challenger Keyword", () => {
    it("should parse Challenger +3", () => {
      const result = parseKeywordAbility("Challenger +3");

      expect(result.success).toBe(true);
      expect(result.ability?.ability).toEqual({
        type: "keyword",
        keyword: "Challenger",
        value: 3,
      });
    });

    it("should parse Challenger with placeholder", () => {
      const result = parseKeywordAbility("Challenger +{d}");

      expect(result.success).toBe(true);
      const ability = result.ability?.ability as KeywordAbility;
      expect(ability.keyword).toBe("Challenger");
      expect("value" in ability && ability.value).toBe(0);
    });

    it("should parse Challenger +2 while challenging", () => {
      const result = parseKeywordAbility("Challenger +2 while challenging");

      expect(result.success).toBe(true);
      const ability = result.ability?.ability as KeywordAbility;
      expect(ability.keyword).toBe("Challenger");
      expect("value" in ability && ability.value).toBe(2);
      expect("condition" in ability && ability.condition).toBeDefined();
    });
  });

  describe("Resist Keyword", () => {
    it("should parse Resist +2", () => {
      const result = parseKeywordAbility("Resist +2");

      expect(result.success).toBe(true);
      expect(result.ability?.ability).toEqual({
        type: "keyword",
        keyword: "Resist",
        value: 2,
      });
    });

    it("should parse Resist with placeholder", () => {
      const result = parseKeywordAbility("Resist +{d}");

      expect(result.success).toBe(true);
      const ability = result.ability?.ability as KeywordAbility;
      expect(ability.keyword).toBe("Resist");
      expect("value" in ability && ability.value).toBe(0);
    });
  });

  describe("Singer Keyword", () => {
    it("should parse Singer 5", () => {
      const result = parseKeywordAbility("Singer 5");

      expect(result.success).toBe(true);
      expect(result.ability?.ability).toEqual({
        type: "keyword",
        keyword: "Singer",
        value: 5,
      });
    });

    it("should parse Singer with placeholder", () => {
      const result = parseKeywordAbility("Singer {d}");

      expect(result.success).toBe(true);
      const ability = result.ability?.ability as KeywordAbility;
      expect(ability.keyword).toBe("Singer");
      expect("value" in ability && ability.value).toBe(0);
    });
  });

  describe("Shift Keyword", () => {
    it("should parse Shift 5", () => {
      const result = parseKeywordAbility("Shift 5");

      expect(result.success).toBe(true);
      const ability = result.ability?.ability as KeywordAbility;
      expect(ability.keyword).toBe("Shift");
      expect("cost" in ability && ability.cost).toEqual({ ink: 5 });
    });

    it("should parse Shift with placeholder", () => {
      const result = parseKeywordAbility("Shift {d}");

      expect(result.success).toBe(true);
      const ability = result.ability?.ability as KeywordAbility;
      expect(ability.keyword).toBe("Shift");
      expect("cost" in ability && ability.cost).toEqual({ ink: 0 });
    });

    it("should parse Puppy Shift 3", () => {
      const result = parseKeywordAbility("Puppy Shift 3");

      expect(result.success).toBe(true);
      const ability = result.ability?.ability as KeywordAbility;
      expect(ability.keyword).toBe("Shift");
      expect("cost" in ability && ability.cost).toEqual({ ink: 3 });
    });

    it("should parse Universal Shift 4", () => {
      const result = parseKeywordAbility("Universal Shift 4");

      expect(result.success).toBe(true);
      const ability = result.ability?.ability as KeywordAbility;
      expect(ability.keyword).toBe("Shift");
      expect("cost" in ability && ability.cost).toEqual({ ink: 4 });
    });
  });

  describe("Error Handling", () => {
    it("should fail on unknown keyword", () => {
      const result = parseKeywordAbility("SuperSpeed");

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should fail on malformed Challenger", () => {
      const result = parseKeywordAbility("Challenger +");

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
