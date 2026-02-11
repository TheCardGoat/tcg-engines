/**
 * Tests for Exert Effect Parser
 * Ensures exert/ready effects are parsed correctly from text and CST nodes.
 */

import { describe, expect, it } from "bun:test";
import type { CstNode } from "chevrotain";
import type { Effect } from "../../../types";
import { exertEffectParser } from "../exert-effect";

describe("exertEffectParser", () => {
  describe("text parsing - exert (happy path)", () => {
    it("parses 'exert chosen character' correctly", () => {
      const result = exertEffectParser.parse("exert chosen character");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("exert");
    });

    it("parses 'exert this character' correctly", () => {
      const result = exertEffectParser.parse("exert this character");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("exert");
    });

    it("parses 'exert another character' correctly", () => {
      const result = exertEffectParser.parse("exert another character");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("exert");
    });

    it("parses 'exert a character' correctly", () => {
      const result = exertEffectParser.parse("exert a character");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("exert");
    });

    it("parses 'exert an character' correctly", () => {
      const result = exertEffectParser.parse("exert an character");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("exert");
    });
  });

  describe("text parsing - ready (happy path)", () => {
    it("parses 'ready this character' correctly", () => {
      const result = exertEffectParser.parse("ready this character");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("ready");
    });

    it("parses 'ready chosen character' correctly", () => {
      const result = exertEffectParser.parse("ready chosen character");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("ready");
    });

    it("parses 'ready another character' correctly", () => {
      const result = exertEffectParser.parse("ready another character");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("ready");
    });

    it("parses 'ready a character' correctly", () => {
      const result = exertEffectParser.parse("ready a character");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("ready");
    });
  });

  describe("text parsing - case insensitivity", () => {
    it("parses 'EXERT CHOSEN CHARACTER' in uppercase", () => {
      const result = exertEffectParser.parse("EXERT CHOSEN CHARACTER");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("exert");
    });

    it("parses 'READY THIS CHARACTER' in uppercase", () => {
      const result = exertEffectParser.parse("READY THIS CHARACTER");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("ready");
    });

    it("parses 'Exert Chosen Character' in mixed case", () => {
      const result = exertEffectParser.parse("Exert Chosen Character");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("exert");
    });

    it("parses 'ReAdY tHiS cHaRaCtEr' in random case", () => {
      const result = exertEffectParser.parse("ReAdY tHiS cHaRaCtEr");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("ready");
    });
  });

  describe("text parsing - whitespace variations", () => {
    it("parses exert with single spaces", () => {
      const result = exertEffectParser.parse("exert chosen character");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("exert");
    });

    it("parses ready with multiple spaces", () => {
      const result = exertEffectParser.parse("ready  this  character");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("ready");
    });

    it("parses exert with tabs", () => {
      const result = exertEffectParser.parse("exert\tchosen\tcharacter");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("exert");
    });
  });

  describe("text parsing - pattern non-matches", () => {
    it("returns null for draw text", () => {
      const result = exertEffectParser.parse("draw 2 cards");

      expect(result).toBeNull();
    });

    it("returns null for damage text", () => {
      const result = exertEffectParser.parse("deal 2 damage");

      expect(result).toBeNull();
    });

    it("returns null for missing target", () => {
      const result = exertEffectParser.parse("exert");

      expect(result).toBeNull();
    });

    it("parses 'exert chosen' without 'character' - parseFromText is lenient", () => {
      const result = exertEffectParser.parse("exert chosen");

      // ParseFromText pattern /exert\s+(.+?)(?:\.|,|$)/i matches anything after "exert"
      // Only the pattern property requires "character"
      expect(result).not.toBeNull();
      expect(result?.type).toBe("exert");
    });

    it("returns null for empty string", () => {
      const result = exertEffectParser.parse("");

      expect(result).toBeNull();
    });

    it("returns null for unrelated text", () => {
      const result = exertEffectParser.parse("gain 2 lore");

      expect(result).toBeNull();
    });

    it("parses 'exert character' without explicit target - parseFromText is lenient", () => {
      const result = exertEffectParser.parse("exert character");

      // ParseFromText pattern /exert\s+(.+?)(?:\.|,|$)/i matches "character"
      expect(result).not.toBeNull();
      expect(result?.type).toBe("exert");
    });

    it("returns null for 'tap' instead of exert", () => {
      const result = exertEffectParser.parse("tap chosen character");

      expect(result).toBeNull();
    });
  });

  describe("CST parsing - exert", () => {
    it("parses CST node with Exert token", () => {
      const cstNode = {
        Exert: [{ image: "exert" }],
      } as unknown as CstNode;

      const result = exertEffectParser.parse(cstNode);

      expect(result).not.toBeNull();
      expect(result?.type).toBe("exert");
    });
  });

  describe("CST parsing - ready", () => {
    it("parses CST node with Ready token", () => {
      const cstNode = {
        Ready: [{ image: "ready" }],
      } as unknown as CstNode;

      const result = exertEffectParser.parse(cstNode);

      expect(result).not.toBeNull();
      expect(result?.type).toBe("ready");
    });
  });

  describe("CST parsing - error cases", () => {
    it("returns null when both Exert and Ready tokens are missing", () => {
      const cstNode = {
        OtherToken: [{ image: "something" }],
      } as unknown as CstNode;

      const result = exertEffectParser.parse(cstNode);

      expect(result).toBeNull();
    });

    it("returns null for empty CST node", () => {
      const cstNode = {} as unknown as CstNode;

      const result = exertEffectParser.parse(cstNode);

      expect(result).toBeNull();
    });
  });

  describe("CST parsing - precedence", () => {
    it("prefers Exert when both tokens present", () => {
      const cstNode = {
        Exert: [{ image: "exert" }],
        Ready: [{ image: "ready" }],
      } as unknown as CstNode;

      const result = exertEffectParser.parse(cstNode);

      expect(result).not.toBeNull();
      expect(result?.type).toBe("exert");
    });
  });

  describe("parser metadata", () => {
    it("has correct pattern", () => {
      expect(exertEffectParser.pattern).toBeDefined();
      expect(exertEffectParser.pattern).toBeInstanceOf(RegExp);
    });

    it("has description", () => {
      expect(exertEffectParser.description).toBeDefined();
      expect(typeof exertEffectParser.description).toBe("string");
      expect(exertEffectParser.description?.length).toBeGreaterThan(0);
    });

    it("has parse function", () => {
      expect(exertEffectParser.parse).toBeDefined();
      expect(typeof exertEffectParser.parse).toBe("function");
    });
  });
});
