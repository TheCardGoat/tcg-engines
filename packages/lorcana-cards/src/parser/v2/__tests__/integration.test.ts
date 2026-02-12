/**
 * Integration tests for the v2 Lorcana parser.
 * Tests the full parsing pipeline from ability text to typed objects.
 *
 * Note: These tests focus on text-based effect parsing since the
 * grammar-based parser has known ambiguity issues from Task Group 7.
 */

import { beforeEach, describe, expect, it } from "bun:test";
import {
  atomicEffectParsers,
  compositeEffectParsers,
  parseAtomicEffect,
  parseCompositeEffect,
  parseEffect,
} from "../effects";
import { logger } from "../logging";

describe("Integration: Effect Parsing Pipeline", () => {
  beforeEach(() => {
    // Disable logging for cleaner test output
    logger.disable();
  });

  describe("Parser Entry Point Exports", () => {
    it("exports parseEffect function", () => {
      expect(typeof parseEffect).toBe("function");
    });

    it("exports parseAtomicEffect function", () => {
      expect(typeof parseAtomicEffect).toBe("function");
    });

    it("exports parseCompositeEffect function", () => {
      expect(typeof parseCompositeEffect).toBe("function");
    });

    it("exports atomicEffectParsers registry", () => {
      expect(Array.isArray(atomicEffectParsers)).toBe(true);
      expect(atomicEffectParsers.length).toBeGreaterThan(0);
    });

    it("exports compositeEffectParsers registry", () => {
      expect(Array.isArray(compositeEffectParsers)).toBe(true);
      expect(compositeEffectParsers.length).toBeGreaterThan(0);
    });

    it("all atomic parsers have required interface", () => {
      for (const parser of atomicEffectParsers) {
        expect(parser).toHaveProperty("pattern");
        expect(parser).toHaveProperty("parse");
        expect(typeof parser.parse).toBe("function");
      }
    });

    it("all composite parsers have required interface", () => {
      for (const parser of compositeEffectParsers) {
        expect(parser).toHaveProperty("pattern");
        expect(parser).toHaveProperty("parse");
        expect(typeof parser.parse).toBe("function");
      }
    });
  });

  describe("Full Parsing Pipeline", () => {
    describe("Atomic Effects", () => {
      it("parses draw effect through pipeline", () => {
        const result = parseEffect("draw 2 cards");

        expect(result).not.toBeNull();
        expect(result?.type).toBe("draw");
        expect((result as { amount?: number })?.amount).toBe(2);
      });

      it("parses discard effect through pipeline", () => {
        const result = parseEffect("discard 1 card");

        expect(result).not.toBeNull();
        expect(result?.type).toBe("discard");
        if (result && result.type === "discard") {
          expect(result.amount).toBe(1);
        }
      });

      it("parses damage effect through pipeline", () => {
        const result = parseEffect("deal 3 damage to chosen character");

        expect(result).not.toBeNull();
        expect(result?.type).toBe("deal-damage");
        if (result && result.type === "deal-damage") {
          expect(result.amount).toBe(3);
        }
      });

      it("parses lore gain effect through pipeline", () => {
        const result = parseEffect("gain 2 lore");

        expect(result).not.toBeNull();
        expect(result?.type).toBe("gain-lore");
        if (result && result.type === "gain-lore") {
          expect(result.amount).toBe(2);
        }
      });

      it("parses exert effect through pipeline", () => {
        const result = parseEffect("exert chosen character");

        expect(result).not.toBeNull();
        expect(result?.type).toBe("exert");
      });

      it("parses banish effect through pipeline", () => {
        const result = parseEffect("banish chosen character");

        expect(result).not.toBeNull();
        expect(result?.type).toBe("banish");
      });
    });

    describe("Composite Effects", () => {
      it("parses sequence effect through pipeline", () => {
        const result = parseEffect("draw 2 cards, then discard 1 card");

        expect(result).not.toBeNull();
        expect(result?.type).toBe("sequence");
        if (result && result.type === "sequence" && result.steps) {
          expect(result.steps).toHaveLength(2);
          expect(result.steps[0].type).toBe("draw");
          expect(result.steps[1].type).toBe("discard");
        }
      });

      it("parses choice effect through pipeline", () => {
        const result = parseEffect("choose one: draw 2 cards; or gain 2 lore");

        expect(result).not.toBeNull();
        expect(result?.type).toBe("choice");
        if (result && result.type === "choice" && result.options) {
          expect(result.options).toHaveLength(2);
          expect(result.options[0].type).toBe("draw");
          expect(result.options[1].type).toBe("gain-lore");
        }
      });

      it("parses optional effect through pipeline", () => {
        const result = parseEffect("you may draw 1 card");

        expect(result).not.toBeNull();
        expect(result?.type).toBe("optional");
        if (result && result.type === "optional" && result.effect) {
          expect(result.effect.type).toBe("draw");
        }
      });

      it("parses for-each effect through pipeline", () => {
        const result = parseEffect("for each character you control, gain 1 lore");

        expect(result).not.toBeNull();
        expect(result?.type).toBe("for-each");
        if (result && result.type === "for-each" && result.effect) {
          expect(result.effect.type).toBe("gain-lore");
        }
      });

      it("parses conditional effect through pipeline", () => {
        const result = parseEffect("if you have another character in play, gain 2 lore");

        expect(result).not.toBeNull();
        expect(result?.type).toBe("conditional");
        if (result && result.type === "conditional" && result.then) {
          expect(result.then.type).toBe("gain-lore");
        }
      });

      it("parses repeat effect through pipeline", () => {
        // Repeat effect requires comma: "X, Y times" or "do X Y times"
        const result = parseEffect("draw 1 card, 3 times");

        expect(result).not.toBeNull();
        expect(result?.type).toBe("repeat");
        if (result && result.type === "repeat") {
          expect(result.effect.type).toBe("draw");
          expect(result.times).toBe(3);
        }
      });
    });

    describe("Parser Precedence", () => {
      it("composite parsers are tried before atomic parsers", () => {
        // This should match sequence parser, not draw parser
        const result = parseEffect("draw 1 card, then discard 1 card");

        expect(result?.type).toBe("sequence");
        expect(result?.type).not.toBe("draw");
      });

      it("falls back to atomic when no composite matches", () => {
        const result = parseEffect("draw 2 cards");

        expect(result?.type).toBe("draw");
      });
    });

    describe("Error Handling and Recovery", () => {
      it("returns null for unparseable text", () => {
        const result = parseEffect("this is not a valid effect");

        expect(result).toBeNull();
      });

      it("returns null for empty string", () => {
        const result = parseEffect("");

        expect(result).toBeNull();
      });

      it("handles malformed numbers gracefully", () => {
        const result = parseEffect("draw abc cards");

        expect(result).toBeNull();
      });

      it("handles partial matches gracefully", () => {
        const result = parseEffect("draw cards");

        expect(result).toBeNull();
      });

      it("does not throw on invalid input", () => {
        expect(() => parseEffect("###invalid###")).not.toThrow();
      });

      it("does not throw on very long input", () => {
        const longText = "draw " + "very ".repeat(1000) + "many cards";
        expect(() => parseEffect(longText)).not.toThrow();
      });
    });
  });

  describe("Real Card Examples", () => {
    it("parses Elsa - Snow Queen ability", () => {
      const result = parseEffect("deal 2 damage to chosen character");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("deal-damage");
      if (result && result.type === "deal-damage") {
        expect(result.amount).toBe(2);
      }
    });

    it("parses Aladdin - Prince Ali ability", () => {
      const result = parseEffect("draw 2 cards, then discard 1 card");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("sequence");
      if (result && result.type === "sequence") {
        expect(result.steps).toHaveLength(2);
      }
    });

    it("parses Maleficent - Monstrous Dragon ability", () => {
      const result = parseEffect(
        "choose one: deal 3 damage to chosen character; or deal 1 damage to each opposing character",
      );

      expect(result).not.toBeNull();
      expect(result?.type).toBe("choice");
      if (result && result.type === "choice") {
        expect(result.options).toHaveLength(2);
      }
    });

    it("parses Gaston - Arrogant Hunter ability", () => {
      const result = parseEffect("if you have another character in play, gain 2 lore");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("conditional");
    });

    it("parses Merlin - Crab ability", () => {
      const result = parseEffect("for each character you have in play, gain 1 lore");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("for-each");
    });

    it("parses complex multi-step sequence", () => {
      const result = parseEffect("draw 1 card, then discard 1 card, then gain 1 lore");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("sequence");
      if (result && result.type === "sequence") {
        expect(result.steps).toHaveLength(3);
      }
    });
  });

  describe("Case Insensitivity", () => {
    it("parses effects with different casing", () => {
      const variations = ["draw 2 cards", "DRAW 2 CARDS", "Draw 2 Cards", "dRaW 2 cArDs"];

      for (const text of variations) {
        const result = parseEffect(text);
        expect(result).not.toBeNull();
        expect(result?.type).toBe("draw");
      }
    });
  });

  describe("Whitespace Handling", () => {
    it("handles extra whitespace", () => {
      const result = parseEffect("draw   2   cards");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("draw");
    });

    it("handles leading/trailing whitespace", () => {
      const result = parseEffect("  draw 2 cards  ");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("draw");
    });

    it("handles tabs and newlines", () => {
      const result = parseEffect("draw\t2\ncards");

      expect(result).not.toBeNull();
      expect(result?.type).toBe("draw");
    });
  });

  describe("Logging Integration", () => {
    it("can enable debug logging", () => {
      logger.enable();
      logger.setLevel("debug");

      // Should log debug messages
      const result = parseEffect("draw 2 cards");

      expect(result).not.toBeNull();

      // Cleanup
      logger.disable();
    });

    it("can disable logging", () => {
      logger.disable();

      const result = parseEffect("draw 2 cards");

      expect(result).not.toBeNull();

      // Cleanup - re-enable for other tests
      logger.enable();
      logger.disable(); // But keep disabled for test output
    });

    it("logging does not affect parsing results", () => {
      const text = "draw 2 cards";

      logger.enable();
      logger.setLevel("debug");
      const resultWithLogging = parseEffect(text);

      logger.disable();
      const resultWithoutLogging = parseEffect(text);

      expect(resultWithLogging).toEqual(resultWithoutLogging);
    });
  });

  describe("Parser Registry Integrity", () => {
    it("atomic parsers can parse their expected effect types", () => {
      // Test that parsers actually work
      const testCases = [
        { expectedType: "draw" as const, text: "draw 2 cards" },
        { expectedType: "discard" as const, text: "discard 1 card" },
        {
          expectedType: "deal-damage" as const,
          text: "deal 2 damage to chosen character",
        },
        { expectedType: "gain-lore" as const, text: "gain 2 lore" },
        { expectedType: "exert" as const, text: "exert chosen character" },
        { expectedType: "banish" as const, text: "banish chosen character" },
      ];

      for (const { text, expectedType } of testCases) {
        const result = parseAtomicEffect(text);
        expect(result).not.toBeNull();
        expect(result?.type).toBe(expectedType);
      }
    });

    it("composite parsers can parse their expected effect types", () => {
      const testCases = [
        {
          expectedType: "sequence" as const,
          text: "draw 1 card, then discard 1 card",
        },
        {
          expectedType: "choice" as const,
          text: "choose one: draw 1 card; or gain 1 lore",
        },
        { expectedType: "optional" as const, text: "you may draw 1 card" },
        {
          expectedType: "for-each" as const,
          text: "for each character, gain 1 lore",
        },
        {
          expectedType: "conditional" as const,
          text: "if you have another character, gain 1 lore",
        },
        { expectedType: "repeat" as const, text: "draw 1 card, 2 times" }, // Requires comma
      ];

      for (const { text, expectedType } of testCases) {
        const result = parseCompositeEffect(text);
        expect(result).not.toBeNull();
        expect(result?.type).toBe(expectedType);
      }
    });

    it("has at least 8 atomic parsers registered", () => {
      // We know there should be at least these parsers based on the implementation
      expect(atomicEffectParsers.length).toBeGreaterThanOrEqual(8);
    });

    it("has exactly 6 composite parsers registered", () => {
      // Based on spec: sequence, choice, optional, for-each, conditional, repeat
      expect(compositeEffectParsers.length).toBe(6);
    });

    it("no null parsers in atomic registry", () => {
      for (const parser of atomicEffectParsers) {
        expect(parser).not.toBeNull();
        expect(parser).toBeDefined();
      }
    });

    it("no null parsers in composite registry", () => {
      for (const parser of compositeEffectParsers) {
        expect(parser).not.toBeNull();
        expect(parser).toBeDefined();
      }
    });
  });

  describe("Performance", () => {
    it("parses simple effects quickly", () => {
      const start = Date.now();

      for (let i = 0; i < 100; i++) {
        parseEffect("draw 2 cards");
      }

      const elapsed = Date.now() - start;

      // Should parse 100 effects in less than 1000ms (higher threshold for CI parallel execution)
      expect(elapsed).toBeLessThan(1000);
    });

    it("parses complex effects quickly", () => {
      const start = Date.now();

      for (let i = 0; i < 100; i++) {
        parseEffect(
          "choose one: draw 2 cards, then discard 1 card; or gain 2 lore, then exert chosen character",
        );
      }

      const elapsed = Date.now() - start;

      // Should parse 100 complex effects in less than 2000ms (higher threshold for CI parallel execution)
      expect(elapsed).toBeLessThan(2000);
    });
  });

  describe("Edge Cases", () => {
    it("handles effects with numbers at boundaries", () => {
      const results = [
        parseEffect("draw 0 cards"),
        parseEffect("draw 1 card"),
        parseEffect("draw 99 cards"),
      ];

      for (const result of results) {
        expect(result).not.toBeNull();
        expect(result?.type).toBe("draw");
      }
    });

    it("handles singular vs plural correctly", () => {
      const singular = parseEffect("draw 1 card");
      const plural = parseEffect("draw 2 cards");

      expect(singular).not.toBeNull();
      expect(plural).not.toBeNull();
      expect(singular?.type).toBe("draw");
      expect(plural?.type).toBe("draw");
    });

    it("returns null for effects with missing components", () => {
      const invalidEffects = [
        "draw", // Missing amount and target
        "2 cards", // Missing action
        "deal damage", // Missing amount and target
      ];

      for (const text of invalidEffects) {
        const result = parseEffect(text);
        expect(result).toBeNull();
      }
    });
  });
});
