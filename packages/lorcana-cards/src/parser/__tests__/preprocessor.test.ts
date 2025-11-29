/**
 * Tests for text preprocessing utilities
 *
 * @group parser
 * @group preprocessor
 */

import { describe, expect, it } from "bun:test";
import {
  extractNamedAbilityPrefix,
  normalizeText,
  resolveSymbols,
} from "../preprocessor";

describe("normalizeText", () => {
  it("should trim whitespace", () => {
    expect(normalizeText("  Rush  ")).toBe("Rush");
    expect(normalizeText("\n\tWard\n")).toBe("Ward");
  });

  it("should collapse multiple spaces", () => {
    expect(normalizeText("Draw  a   card")).toBe("Draw a card");
    expect(normalizeText("Challenger    +3")).toBe("Challenger +3");
  });

  it("should handle empty or whitespace-only strings", () => {
    expect(normalizeText("")).toBe("");
    expect(normalizeText("   ")).toBe("");
  });

  it("should preserve single spaces", () => {
    expect(normalizeText("Draw 2 cards")).toBe("Draw 2 cards");
  });
});

describe("extractNamedAbilityPrefix", () => {
  it("should extract ALL CAPS prefix", () => {
    const result = extractNamedAbilityPrefix(
      "DARK KNOWLEDGE Whenever this character quests, you may draw a card.",
    );
    expect(result).toEqual({
      name: "DARK KNOWLEDGE",
      remainingText: "Whenever this character quests, you may draw a card.",
    });
  });

  it("should extract ALL CAPS with symbols", () => {
    const result = extractNamedAbilityPrefix(
      "MAGIC HAIR {E} − Remove up to 3 damage from chosen character.",
    );
    expect(result).toEqual({
      name: "MAGIC HAIR",
      remainingText: "{E} − Remove up to 3 damage from chosen character.",
    });
  });

  it("should return undefined if no ALL CAPS prefix", () => {
    const result = extractNamedAbilityPrefix(
      "Whenever this character quests, gain 1 lore.",
    );
    expect(result).toBeUndefined();
  });

  it("should not match if ALL CAPS is the whole text", () => {
    const result = extractNamedAbilityPrefix("RUSH");
    expect(result).toBeUndefined();
  });

  it("should handle multiple words in ALL CAPS", () => {
    const result = extractNamedAbilityPrefix(
      "LET IT GO When you play this character, gain 2 lore.",
    );
    expect(result).toEqual({
      name: "LET IT GO",
      remainingText: "When you play this character, gain 2 lore.",
    });
  });

  describe("edge cases: names with numbers", () => {
    it("should handle names with {d},{d} prefix", () => {
      const result = extractNamedAbilityPrefix(
        "{d},{d} MEDICAL PROCEDURES {E} - Choose one:",
      );
      expect(result).toEqual({
        name: "MEDICAL PROCEDURES",
        remainingText: "{E} - Choose one:",
      });
    });

    it("should handle names with numeric prefix", () => {
      const result = extractNamedAbilityPrefix(
        "1,2 MEDICAL PROCEDURES {E} - Choose one:",
      );
      expect(result).toEqual({
        name: "MEDICAL PROCEDURES",
        remainingText: "{E} - Choose one:",
      });
    });

    it("should handle names ending with numbers", () => {
      const result = extractNamedAbilityPrefix(
        "ABILITY 99 When you play this character, draw a card.",
      );
      expect(result).toEqual({
        name: "ABILITY 99",
        remainingText: "When you play this character, draw a card.",
      });
    });
  });

  describe("edge cases: names with special punctuation", () => {
    it("should handle names with exclamation marks", () => {
      const result = extractNamedAbilityPrefix(
        "IT WORKS! Whenever you play an item, you may draw a card.",
      );
      expect(result).toEqual({
        name: "IT WORKS!",
        remainingText: "Whenever you play an item, you may draw a card.",
      });
    });

    it("should handle names with apostrophes", () => {
      const result = extractNamedAbilityPrefix(
        "DON'T BE AFRAID Your Puppy characters gain Ward.",
      );
      expect(result).toEqual({
        name: "DON'T BE AFRAID",
        remainingText: "Your Puppy characters gain Ward.",
      });
    });

    it("should handle names with commas", () => {
      const result = extractNamedAbilityPrefix(
        "LOOK ALIVE, YOU SWABS! Characters gain Rush while here.",
      );
      expect(result).toEqual({
        name: "LOOK ALIVE, YOU SWABS!",
        remainingText: "Characters gain Rush while here.",
      });
    });

    it("should handle names with question marks and exclamation marks", () => {
      const result = extractNamedAbilityPrefix(
        "WHAT HAVE YOU DONE?! This character enters play with {d} damage.",
      );
      expect(result).toEqual({
        name: "WHAT HAVE YOU DONE?!",
        remainingText: "This character enters play with {d} damage.",
      });
    });

    it("should handle names with periods", () => {
      const result = extractNamedAbilityPrefix(
        "WAIT. WHAT? When you play this character, draw a card.",
      );
      expect(result).toEqual({
        name: "WAIT. WHAT?",
        remainingText: "When you play this character, draw a card.",
      });
    });

    it("should handle names with hyphens", () => {
      const result = extractNamedAbilityPrefix(
        "READY-SET-GO When you play this character, gain 2 lore.",
      );
      expect(result).toEqual({
        name: "READY-SET-GO",
        remainingText: "When you play this character, gain 2 lore.",
      });
    });

    it("should handle mixed case name with apostrophes", () => {
      const result = extractNamedAbilityPrefix(
        "I'm late! {E}, {d} {I} - Chosen character gains Rush this turn.",
      );
      expect(result).toEqual({
        name: "I'm late!",
        remainingText: "{E}, {d} {I} - Chosen character gains Rush this turn.",
      });
    });
  });

  describe("edge cases: names followed by different text patterns", () => {
    it("should handle name followed by This", () => {
      const result = extractNamedAbilityPrefix(
        "HAPPY FACE This item enters play exerted.",
      );
      expect(result).toEqual({
        name: "HAPPY FACE",
        remainingText: "This item enters play exerted.",
      });
    });

    it("should handle name followed by Your", () => {
      const result = extractNamedAbilityPrefix(
        "PROUD TO SERVE Your Queen characters gain Ward.",
      );
      expect(result).toEqual({
        name: "PROUD TO SERVE",
        remainingText: "Your Queen characters gain Ward.",
      });
    });

    it("should handle name followed by Characters", () => {
      const result = extractNamedAbilityPrefix(
        "MAGICAL POWER Characters get +{d} {L} while here.",
      );
      expect(result).toEqual({
        name: "MAGICAL POWER",
        remainingText: "Characters get +{d} {L} while here.",
      });
    });

    it("should handle name followed by Opponents", () => {
      const result = extractNamedAbilityPrefix(
        "GUARDIAN Opponents can't choose your items.",
      );
      expect(result).toEqual({
        name: "GUARDIAN",
        remainingText: "Opponents can't choose your items.",
      });
    });

    it("should handle name followed by Opposing", () => {
      const result = extractNamedAbilityPrefix(
        "PLAYFULNESS Opposing items enter play exerted.",
      );
      expect(result).toEqual({
        name: "PLAYFULNESS",
        remainingText: "Opposing items enter play exerted.",
      });
    });

    it("should handle name followed by Damage", () => {
      const result = extractNamedAbilityPrefix(
        "TRAPPED! Damage counters can't be removed.",
      );
      expect(result).toEqual({
        name: "TRAPPED!",
        remainingText: "Damage counters can't be removed.",
      });
    });

    it("should handle name followed by Skip", () => {
      const result = extractNamedAbilityPrefix(
        "NO MORE BOOKS Skip your turn's Draw step.",
      );
      expect(result).toEqual({
        name: "NO MORE BOOKS",
        remainingText: "Skip your turn's Draw step.",
      });
    });
  });

  describe("edge cases: should not extract", () => {
    it("should not extract when only keyword present", () => {
      const result = extractNamedAbilityPrefix("RUSH");
      expect(result).toBeUndefined();
    });

    it("should not extract when text is mostly lowercase", () => {
      const result = extractNamedAbilityPrefix(
        "Something weird When you play this character, draw a card.",
      );
      expect(result).toBeUndefined();
    });

    it("should not extract when ALL CAPS followed by ALL CAPS", () => {
      const result = extractNamedAbilityPrefix("RUSH WARD");
      expect(result).toBeUndefined();
    });
  });
});

describe("resolveSymbols", () => {
  it("should leave resolved numbers unchanged", () => {
    expect(resolveSymbols("Challenger +3")).toBe("Challenger +3");
    expect(resolveSymbols("Shift 5")).toBe("Shift 5");
  });

  it("should preserve placeholder symbols by default", () => {
    expect(resolveSymbols("Challenger +{d}")).toBe("Challenger +{d}");
    expect(resolveSymbols("{E} - Draw a card")).toBe("{E} - Draw a card");
  });

  it("should preserve all symbol types", () => {
    const text =
      "{E}, 2 {I} - Deal {d} damage and gain {d} lore. Gets +{d} {S}.";
    expect(resolveSymbols(text)).toBe(text);
  });

  it("should handle text with no symbols", () => {
    expect(resolveSymbols("Draw a card")).toBe("Draw a card");
  });
});
