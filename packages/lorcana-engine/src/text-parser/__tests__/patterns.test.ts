// Unit tests for pattern matching system

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  mock,
  spyOn,
} from "bun:test";
import {
  addPattern,
  EFFECT_PATTERNS,
  extractEffectsFromText,
  getAvailableEffectTypes,
  getPatternsForEffectType,
  matchPattern,
  matchPatternForType,
} from "../patterns";
import type { EffectPattern } from "../types";

describe("EFFECT_PATTERNS", () => {
  it("should contain draw patterns", () => {
    expect(EFFECT_PATTERNS.draw).toBeDefined();
    expect(Array.isArray(EFFECT_PATTERNS.draw)).toBe(true);
    expect(EFFECT_PATTERNS.draw?.length).toBeGreaterThan(0);
  });

  it("should contain damage patterns", () => {
    expect(EFFECT_PATTERNS.damage).toBeDefined();
    expect(Array.isArray(EFFECT_PATTERNS.damage)).toBe(true);
    expect(EFFECT_PATTERNS.damage?.length).toBeGreaterThan(0);
  });

  it("should contain banish patterns", () => {
    expect(EFFECT_PATTERNS.banish).toBeDefined();
    expect(Array.isArray(EFFECT_PATTERNS.banish)).toBe(true);
    expect(EFFECT_PATTERNS.banish?.length).toBeGreaterThan(0);
  });
});

describe("Draw Effect Patterns", () => {
  describe("draw a card pattern", () => {
    const pattern = EFFECT_PATTERNS.draw?.[0];

    it("should match 'draw a card'", () => {
      expect(pattern).toBeDefined();
      if (pattern) {
        const match = "draw a card".match(pattern.pattern);
        expect(match).not.toBeNull();
      }
    });

    it("should match 'Draw a card' (case insensitive)", () => {
      expect(pattern).toBeDefined();
      if (pattern) {
        const match = "Draw a card".match(pattern.pattern);
        expect(match).not.toBeNull();
      }
    });

    it("should match 'draw a card' in longer text", () => {
      expect(pattern).toBeDefined();
      if (pattern) {
        const match = "You may draw a card from your deck".match(
          pattern.pattern,
        );
        expect(match).not.toBeNull();
      }
    });

    it("should extract correct effect", () => {
      expect(pattern).toBeDefined();
      if (pattern) {
        const match = "draw a card".match(pattern.pattern);
        if (match) {
          const effect = pattern.extractor(match);
          expect(effect.type).toBe("draw");
          expect(effect.amount).toBe(1);
          expect(effect.parameters).toEqual({});
        }
      }
    });

    it("should not match 'draw cards'", () => {
      expect(pattern).toBeDefined();
      if (pattern) {
        const match = "draw cards".match(pattern.pattern);
        expect(match).toBeNull();
      }
    });
  });

  describe("draw X cards pattern", () => {
    const pattern = EFFECT_PATTERNS.draw?.[1];

    it("should match 'draw 2 cards'", () => {
      expect(pattern).toBeDefined();
      if (pattern) {
        const match = "draw 2 cards".match(pattern.pattern);
        expect(match).not.toBeNull();
      }
    });

    it("should match 'draw 1 card'", () => {
      expect(pattern).toBeDefined();
      if (pattern) {
        const match = "draw 1 card".match(pattern.pattern);
        expect(match).not.toBeNull();
      }
    });

    it("should match 'draw 5 cards'", () => {
      expect(pattern).toBeDefined();
      if (pattern) {
        const match = "draw 5 cards".match(pattern.pattern);
        expect(match).not.toBeNull();
      }
    });

    it("should extract correct amount", () => {
      expect(pattern).toBeDefined();
      if (pattern) {
        const match = "draw 3 cards".match(pattern.pattern);
        if (match) {
          const effect = pattern.extractor(match);
          expect(effect.type).toBe("draw");
          expect(effect.amount).toBe(3);
          expect(effect.parameters).toEqual({});
        }
      }
    });

    it("should not match 'draw a card'", () => {
      expect(pattern).toBeDefined();
      if (pattern) {
        const match = "draw a card".match(pattern.pattern);
        expect(match).toBeNull();
      }
    });
  });

  describe("draw word cards pattern", () => {
    const pattern = EFFECT_PATTERNS.draw?.[2];

    it("should match 'draw two cards'", () => {
      expect(pattern).toBeDefined();
      if (pattern) {
        const match = "draw two cards".match(pattern.pattern);
        expect(match).not.toBeNull();
      }
    });

    it("should match 'draw X cards'", () => {
      expect(pattern).toBeDefined();
      if (pattern) {
        const match = "draw X cards".match(pattern.pattern);
        expect(match).not.toBeNull();
      }
    });

    it("should extract word numbers correctly", () => {
      expect(pattern).toBeDefined();
      if (pattern) {
        const testCases = [
          { text: "draw one cards", expected: 1 },
          { text: "draw two cards", expected: 2 },
          { text: "draw three cards", expected: 3 },
          { text: "draw four cards", expected: 4 },
          { text: "draw five cards", expected: 5 },
        ];

        for (const testCase of testCases) {
          const match = testCase.text.match(pattern.pattern);
          if (match) {
            const effect = pattern.extractor(match);
            expect(effect.amount).toBe(testCase.expected);
          }
        }
      }
    });

    it("should handle dynamic amounts", () => {
      expect(pattern).toBeDefined();
      if (pattern) {
        const match = "draw X cards".match(pattern.pattern);
        if (match) {
          const effect = pattern.extractor(match);
          expect(effect.type).toBe("draw");
          expect(effect.amount).toEqual({ dynamic: true });
        }
      }
    });
  });
});

