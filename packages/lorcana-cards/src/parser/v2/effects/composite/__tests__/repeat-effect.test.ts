/**
 * Tests for Repeat Effect Parser
 * Ensures repeat effects like "X, Y times" are parsed correctly.
 */

import { describe, expect, it } from "bun:test";
import type { Effect } from "../../../types";
import { repeatEffectParser } from "../repeat-effect";

describe("repeatEffectParser", () => {
  describe("text parsing - happy path (X, Y times pattern)", () => {
    it("parses 'draw 1 card, 3 times' correctly", () => {
      const result = repeatEffectParser.parse("draw 1 card, 3 times");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("repeat");
      const { times } = result as Effect & { times: number };
      const { effect } = result as Effect & { effect: Effect };
      expect(times).toBe(3);
      expect(effect.type).toBe("draw");
    });

    it("parses 'deal 1 damage, 2 times' correctly", () => {
      const result = repeatEffectParser.parse("deal 1 damage to chosen character, 2 times");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("repeat");
      const { times } = result as Effect & { times: number };
      const { effect } = result as Effect & { effect: Effect };
      expect(times).toBe(2);
      expect(effect.type).toBe("deal-damage");
    });

    it("parses 'gain 1 lore, 5 times' correctly", () => {
      const result = repeatEffectParser.parse("gain 1 lore, 5 times");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("repeat");
      const { times } = result as Effect & { times: number };
      const { effect } = result as Effect & { effect: Effect };
      expect(times).toBe(5);
      expect(effect.type).toBe("gain-lore");
    });

    it("parses with singular 'time'", () => {
      const result = repeatEffectParser.parse("draw 1 card, 1 time");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("repeat");
      const { times } = result as Effect & { times: number };
      expect(times).toBe(1);
    });

    it("parses with double-digit repeat count", () => {
      const result = repeatEffectParser.parse("draw 1 card, 10 times");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("repeat");
      const { times } = result as Effect & { times: number };
      expect(times).toBe(10);
    });
  });

  describe("text parsing - happy path (do X Y times pattern)", () => {
    it("parses 'do draw 1 card 3 times' correctly", () => {
      const result = repeatEffectParser.parse("do draw 1 card 3 times");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("repeat");
      const { times } = result as Effect & { times: number };
      const { effect } = result as Effect & { effect: Effect };
      expect(times).toBe(3);
      expect(effect.type).toBe("draw");
    });

    it("parses 'do deal 2 damage 2 times' correctly", () => {
      const result = repeatEffectParser.parse("do deal 2 damage to chosen character 2 times");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("repeat");
      const { times } = result as Effect & { times: number };
      const { effect } = result as Effect & { effect: Effect };
      expect(times).toBe(2);
      expect(effect.type).toBe("deal-damage");
    });

    it("parses 'do gain 1 lore 4 times' correctly", () => {
      const result = repeatEffectParser.parse("do gain 1 lore 4 times");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("repeat");
      const { times } = result as Effect & { times: number };
      const { effect } = result as Effect & { effect: Effect };
      expect(times).toBe(4);
      expect(effect.type).toBe("gain-lore");
    });

    it("parses 'do' pattern with singular 'time'", () => {
      const result = repeatEffectParser.parse("do draw 1 card 1 time");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("repeat");
      const { times } = result as Effect & { times: number };
      expect(times).toBe(1);
    });
  });

  describe("text parsing - case insensitivity", () => {
    it("parses 'TIMES' in uppercase", () => {
      const result = repeatEffectParser.parse("draw 1 card, 3 TIMES");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("repeat");
      const { times } = result as Effect & { times: number };
      expect(times).toBe(3);
    });

    it("parses 'DO' in uppercase", () => {
      const result = repeatEffectParser.parse("DO draw 1 card 3 times");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("repeat");
      const { times } = result as Effect & { times: number };
      expect(times).toBe(3);
    });

    it("parses mixed case 'TiMeS'", () => {
      const result = repeatEffectParser.parse("draw 1 card, 3 TiMeS");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("repeat");
    });

    it("parses mixed case 'Do'", () => {
      const result = repeatEffectParser.parse("Do draw 1 card 3 times");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("repeat");
    });
  });

  describe("text parsing - non-matches", () => {
    it("returns null for text without repeat pattern", () => {
      const result = repeatEffectParser.parse("draw 1 card");

      expect(result).toBeNull();
    });

    it("returns null for text with 'times' but no number", () => {
      const result = repeatEffectParser.parse("draw 1 card, many times");

      expect(result).toBeNull();
    });

    it("returns null for empty string", () => {
      const result = repeatEffectParser.parse("");

      expect(result).toBeNull();
    });

    it("returns null for incomplete pattern", () => {
      const result = repeatEffectParser.parse(", 3 times");

      expect(result).toBeNull();
    });
  });

  describe("text parsing - unparseable effects", () => {
    it("returns null when the effect cannot be parsed", () => {
      const result = repeatEffectParser.parse("do something invalid, 3 times");

      expect(result).toBeNull();
    });

    it("returns null when effect is empty", () => {
      const result = repeatEffectParser.parse(", 3 times");

      expect(result).toBeNull();
    });

    it("returns null when 'do' pattern has unparseable effect", () => {
      const result = repeatEffectParser.parse("do invalid effect 3 times");

      expect(result).toBeNull();
    });
  });

  describe("text parsing - whitespace handling", () => {
    it("handles extra whitespace around comma", () => {
      const result = repeatEffectParser.parse("draw 1 card   ,   3 times");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("repeat");
      const { times } = result as Effect & { times: number };
      expect(times).toBe(3);
    });

    it("handles leading and trailing whitespace", () => {
      const result = repeatEffectParser.parse("  draw 1 card, 3 times  ");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("repeat");
    });

    it("handles multiple spaces in effect text", () => {
      const result = repeatEffectParser.parse("draw   1   card, 3 times");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("repeat");
    });

    it("handles extra whitespace in 'do' pattern", () => {
      const result = repeatEffectParser.parse("do   draw 1 card   3   times");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("repeat");
    });
  });

  describe("text parsing - number parsing", () => {
    it("parses single digit repeat count", () => {
      const result = repeatEffectParser.parse("draw 1 card, 1 time");

      const { times } = result as Effect & { times: number };
      expect(times).toBe(1);
    });

    it("parses double digit repeat count", () => {
      const result = repeatEffectParser.parse("draw 1 card, 15 times");

      const { times } = result as Effect & { times: number };
      expect(times).toBe(15);
    });

    it("returns null for non-numeric repeat count", () => {
      const result = repeatEffectParser.parse("draw 1 card, three times");

      expect(result).toBeNull();
    });
  });

  describe("text parsing - different effects", () => {
    it("parses repeat with discard effect", () => {
      const result = repeatEffectParser.parse("discard 1 card, 2 times");

      expect(result).not.toBeNull();
      const { effect } = result as Effect & { effect: Effect };
      expect(effect.type).toBe("discard");
    });

    it("parses repeat with exert effect", () => {
      const result = repeatEffectParser.parse("exert chosen character, 2 times");

      expect(result).not.toBeNull();
      const { effect } = result as Effect & { effect: Effect };
      expect(effect.type).toBe("exert");
    });

    it("parses repeat with banish effect", () => {
      const result = repeatEffectParser.parse("banish chosen character, 3 times");

      expect(result).not.toBeNull();
      const { effect } = result as Effect & { effect: Effect };
      expect(effect.type).toBe("banish");
    });
  });

  describe("CST parsing", () => {
    it("returns null for CST node input (not yet implemented)", () => {
      const mockCstNode = { children: {}, name: "test" } as any;
      const result = repeatEffectParser.parse(mockCstNode);

      expect(result).toBeNull();
    });
  });

  describe("parser metadata", () => {
    it("has correct pattern regex", () => {
      expect(repeatEffectParser.pattern).toBeInstanceOf(RegExp);
    });

    it("has description", () => {
      expect(repeatEffectParser.description).toBeDefined();
      expect(typeof repeatEffectParser.description).toBe("string");
    });
  });
});
