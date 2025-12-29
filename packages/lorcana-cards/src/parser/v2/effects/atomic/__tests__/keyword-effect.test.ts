/**
 * Tests for Keyword Effect Parser
 * Ensures keyword grant effects are parsed correctly from text and CST nodes.
 */

import { describe, expect, it } from "bun:test";
import type { Effect } from "../../../types";
import { keywordEffectParser } from "../keyword-effect";

describe("keywordEffectParser", () => {
  describe("text parsing - gains keyword (happy path)", () => {
    it("parses 'gains Evasive' correctly", () => {
      const result = keywordEffectParser.parse("gains Evasive");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("keyword");
      expect((result as Effect & { keyword: string }).keyword).toBe("Evasive");
    });

    it("parses 'gains Challenger' correctly", () => {
      const result = keywordEffectParser.parse("gains Challenger");

      expect(result).not.toBeNull();
      expect((result as Effect & { keyword: string }).keyword).toBe(
        "Challenger",
      );
    });

    it("parses 'gains Rush' correctly", () => {
      const result = keywordEffectParser.parse("gains Rush");

      expect(result).not.toBeNull();
      expect((result as Effect & { keyword: string }).keyword).toBe("Rush");
    });

    it("parses 'gains Ward' correctly", () => {
      const result = keywordEffectParser.parse("gains Ward");

      expect(result).not.toBeNull();
      expect((result as Effect & { keyword: string }).keyword).toBe("Ward");
    });

    it("parses 'gains Bodyguard' correctly", () => {
      const result = keywordEffectParser.parse("gains Bodyguard");

      expect(result).not.toBeNull();
      expect((result as Effect & { keyword: string }).keyword).toBe(
        "Bodyguard",
      );
    });

    it("parses 'gains Resist' correctly", () => {
      const result = keywordEffectParser.parse("gains Resist");

      expect(result).not.toBeNull();
      expect((result as Effect & { keyword: string }).keyword).toBe("Resist");
    });

    it("parses 'gains Support' correctly", () => {
      const result = keywordEffectParser.parse("gains Support");

      expect(result).not.toBeNull();
      expect((result as Effect & { keyword: string }).keyword).toBe("Support");
    });

    it("parses 'gains Singer' correctly", () => {
      const result = keywordEffectParser.parse("gains Singer");

      expect(result).not.toBeNull();
      expect((result as Effect & { keyword: string }).keyword).toBe("Singer");
    });

    it("parses 'gains Reckless' correctly", () => {
      const result = keywordEffectParser.parse("gains Reckless");

      expect(result).not.toBeNull();
      expect((result as Effect & { keyword: string }).keyword).toBe("Reckless");
    });

    it("parses 'gain Evasive' with singular form", () => {
      const result = keywordEffectParser.parse("gain Evasive");

      expect(result).not.toBeNull();
      expect((result as Effect & { keyword: string }).keyword).toBe("Evasive");
    });
  });

  describe("text parsing - gets keyword (happy path)", () => {
    it("parses 'gets Evasive' correctly", () => {
      const result = keywordEffectParser.parse("gets Evasive");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("keyword");
      expect((result as Effect & { keyword: string }).keyword).toBe("Evasive");
    });

    it("parses 'gets Ward' correctly", () => {
      const result = keywordEffectParser.parse("gets Ward");

      expect(result).not.toBeNull();
      expect((result as Effect & { keyword: string }).keyword).toBe("Ward");
    });

    it("parses 'get Rush' with singular form", () => {
      const result = keywordEffectParser.parse("get Rush");

      expect(result).not.toBeNull();
      expect((result as Effect & { keyword: string }).keyword).toBe("Rush");
    });
  });

  describe("text parsing - case insensitivity", () => {
    it("parses 'GAINS EVASIVE' in uppercase", () => {
      const result = keywordEffectParser.parse("GAINS EVASIVE");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("keyword");
      expect((result as Effect & { keyword: string }).keyword).toBe("EVASIVE");
    });

    it("parses 'Gains Ward' in mixed case", () => {
      const result = keywordEffectParser.parse("Gains Ward");

      expect(result).not.toBeNull();
      expect((result as Effect & { keyword: string }).keyword).toBe("Ward");
    });

    it("parses 'gEtS rUsH' in random case", () => {
      const result = keywordEffectParser.parse("gEtS rUsH");

      expect(result).not.toBeNull();
      expect((result as Effect & { keyword: string }).keyword).toBe("rUsH");
    });

    it("parses 'gains evasive' in lowercase", () => {
      const result = keywordEffectParser.parse("gains evasive");

      expect(result).not.toBeNull();
      expect((result as Effect & { keyword: string }).keyword).toBe("evasive");
    });
  });

  describe("text parsing - whitespace variations", () => {
    it("parses with single space", () => {
      const result = keywordEffectParser.parse("gains Evasive");

      expect(result).not.toBeNull();
      expect((result as Effect & { keyword: string }).keyword).toBe("Evasive");
    });

    it("parses with multiple spaces", () => {
      const result = keywordEffectParser.parse("gains  Ward");

      expect(result).not.toBeNull();
      expect((result as Effect & { keyword: string }).keyword).toBe("Ward");
    });

    it("parses with tabs", () => {
      const result = keywordEffectParser.parse("gets\tRush");

      expect(result).not.toBeNull();
      expect((result as Effect & { keyword: string }).keyword).toBe("Rush");
    });
  });

  describe("text parsing - pattern non-matches", () => {
    it("returns null for draw text", () => {
      const result = keywordEffectParser.parse("draw 2 cards");

      expect(result).toBeNull();
    });

    it("returns null for damage text", () => {
      const result = keywordEffectParser.parse("deal 2 damage");

      expect(result).toBeNull();
    });

    it("returns null for unknown keyword", () => {
      const result = keywordEffectParser.parse("gains Flying");

      expect(result).toBeNull();
    });

    it("returns null for missing keyword", () => {
      const result = keywordEffectParser.parse("gains");

      expect(result).toBeNull();
    });

    it("returns null for missing verb", () => {
      const result = keywordEffectParser.parse("Evasive");

      expect(result).toBeNull();
    });

    it("returns null for empty string", () => {
      const result = keywordEffectParser.parse("");

      expect(result).toBeNull();
    });

    it("returns null for unrelated text", () => {
      const result = keywordEffectParser.parse("gain 2 lore");

      expect(result).toBeNull();
    });

    it("returns null for 'has' instead of 'gains'", () => {
      const result = keywordEffectParser.parse("has Evasive");

      expect(result).toBeNull();
    });

    it("returns null for stat modification", () => {
      const result = keywordEffectParser.parse("gets +2 strength");

      expect(result).toBeNull();
    });
  });

  describe("text parsing - in longer text", () => {
    it("parses keyword in full ability text", () => {
      const result = keywordEffectParser.parse(
        "chosen character gains Evasive this turn",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("keyword");
      expect((result as Effect & { keyword: string }).keyword).toBe("Evasive");
    });

    it("parses keyword with target", () => {
      const result = keywordEffectParser.parse(
        "this character gets Ward until end of turn",
      );

      expect(result).not.toBeNull();
      expect((result as Effect & { keyword: string }).keyword).toBe("Ward");
    });
  });

  describe("CST parsing", () => {
    it("parses CST node with Evasive identifier", () => {
      const cstNode = {
        Identifier: [{ image: "Evasive" }],
      };

      const result = keywordEffectParser.parse(cstNode);

      expect(result).not.toBeNull();
      expect(result?.type).toBe("keyword");
      expect((result as Effect & { keyword: string }).keyword).toBe("Evasive");
    });

    it("parses CST node with Ward identifier", () => {
      const cstNode = {
        Identifier: [{ image: "Ward" }],
      };

      const result = keywordEffectParser.parse(cstNode);

      expect(result).not.toBeNull();
      expect((result as Effect & { keyword: string }).keyword).toBe("Ward");
    });

    it("parses CST node with Rush identifier", () => {
      const cstNode = {
        Identifier: [{ image: "Rush" }],
      };

      const result = keywordEffectParser.parse(cstNode);

      expect(result).not.toBeNull();
      expect((result as Effect & { keyword: string }).keyword).toBe("Rush");
    });

    it("parses CST node with Bodyguard identifier", () => {
      const cstNode = {
        Identifier: [{ image: "Bodyguard" }],
      };

      const result = keywordEffectParser.parse(cstNode);

      expect(result).not.toBeNull();
      expect((result as Effect & { keyword: string }).keyword).toBe(
        "Bodyguard",
      );
    });

    it("returns null when Identifier token is missing", () => {
      const cstNode = {
        OtherToken: [{ image: "something" }],
      };

      const result = keywordEffectParser.parse(cstNode);

      expect(result).toBeNull();
    });

    it("returns null when Identifier array is empty", () => {
      const cstNode = {
        Identifier: [],
      };

      const result = keywordEffectParser.parse(cstNode);

      expect(result).toBeNull();
    });

    it("returns null when identifier is not a known keyword", () => {
      const cstNode = {
        Identifier: [{ image: "UnknownKeyword" }],
      };

      const result = keywordEffectParser.parse(cstNode);

      expect(result).toBeNull();
    });

    it("returns null when identifier is a common word", () => {
      const cstNode = {
        Identifier: [{ image: "character" }],
      };

      const result = keywordEffectParser.parse(cstNode);

      expect(result).toBeNull();
    });
  });

  describe("parser metadata", () => {
    it("has correct pattern", () => {
      expect(keywordEffectParser.pattern).toBeDefined();
      expect(keywordEffectParser.pattern).toBeInstanceOf(RegExp);
    });

    it("has description", () => {
      expect(keywordEffectParser.description).toBeDefined();
      expect(typeof keywordEffectParser.description).toBe("string");
      expect(keywordEffectParser.description.length).toBeGreaterThan(0);
    });

    it("has parse function", () => {
      expect(keywordEffectParser.parse).toBeDefined();
      expect(typeof keywordEffectParser.parse).toBe("function");
    });
  });
});