describe("Damage Effect Patterns", () => {
  describe("deal X damage to target pattern", () => {
    const pattern = EFFECT_PATTERNS.damage?.[0];

    it("should match 'deal 3 damage to chosen character'", () => {
      expect(pattern).toBeDefined();
      if (pattern) {
        const match = "deal 3 damage to chosen character".match(
          pattern.pattern,
        );
        expect(match).not.toBeNull();
      }
    });

    it("should match case insensitive", () => {
      expect(pattern).toBeDefined();
      if (pattern) {
        const match = "Deal 5 Damage to Chosen Character".match(
          pattern.pattern,
        );
        expect(match).not.toBeNull();
      }
    });

    it("should extract damage amount and target", () => {
      expect(pattern).toBeDefined();
      if (pattern) {
        const match = "deal 4 damage to chosen character".match(
          pattern.pattern,
        );
        if (match) {
          const effect = pattern.extractor(match);
          expect(effect.type).toBe("damage");
          expect(effect.amount).toBe(4);
          expect(effect.parameters.targetText).toBe("chosen character");
        }
      }
    });

    it("should handle complex targets", () => {
      expect(pattern).toBeDefined();
      if (pattern) {
        const match = "deal 2 damage to chosen character of yours".match(
          pattern.pattern,
        );
        if (match) {
          const effect = pattern.extractor(match);
          expect(effect.parameters.targetText).toBe(
            "chosen character of yours",
          );
        }
      }
    });
  });

  describe("deal word damage pattern", () => {
    const pattern = EFFECT_PATTERNS.damage?.[1];

    it("should match 'deal two damage to target'", () => {
      expect(pattern).toBeDefined();
      if (pattern) {
        const match = "deal two damage to chosen character".match(
          pattern.pattern,
        );
        expect(match).not.toBeNull();
      }
    });

    it("should handle word numbers", () => {
      expect(pattern).toBeDefined();
      if (pattern) {
        const testCases = [
          { text: "deal one damage to target", expected: 1 },
          { text: "deal two damage to target", expected: 2 },
          { text: "deal three damage to target", expected: 3 },
        ];

        for (const testCase of testCases) {
          const match = testCase.text.match(pattern.pattern);
          if (match) {
            const effect = pattern.extractor(match);
            expect(effect.amount).toBe(testCase.expected);
          }
        }
      }
    });

    it("should handle dynamic amounts", () => {
      expect(pattern).toBeDefined();
      if (pattern) {
        const match = "deal X damage to chosen character".match(
          pattern.pattern,
        );
        if (match) {
          const effect = pattern.extractor(match);
          expect(effect.amount).toEqual({ dynamic: true });
        }
      }
    });
  });

  describe("X damage to target pattern", () => {
    const pattern = EFFECT_PATTERNS.damage?.[2];

    it("should match '3 damage to chosen character'", () => {
      expect(pattern).toBeDefined();
      if (pattern) {
        const match = "3 damage to chosen character".match(pattern.pattern);
        expect(match).not.toBeNull();
      }
    });

    it("should extract amount and target", () => {
      expect(pattern).toBeDefined();
      if (pattern) {
        const match = "5 damage to chosen character".match(pattern.pattern);
        if (match) {
          const effect = pattern.extractor(match);
          expect(effect.type).toBe("damage");
          expect(effect.amount).toBe(5);
          expect(effect.parameters.targetText).toBe("chosen character");
        }
      }
    });
  });
});

