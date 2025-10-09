/**
 * Tests for Text Parser
 */

import { describe, expect, it } from "bun:test";
import { cleanCardText, extractKeywords, parseCardText } from "../text-parser";

describe("Text Parser", () => {
  describe("cleanCardText", () => {
    it("should decode HTML entities", () => {
      const text = "&lt;Repair 2&gt; &amp; &lt;Blocker&gt;";
      const cleaned = cleanCardText(text);
      expect(cleaned).toBe("<Repair 2> & <Blocker>");
    });

    it("should replace br tags with newlines", () => {
      const text = "Effect 1<br>Effect 2<br>Effect 3";
      const cleaned = cleanCardText(text);
      expect(cleaned).toBe("Effect 1\n\nEffect 2\n\nEffect 3");
    });

    it("should normalize whitespace", () => {
      const text = "Multiple    spaces   and\n\n  newlines";
      const cleaned = cleanCardText(text);
      expect(cleaned).toBe("Multiple spaces and newlines");
    });
  });

  describe("extractKeywords", () => {
    it("should extract Repair keyword with value", () => {
      const text = "<Repair 2>";
      const keywords = extractKeywords(text);
      expect(keywords).toHaveLength(1);
      expect(keywords[0]).toEqual({ keyword: "Repair", value: 2 });
    });

    it("should extract Blocker keyword without value", () => {
      const text = "<Blocker>";
      const keywords = extractKeywords(text);
      expect(keywords).toHaveLength(1);
      expect(keywords[0]).toEqual({ keyword: "Blocker", value: undefined });
    });

    it("should extract multiple keywords", () => {
      const text = "<Repair 2> <Blocker> <First-Strike>";
      const keywords = extractKeywords(text);
      expect(keywords).toHaveLength(3);
      expect(keywords[0].keyword).toBe("Repair");
      expect(keywords[1].keyword).toBe("Blocker");
      expect(keywords[2].keyword).toBe("First-Strike");
    });
  });

  describe("parseCardText", () => {
    it("should parse deploy trigger ability", () => {
      const text = "【Deploy】Draw 1 card.";
      const result = parseCardText(text);

      expect(result.abilities).toHaveLength(1);
      expect(result.abilities[0].trigger).toBe("ON_DEPLOY");
      expect(result.abilities[0].effect.type).toBe("DRAW");
      expect(result.abilities[0].effect.amount).toBe(1);
    });

    it("should parse damage effect", () => {
      const text = "【Attack】Deal 2 damage to target enemy Unit.";
      const result = parseCardText(text);

      expect(result.abilities).toHaveLength(1);
      expect(result.abilities[0].trigger).toBe("ON_ATTACK");
      expect(result.abilities[0].effect.type).toBe("DAMAGE");
      expect(result.abilities[0].effect.amount).toBe(2);
    });

    it("should parse search deck effect", () => {
      const text =
        '【Deploy】Search your deck for a Pilot card named "Amuro Ray".';
      const result = parseCardText(text);

      expect(result.abilities).toHaveLength(1);
      expect(result.abilities[0].trigger).toBe("ON_DEPLOY");
      expect(result.abilities[0].effect.type).toBe("SEARCH_DECK");
    });

    it("should parse activated ability with cost", () => {
      const text = "【Activate･Main】[Rest this Unit] Deal 2 damage.";
      const result = parseCardText(text);

      expect(result.abilities).toHaveLength(1);
      expect(result.abilities[0].activated).toBeDefined();
      expect(result.abilities[0].activated?.timing).toBe("MAIN");
      expect(result.abilities[0].activated?.cost).toBe("Rest this Unit");
    });

    it("should parse multiple abilities", () => {
      const text = "<Repair 2> <Blocker> 【Deploy】Draw 1 card.";
      const result = parseCardText(text);

      expect(result.keywords).toHaveLength(2);
      expect(result.abilities).toHaveLength(1);
    });

    it("should handle complex text with multiple triggers", () => {
      const text = "【Deploy】Draw 1 card. 【Attack】Deal 2 damage.";
      const result = parseCardText(text);

      expect(result.abilities).toHaveLength(2);
      expect(result.abilities[0].trigger).toBe("ON_DEPLOY");
      expect(result.abilities[1].trigger).toBe("ON_ATTACK");
    });
  });
});
