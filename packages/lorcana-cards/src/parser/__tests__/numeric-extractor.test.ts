/**
 * Tests for numeric value extraction and placeholder replacement
 */

import {
  extractNumericValues,
  normalizeToPattern,
  replacePlaceholders,
  resolvePlaceholders,
} from "../numeric-extractor";

describe("normalizeToPattern", () => {
  it("should replace single digit with {d}", () => {
    expect(normalizeToPattern("Gain 3 lore")).toBe("Gain {d} lore");
  });

  it("should replace multiple digits with {d}", () => {
    expect(normalizeToPattern("Gain 10 lore")).toBe("Gain {d} lore");
  });

  it("should preserve positive sign", () => {
    expect(normalizeToPattern("Deal +5 damage")).toBe("Deal +{d} damage");
  });

  it("should preserve negative sign", () => {
    expect(normalizeToPattern("Deal -2 damage")).toBe("Deal -{d} damage");
  });

  it("should handle multiple numbers", () => {
    expect(normalizeToPattern("Pay 1 {I} less, gain 2 lore")).toBe(
      "Pay {d} {I} less, gain {d} lore",
    );
  });

  it("should handle numbers with different formats", () => {
    expect(normalizeToPattern("Deal +3 damage to chosen character")).toBe(
      "Deal +{d} damage to chosen character",
    );
  });

  it("should handle text without numbers", () => {
    expect(normalizeToPattern("Draw a card")).toBe("Draw a card");
  });
});

describe("extractNumericValues", () => {
  it("should extract single value", () => {
    expect(extractNumericValues("Gain 3 lore", "Gain {d} lore")).toEqual([3]);
  });

  it("should extract multiple values in order", () => {
    expect(
      extractNumericValues(
        "Pay 1 {I} less, gain 2 lore",
        "Pay {d} {I} less, gain {d} lore",
      ),
    ).toEqual([1, 2]);
  });

  it("should handle positive signs", () => {
    expect(extractNumericValues("Deal +5 damage", "Deal +{d} damage")).toEqual([
      5,
    ]);
  });

  it("should handle negative signs", () => {
    expect(extractNumericValues("Deal -2 damage", "Deal -{d} damage")).toEqual([
      -2,
    ]);
  });

  it("should return empty array if patterns don't match", () => {
    expect(extractNumericValues("Gain 3 lore", "Draw {d} cards")).toEqual([]);
  });

  it("should handle complex text with multiple numbers", () => {
    expect(
      extractNumericValues(
        "At the end of each opponent's turn, if they have more than 3 cards in their hand, they discard until they have 3 cards in their hand.",
        "At the end of each opponent's turn, if they have more than {d} cards in their hand, they discard until they have {d} cards in their hand.",
      ),
    ).toEqual([3, 3]);
  });

  it("should handle whitespace differences", () => {
    expect(extractNumericValues("Gain  3  lore", "Gain {d} lore")).toEqual([3]);
  });

  it("should return empty array for text without numbers", () => {
    expect(extractNumericValues("Draw a card", "Draw a card")).toEqual([]);
  });
});

describe("replacePlaceholders", () => {
  it("should replace single {d} with value", () => {
    expect(replacePlaceholders("Gain {d} lore", [3])).toBe("Gain 3 lore");
  });

  it("should replace multiple {d} with values in order", () => {
    expect(replacePlaceholders("Pay {d} {I} less, gain {d} lore", [1, 2])).toBe(
      "Pay 1 {I} less, gain 2 lore",
    );
  });

  it("should handle +{d} pattern", () => {
    expect(replacePlaceholders("Deal +{d} damage", [5])).toBe("Deal +5 damage");
  });

  it("should handle -{d} pattern", () => {
    expect(replacePlaceholders("Deal -{d} damage", [2])).toBe("Deal -2 damage");
  });

  it("should return original text if no values provided", () => {
    expect(replacePlaceholders("Gain {d} lore", [])).toBe("Gain {d} lore");
  });

  it("should handle more placeholders than values", () => {
    expect(replacePlaceholders("Gain {d} lore, draw {d} cards", [3])).toBe(
      "Gain 3 lore, draw {d} cards",
    );
  });

  it("should handle text without placeholders", () => {
    expect(replacePlaceholders("Draw a card", [1, 2])).toBe("Draw a card");
  });
});

describe("resolvePlaceholders", () => {
  it("should resolve single placeholder", () => {
    expect(resolvePlaceholders("Gain {d} lore", "Gain 3 lore")).toBe(
      "Gain 3 lore",
    );
  });

  it("should resolve multiple placeholders", () => {
    expect(
      resolvePlaceholders(
        "Pay {d} {I} less, gain {d} lore",
        "Pay 1 {I} less, gain 2 lore",
      ),
    ).toBe("Pay 1 {I} less, gain 2 lore");
  });

  it("should return normalized text if patterns don't match", () => {
    expect(resolvePlaceholders("Gain {d} lore", "Draw 3 cards")).toBe(
      "Gain {d} lore",
    );
  });

  it("should handle complex real-world example", () => {
    const normalized =
      "YOU LOOK REGAL If you have a character named Prince John in play, you pay {d} {I} less to play this item. A FEELING OF POWER At the end of each opponent's turn, if they have more than {d} cards in their hand, they discard until they have {d} cards in their hand.";
    const original =
      "YOU LOOK REGAL If you have a character named Prince John in play, you pay 1 {I} less to play this item. A FEELING OF POWER At the end of each opponent's turn, if they have more than 3 cards in their hand, they discard until they have 3 cards in their hand.";

    const resolved = resolvePlaceholders(normalized, original);
    expect(resolved).toContain("pay 1 {I} less");
    expect(resolved).toContain("more than 3 cards");
    expect(resolved).toContain("have 3 cards");
    expect(resolved).not.toContain("{d}");
  });

  it("should handle text with symbols", () => {
    expect(
      resolvePlaceholders(
        "Look at the top {d} cards of your deck",
        "Look at the top 4 cards of your deck",
      ),
    ).toBe("Look at the top 4 cards of your deck");
  });
});