describe("Banish Effect Patterns", () => {
  describe("banish target pattern", () => {
    const pattern = EFFECT_PATTERNS.banish?.[0];

    it("should match 'banish chosen character'", () => {
      expect(pattern).toBeDefined();
      if (pattern) {
        const match = "banish chosen character".match(pattern.pattern);
        expect(match).not.toBeNull();
      }
    });

    it("should match case insensitive", () => {
      expect(pattern).toBeDefined();
      if (pattern) {
        const match = "Banish Chosen Character".match(pattern.pattern);
        expect(match).not.toBeNull();
      }
    });

    it("should extract target", () => {
      expect(pattern).toBeDefined();
      if (pattern) {
        const match = "banish chosen character".match(pattern.pattern);
        if (match) {
          const effect = pattern.extractor(match);
          expect(effect.type).toBe("banish");
          expect(effect.parameters.targetText).toBe("chosen character");
        }
      }
    });

    it("should handle complex targets", () => {
      expect(pattern).toBeDefined();
      if (pattern) {
        const match = "banish chosen character of yours".match(pattern.pattern);
        if (match) {
          const effect = pattern.extractor(match);
          expect(effect.parameters.targetText).toBe(
            "chosen character of yours",
          );
        }
      }
    });
  });

  describe("target is banished pattern", () => {
    const pattern = EFFECT_PATTERNS.banish?.[1];

    it("should match 'chosen character is banished'", () => {
      expect(pattern).toBeDefined();
      if (pattern) {
        const match = "chosen character is banished".match(pattern.pattern);
        expect(match).not.toBeNull();
      }
    });

    it("should match 'they are banished'", () => {
      expect(pattern).toBeDefined();
      if (pattern) {
        const match = "they are banished".match(pattern.pattern);
        expect(match).not.toBeNull();
      }
    });

    it("should extract target", () => {
      expect(pattern).toBeDefined();
      if (pattern) {
        const match = "chosen character is banished".match(pattern.pattern);
        if (match) {
          const effect = pattern.extractor(match);
          expect(effect.type).toBe("banish");
          expect(effect.parameters.targetText).toBe("chosen character");
        }
      }
    });
  });
});

