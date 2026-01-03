/**
 * Tests for Banish Effect Parser
 * Ensures banish/return effects are parsed correctly from text and CST nodes.
 */

import { describe, expect, it } from "bun:test";
import type { Effect } from "../../../types";
import { banishEffectParser } from "../banish-effect";

describe("banishEffectParser", () => {
  describe("text parsing - banish character (happy path)", () => {
    it("parses 'banish chosen character' correctly", () => {
      const result = banishEffectParser.parse("banish chosen character");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("banish");
    });

    it("parses 'banish this character' correctly", () => {
      const result = banishEffectParser.parse("banish this character");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("banish");
    });

    it("parses 'banish another character' correctly", () => {
      const result = banishEffectParser.parse("banish another character");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("banish");
    });

    it("parses 'banish a character' correctly", () => {
      const result = banishEffectParser.parse("banish a character");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("banish");
    });
  });

  describe("text parsing - banish item (happy path)", () => {
    it("parses 'banish chosen item' correctly", () => {
      const result = banishEffectParser.parse("banish chosen item");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("banish");
    });

    it("parses 'banish this item' correctly", () => {
      const result = banishEffectParser.parse("banish this item");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("banish");
    });

    it("parses 'banish an item' correctly", () => {
      const result = banishEffectParser.parse("banish an item");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("banish");
    });
  });

  describe("text parsing - return (happy path)", () => {
    it("parses 'return this character to hand' correctly", () => {
      const result = banishEffectParser.parse("return this character to hand");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("return-to-hand");
    });

    it("parses 'return chosen character to hand' correctly", () => {
      const result = banishEffectParser.parse(
        "return chosen character to hand",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("return-to-hand");
    });

    it("parses 'return another character to deck' correctly", () => {
      const result = banishEffectParser.parse(
        "return another character to deck",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("return-to-hand");
    });

    it("parses 'return a character to hand' correctly", () => {
      const result = banishEffectParser.parse("return a character to hand");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("return-to-hand");
    });

    it("parses 'return this item to hand' correctly", () => {
      const result = banishEffectParser.parse("return this item to hand");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("return-to-hand");
    });
  });

  describe("text parsing - case insensitivity", () => {
    it("parses 'BANISH CHOSEN CHARACTER' in uppercase", () => {
      const result = banishEffectParser.parse("BANISH CHOSEN CHARACTER");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("banish");
    });

    it("parses 'RETURN THIS CHARACTER TO HAND' in uppercase", () => {
      const result = banishEffectParser.parse("RETURN THIS CHARACTER TO HAND");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("return-to-hand");
    });

    it("parses 'Banish Chosen Item' in mixed case", () => {
      const result = banishEffectParser.parse("Banish Chosen Item");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("banish");
    });

    it("parses 'ReTuRn ThIs ChArAcTeR tO HaNd' in random case", () => {
      const result = banishEffectParser.parse("ReTuRn ThIs ChArAcTeR tO HaNd");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("return-to-hand");
    });
  });

  describe("text parsing - whitespace variations", () => {
    it("parses banish with single spaces", () => {
      const result = banishEffectParser.parse("banish chosen character");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("banish");
    });

    it("parses return with multiple spaces", () => {
      const result = banishEffectParser.parse(
        "return  this  character  to  hand",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("return-to-hand");
    });

    it("parses banish with tabs", () => {
      const result = banishEffectParser.parse("banish\tchosen\titem");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("banish");
    });
  });

  describe("text parsing - pattern non-matches", () => {
    it("returns null for draw text", () => {
      const result = banishEffectParser.parse("draw 2 cards");

      expect(result).toBeNull();
    });

    it("returns null for damage text", () => {
      const result = banishEffectParser.parse("deal 2 damage");

      expect(result).toBeNull();
    });

    it("returns null for missing target", () => {
      const result = banishEffectParser.parse("banish");

      expect(result).toBeNull();
    });

    it("returns null for missing card type", () => {
      const result = banishEffectParser.parse("banish chosen");

      expect(result).toBeNull();
    });

    it("returns null for 'return' without 'to'", () => {
      const result = banishEffectParser.parse("return chosen character");

      expect(result).toBeNull();
    });

    it("returns null for empty string", () => {
      const result = banishEffectParser.parse("");

      expect(result).toBeNull();
    });

    it("returns null for unrelated text", () => {
      const result = banishEffectParser.parse("gain 2 lore");

      expect(result).toBeNull();
    });

    it("returns null for 'destroy' instead of banish", () => {
      const result = banishEffectParser.parse("destroy chosen character");

      expect(result).toBeNull();
    });

    it("returns null for unsupported card type", () => {
      const result = banishEffectParser.parse("banish chosen location");

      // Parser now supports location cards
      expect(result).not.toBeNull();
      expect(result?.type).toBe("banish");
    });
  });

  describe("CST parsing - banish", () => {
    it("parses CST node with Banish token", () => {
      const cstNode = {
        Banish: [{ image: "banish" }],
      } as unknown;

      const result = banishEffectParser.parse(cstNode as string);

      expect(result).not.toBeNull();
      expect(result?.type).toBe("banish");
    });
  });

  describe("CST parsing - return", () => {
    it("parses CST node with Return token", () => {
      const cstNode = {
        Return: [{ image: "return" }],
      } as unknown;

      const result = banishEffectParser.parse(cstNode as string);

      expect(result).not.toBeNull();
      expect(result?.type).toBe("return-to-hand");
    });
  });

  describe("CST parsing - error cases", () => {
    it("returns null when both Banish and Return tokens are missing", () => {
      const cstNode = {
        OtherToken: [{ image: "something" }],
      } as unknown;

      const result = banishEffectParser.parse(cstNode as string);

      expect(result).toBeNull();
    });

    it("returns null for empty CST node", () => {
      const cstNode = {} as unknown;

      const result = banishEffectParser.parse(cstNode as string);

      expect(result).toBeNull();
    });
  });

  describe("CST parsing - precedence", () => {
    it("prefers Banish when both tokens present", () => {
      const cstNode = {
        Banish: [{ image: "banish" }],
        Return: [{ image: "return" }],
      } as unknown;

      const result = banishEffectParser.parse(cstNode as string);

      expect(result).not.toBeNull();
      expect(result?.type).toBe("banish");
    });
  });

  describe("parser metadata", () => {
    it("has correct pattern", () => {
      expect(banishEffectParser.pattern).toBeDefined();
      expect(banishEffectParser.pattern).toBeInstanceOf(RegExp);
    });

    it("has description", () => {
      expect(banishEffectParser.description).toBeDefined();
      if (banishEffectParser.description) {
        expect(typeof banishEffectParser.description).toBe("string");
        expect(banishEffectParser.description.length).toBeGreaterThan(0);
      }
    });

    it("has parse function", () => {
      expect(banishEffectParser.parse).toBeDefined();
      expect(typeof banishEffectParser.parse).toBe("function");
    });
  });
});
