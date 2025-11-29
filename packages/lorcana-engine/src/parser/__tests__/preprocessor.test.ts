/**
 * Tests for text preprocessing utilities
 *
 * @group parser
 * @group preprocessor
 */

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
