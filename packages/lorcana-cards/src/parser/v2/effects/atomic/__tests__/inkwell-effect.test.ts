/**
 * Tests for Inkwell Effect Parser
 * Ensures inkwell effects are parsed correctly from text.
 */

import { describe, expect, it } from "bun:test";
import type { Effect } from "../../../types";
import { inkwellEffectParser } from "../inkwell-effect";

describe("inkwellEffectParser", () => {
  describe("text parsing - put into inkwell", () => {
    it("parses 'put into your inkwell' correctly", () => {
      const result = inkwellEffectParser.parse("put into your inkwell");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("put-into-inkwell");
      expect((result as Effect & { source: string }).source).toBe("hand");
      expect((result as Effect & { target: string }).target).toBe("controller");
    });

    it("parses 'add to your inkwell' correctly", () => {
      const result = inkwellEffectParser.parse("add to your inkwell");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("put-into-inkwell");
      expect((result as Effect & { target: string }).target).toBe("controller");
    });

    it("parses 'put it into your inkwell' correctly", () => {
      const result = inkwellEffectParser.parse("put it into your inkwell");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("put-into-inkwell");
    });

    it("parses 'add into inkwell' without 'your' correctly", () => {
      const result = inkwellEffectParser.parse("add into inkwell");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("put-into-inkwell");
    });
  });

  describe("text parsing - source variations", () => {
    it("parses 'put the top card of your deck into your inkwell' correctly", () => {
      const result = inkwellEffectParser.parse(
        "put the top card of your deck into your inkwell",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("put-into-inkwell");
      expect((result as Effect & { source: string }).source).toBe(
        "top-of-deck",
      );
    });

    it("parses 'put a card from your hand into your inkwell' correctly", () => {
      const result = inkwellEffectParser.parse(
        "put a card from your hand into your inkwell",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("put-into-inkwell");
      expect((result as Effect & { source: string }).source).toBe("hand");
    });

    it("parses 'put this card into your inkwell' correctly", () => {
      const result = inkwellEffectParser.parse(
        "put this card into your inkwell",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("put-into-inkwell");
      expect((result as Effect & { source: string }).source).toBe("this-card");
    });

    it("parses 'put that card into your inkwell' correctly", () => {
      const result = inkwellEffectParser.parse(
        "put that card into your inkwell",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("put-into-inkwell");
      expect((result as Effect & { source: string }).source).toBe(
        "referenced-card",
      );
    });

    it("parses 'put chosen character into your inkwell' correctly", () => {
      const result = inkwellEffectParser.parse(
        "put chosen character into your inkwell",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("put-into-inkwell");
      expect((result as Effect & { source: string }).source).toBe(
        "chosen-character",
      );
    });

    it("parses 'put an additional card into your inkwell' correctly", () => {
      const result = inkwellEffectParser.parse(
        "put an additional card into your inkwell",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("put-into-inkwell");
      expect((result as Effect & { source: string }).source).toBe("hand");
    });
  });

  describe("text parsing - target player variations", () => {
    it("parses 'put into their inkwell' for opponent correctly", () => {
      const result = inkwellEffectParser.parse("put into their inkwell");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("put-into-inkwell");
      expect((result as Effect & { target: string }).target).toBe("opponent");
    });

    it("parses 'put into their player's inkwell' correctly", () => {
      const result = inkwellEffectParser.parse(
        "put into their player's inkwell",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("put-into-inkwell");
      expect((result as Effect & { target: string }).target).toBe("opponent");
    });
  });

  describe("text parsing - modifiers", () => {
    it("parses 'put into your inkwell exerted' correctly", () => {
      const result = inkwellEffectParser.parse("put into your inkwell exerted");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("put-into-inkwell");
      expect((result as Effect & { exerted?: boolean }).exerted).toBe(true);
    });

    it("parses 'put into your inkwell facedown' correctly", () => {
      const result = inkwellEffectParser.parse(
        "put into your inkwell facedown",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("put-into-inkwell");
      expect((result as Effect & { facedown?: boolean }).facedown).toBe(true);
    });

    it("parses 'put into your inkwell face down' with space correctly", () => {
      const result = inkwellEffectParser.parse(
        "put into your inkwell face down",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("put-into-inkwell");
      expect((result as Effect & { facedown?: boolean }).facedown).toBe(true);
    });

    it("parses 'put into your inkwell exerted and facedown' correctly", () => {
      const result = inkwellEffectParser.parse(
        "put into your inkwell exerted and facedown",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("put-into-inkwell");
      expect((result as Effect & { exerted?: boolean }).exerted).toBe(true);
      expect((result as Effect & { facedown?: boolean }).facedown).toBe(true);
    });

    it("does not add exerted when not present", () => {
      const result = inkwellEffectParser.parse("put into your inkwell");

      expect(result).not.toBeNull();
      expect(
        (result as Effect & { exerted?: boolean }).exerted,
      ).toBeUndefined();
    });

    it("does not add facedown when not present", () => {
      const result = inkwellEffectParser.parse("put into your inkwell");

      expect(result).not.toBeNull();
      expect(
        (result as Effect & { facedown?: boolean }).facedown,
      ).toBeUndefined();
    });
  });

  describe("text parsing - case insensitivity", () => {
    it("parses 'PUT INTO YOUR INKWELL' in uppercase", () => {
      const result = inkwellEffectParser.parse("PUT INTO YOUR INKWELL");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("put-into-inkwell");
    });

    it("parses 'Add To Your Inkwell' in mixed case", () => {
      const result = inkwellEffectParser.parse("Add To Your Inkwell");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("put-into-inkwell");
    });

    it("parses 'pUt InTo InKwElL' in random case", () => {
      const result = inkwellEffectParser.parse("pUt InTo InKwElL");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("put-into-inkwell");
    });
  });

  describe("text parsing - whitespace variations", () => {
    it("parses with single spaces", () => {
      const result = inkwellEffectParser.parse("put into your inkwell");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("put-into-inkwell");
    });

    it("parses with multiple spaces", () => {
      const result = inkwellEffectParser.parse("put  into  your  inkwell");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("put-into-inkwell");
    });

    it("parses with tabs", () => {
      const result = inkwellEffectParser.parse("put\tinto\tyour\tinkwell");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("put-into-inkwell");
    });
  });

  describe("text parsing - non-matching patterns", () => {
    it("returns null for 'draw 2 cards'", () => {
      const result = inkwellEffectParser.parse("draw 2 cards");

      expect(result).toBeNull();
    });

    it("returns null for 'discard a card'", () => {
      const result = inkwellEffectParser.parse("discard a card");

      expect(result).toBeNull();
    });

    it("returns null for 'deal 3 damage'", () => {
      const result = inkwellEffectParser.parse("deal 3 damage");

      expect(result).toBeNull();
    });

    it("returns null for empty string", () => {
      const result = inkwellEffectParser.parse("");

      expect(result).toBeNull();
    });

    it("returns null for unrelated text", () => {
      const result = inkwellEffectParser.parse("gain 2 lore");

      expect(result).toBeNull();
    });

    it("returns null for 'put into play'", () => {
      const result = inkwellEffectParser.parse("put into play");

      expect(result).toBeNull();
    });

    it("returns null for 'add to hand'", () => {
      const result = inkwellEffectParser.parse("add to hand");

      expect(result).toBeNull();
    });
  });

  describe("edge cases", () => {
    it("handles complex phrases with inkwell", () => {
      const result = inkwellEffectParser.parse(
        "you may put an additional card from your hand into your inkwell",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("put-into-inkwell");
      expect((result as Effect & { source: string }).source).toBe("hand");
    });

    it("handles phrases with multiple inkwell references", () => {
      const result = inkwellEffectParser.parse(
        "put a card into your inkwell or put a card into your inkwell",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("put-into-inkwell");
    });

    it("matches 'you may put into inkwell' correctly", () => {
      const result = inkwellEffectParser.parse("you may put into inkwell");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("put-into-inkwell");
    });
  });

  describe("CST parsing", () => {
    it("returns null for CST input with warning log", () => {
      const mockCstNode = {} as any;
      const result = inkwellEffectParser.parse(mockCstNode);

      expect(result).toBeNull();
    });
  });
});