describe("Pattern Utility Functions", () => {
  describe("getPatternsForEffectType", () => {
    it("should return patterns for valid effect type", () => {
      const patterns = getPatternsForEffectType("draw");
      expect(Array.isArray(patterns)).toBe(true);
      expect(patterns.length).toBeGreaterThan(0);
    });

    it("should return empty array for invalid effect type", () => {
      const patterns = getPatternsForEffectType("invalid");
      expect(patterns).toEqual([]);
    });
  });

  describe("getAvailableEffectTypes", () => {
    it("should return all available effect types", () => {
      const types = getAvailableEffectTypes();
      expect(types).toContain("draw");
      expect(types).toContain("damage");
      expect(types).toContain("banish");
    });
  });

  describe("addPattern", () => {
    it("should add pattern to existing effect type", () => {
      if (!EFFECT_PATTERNS.draw) {
        EFFECT_PATTERNS.draw = [];
      }
      const originalLength = EFFECT_PATTERNS.draw.length;
      const newPattern: EffectPattern = {
        pattern: /test pattern/i,
        type: "draw",
        extractor: () => ({ type: "draw", parameters: {} }),
      };

      addPattern("draw", newPattern);
      expect(EFFECT_PATTERNS.draw.length).toBe(originalLength + 1);
      expect(EFFECT_PATTERNS.draw).toContain(newPattern);
    });

    it("should create new effect type if it doesn't exist", () => {
      const newPattern: EffectPattern = {
        pattern: /new effect/i,
        type: "new",
        extractor: () => ({ type: "new", parameters: {} }),
      };

      addPattern("newEffectType", newPattern);
      expect(EFFECT_PATTERNS.newEffectType).toBeDefined();
      expect(EFFECT_PATTERNS.newEffectType).toContain(newPattern);
    });
  });

  describe("matchPattern", () => {
    it("should find matching pattern", () => {
      const result = matchPattern("draw a card");

      expect(result.match).not.toBeNull();
      expect(result.pattern).not.toBeNull();
      expect(result.effectType).toBe("draw");
    });

    it("should return null for no match", () => {
      const result = matchPattern("unknown effect text");

      expect(result.match).toBeNull();
      expect(result.pattern).toBeNull();
      expect(result.effectType).toBeNull();
    });
  });

  describe("matchPatternForType", () => {
    it("should find pattern for specific type", () => {
      const result = matchPatternForType("draw a card", "draw");

      expect(result.match).not.toBeNull();
      expect(result.pattern).not.toBeNull();
    });

    it("should return null for wrong type", () => {
      const result = matchPatternForType("draw a card", "damage");

      expect(result.match).toBeNull();
      expect(result.pattern).toBeNull();
    });
  });

  describe("extractEffectsFromText", () => {
    it("should extract single effect", () => {
      const effects = extractEffectsFromText("draw a card");

      expect(effects).toHaveLength(1);
      if (effects[0]) {
        expect(effects[0].type).toBe("draw");
        expect(effects[0].amount).toBe(1);
      }
    });

    it("should extract multiple effects", () => {
      const effects = extractEffectsFromText(
        "draw a card. deal 2 damage to chosen character",
      );

      expect(effects).toHaveLength(2);
      if (effects[0] && effects[1]) {
        expect(effects[0].type).toBe("draw");
        expect(effects[1].type).toBe("damage");
      }
    });

    it("should handle complex text", () => {
      const effects = extractEffectsFromText(
        "Draw 2 cards, then banish chosen character",
      );

      expect(effects).toHaveLength(2);
      if (effects[0] && effects[1]) {
        expect(effects[0].type).toBe("draw");
        expect(effects[0].amount).toBe(2);
        expect(effects[1].type).toBe("banish");
      }
    });

    it("should return empty array for no matches", () => {
      const effects = extractEffectsFromText("unknown effect text");
      expect(effects).toEqual([]);
    });

    it("should handle extraction errors gracefully", () => {
      // Mock console.warn to avoid test output
      const consoleSpy = spyOn(console, "warn").mockImplementation(() => {});

      if (EFFECT_PATTERNS.draw && EFFECT_PATTERNS.draw[0]) {
        // Create a pattern that will throw an error
        const originalPattern = EFFECT_PATTERNS.draw[0];
        EFFECT_PATTERNS.draw[0] = {
          pattern: originalPattern.pattern,
          type: originalPattern.type,
          extractor: () => {
            throw new Error("Test error");
          },
        };

        const effects = extractEffectsFromText("draw a card");
        expect(effects).toEqual([]);
        expect(consoleSpy).toHaveBeenCalled();

        // Restore original pattern
        EFFECT_PATTERNS.draw[0] = originalPattern;
      }

      consoleSpy.mockRestore();
    });
  });
});
