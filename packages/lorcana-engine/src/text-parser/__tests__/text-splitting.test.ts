// Unit tests for text splitting and clause identification functionality

import {
  analyzeTextStructure,
  identifyConditionalPhrases,
  identifyModalPatterns,
  identifyTimingMarkers,
  splitIntoClauses,
  splitIntoSentences,
} from "../parser";

describe("splitIntoSentences", () => {
  it("should split text into sentences based on periods", () => {
    const text = "Draw a card. Then banish chosen character.";
    const result = splitIntoSentences(text);
    expect(result).toEqual(["Draw a card.", "Then banish chosen character."]);
  });

  it("should handle exclamation marks and question marks", () => {
    const text = "Draw a card! Are you ready? Yes.";
    const result = splitIntoSentences(text);
    expect(result).toEqual(["Draw a card!", "Are you ready?", "Yes."]);
  });

  it("should handle multiple punctuation marks", () => {
    const text = "Draw a card... Then banish it!!!";
    const result = splitIntoSentences(text);
    expect(result).toEqual(["Draw a card...", "Then banish it!!!"]);
  });

  it("should handle empty and whitespace-only text", () => {
    expect(splitIntoSentences("")).toEqual([]);
    expect(splitIntoSentences("   ")).toEqual([]);
  });

  it("should handle text without sentence endings", () => {
    const text = "Draw a card";
    const result = splitIntoSentences(text);
    expect(result).toEqual(["Draw a card"]);
  });

  it("should handle complex card text", () => {
    const text = "Choose one: Draw a card. Deal 2 damage to chosen character!";
    const result = splitIntoSentences(text);
    expect(result).toEqual([
      "Choose one: Draw a card.",
      "Deal 2 damage to chosen character!",
    ]);
  });
});

describe("splitIntoClauses", () => {
  it("should split text on commas", () => {
    const text = "Draw a card, then banish chosen character";
    const result = splitIntoClauses(text);
    expect(result).toEqual(["Draw a card", "banish chosen character"]);
  });

  it('should split text on "then"', () => {
    const text = "Draw a card then banish chosen character";
    const result = splitIntoClauses(text);
    expect(result).toEqual(["Draw a card", "banish chosen character"]);
  });

  it('should split text on "and"', () => {
    const text = "Draw a card and gain 2 lore";
    const result = splitIntoClauses(text);
    expect(result).toEqual(["Draw a card", "gain 2 lore"]);
  });

  it('should split text on "or"', () => {
    const text = "Draw a card or deal 2 damage";
    const result = splitIntoClauses(text);
    expect(result).toEqual(["Draw a card", "deal 2 damage"]);
  });

  it("should split text on semicolons", () => {
    const text = "Draw a card; banish chosen character";
    const result = splitIntoClauses(text);
    expect(result).toEqual(["Draw a card", "banish chosen character"]);
  });

  it("should handle multiple separators", () => {
    const text = "Draw a card, gain 2 lore, then banish chosen character";
    const result = splitIntoClauses(text);
    expect(result).toEqual([
      "Draw a card",
      "gain 2 lore",
      "banish chosen character",
    ]);
  });

  it("should handle empty and whitespace-only text", () => {
    expect(splitIntoClauses("")).toEqual([]);
    expect(splitIntoClauses("   ")).toEqual([]);
  });

  it("should handle text without separators", () => {
    const text = "Draw a card";
    const result = splitIntoClauses(text);
    expect(result).toEqual(["Draw a card"]);
  });
});

describe("identifyModalPatterns", () => {
  it('should identify "Choose one:" patterns', () => {
    const text = "Choose one: Draw a card or deal 2 damage";
    const result = identifyModalPatterns(text);
    expect(result.isModal).toBe(true);
    expect(result.modalType).toBe("Choose one");
    expect(result.options).toEqual(["Draw a card", "deal 2 damage"]);
  });

  it('should identify "Choose X:" patterns', () => {
    const text = "Choose two: Draw a card or deal damage or banish character";
    const result = identifyModalPatterns(text);
    expect(result.isModal).toBe(true);
    expect(result.modalType).toBe("Choose two");
  });

  it('should identify "Select one:" patterns', () => {
    const text = "Select one: Draw a card or gain lore";
    const result = identifyModalPatterns(text);
    expect(result.isModal).toBe(true);
    expect(result.modalType).toBe("Select one");
    expect(result.options).toEqual(["Draw a card", "gain lore"]);
  });

  it('should identify "Pick one:" patterns', () => {
    const text = "Pick one: Draw or banish";
    const result = identifyModalPatterns(text);
    expect(result.isModal).toBe(true);
    expect(result.modalType).toBe("Pick one");
    expect(result.options).toEqual(["Draw", "banish"]);
  });

  it("should handle case insensitive matching", () => {
    const text = "CHOOSE ONE: DRAW A CARD OR DEAL DAMAGE";
    const result = identifyModalPatterns(text);
    expect(result.isModal).toBe(true);
    expect(result.modalType).toBe("CHOOSE ONE");
  });

  it("should return false for non-modal text", () => {
    const text = "Draw a card then banish chosen character";
    const result = identifyModalPatterns(text);
    expect(result.isModal).toBe(false);
  });

  it("should handle empty text", () => {
    const result = identifyModalPatterns("");
    expect(result.isModal).toBe(false);
  });

  it("should handle complex modal options", () => {
    const text =
      "Choose one: Draw 2 cards or deal 3 damage to chosen character or banish all characters";
    const result = identifyModalPatterns(text);
    expect(result.isModal).toBe(true);
    expect(result.options).toEqual([
      "Draw 2 cards",
      "deal 3 damage to chosen character",
      "banish all characters",
    ]);
  });
});

describe("identifyConditionalPhrases", () => {
  it('should identify "if...then" patterns', () => {
    const text = "If you have 5 or more cards in hand, then draw 2 cards";
    const result = identifyConditionalPhrases(text);
    expect(result.hasConditional).toBe(true);
    expect(result.conditionalType).toBe("if");
    expect(result.condition).toBe("you have 5 or more cards in hand");
    expect(result.consequence).toBe("draw 2 cards");
  });

  it('should identify "when" patterns', () => {
    const text = "When this character is banished, draw a card";
    const result = identifyConditionalPhrases(text);
    expect(result.hasConditional).toBe(true);
    expect(result.conditionalType).toBe("when");
    expect(result.condition).toBe("this character is banished");
    expect(result.consequence).toBe("draw a card");
  });

  it('should identify "whenever" patterns', () => {
    const text = "Whenever you play a character, gain 1 lore";
    const result = identifyConditionalPhrases(text);
    expect(result.hasConditional).toBe(true);
    expect(result.conditionalType).toBe("whenever");
    expect(result.condition).toBe("you play a character");
    expect(result.consequence).toBe("gain 1 lore");
  });

  it('should identify simple "then" patterns', () => {
    const text = "Draw a card then banish chosen character";
    const result = identifyConditionalPhrases(text);
    expect(result.hasConditional).toBe(true);
    expect(result.conditionalType).toBe("then");
    expect(result.condition).toBe("Draw a card");
    expect(result.consequence).toBe("banish chosen character");
  });

  it("should handle case insensitive matching", () => {
    const text = "IF you have lore THEN draw cards";
    const result = identifyConditionalPhrases(text);
    expect(result.hasConditional).toBe(true);
    expect(result.conditionalType).toBe("if");
  });

  it("should return false for non-conditional text", () => {
    const text = "Draw a card and gain lore";
    const result = identifyConditionalPhrases(text);
    expect(result.hasConditional).toBe(false);
  });

  it("should handle empty text", () => {
    const result = identifyConditionalPhrases("");
    expect(result.hasConditional).toBe(false);
  });

  it("should handle conditional with comma", () => {
    const text = "If you control 3 characters, then deal 5 damage";
    const result = identifyConditionalPhrases(text);
    expect(result.hasConditional).toBe(true);
    expect(result.condition).toBe("you control 3 characters");
    expect(result.consequence).toBe("deal 5 damage");
  });
});

describe("identifyTimingMarkers", () => {
  it('should identify "at the end of your turn" patterns', () => {
    const text = "Draw a card. At the end of your turn, banish this character.";
    const result = identifyTimingMarkers(text);
    expect(result.hasTimingMarker).toBe(true);
    expect(result.timingType).toBe("end-of-turn");
    expect(result.timing).toBe("At the end of your turn");
  });

  it('should identify "at the beginning of your turn" patterns', () => {
    const text = "At the beginning of your turn, draw a card";
    const result = identifyTimingMarkers(text);
    expect(result.hasTimingMarker).toBe(true);
    expect(result.timingType).toBe("beginning-of-turn");
    expect(result.timing).toBe("At the beginning of your turn");
  });

  it('should identify "this turn" patterns', () => {
    const text = "Chosen character gets +3 strength this turn";
    const result = identifyTimingMarkers(text);
    expect(result.hasTimingMarker).toBe(true);
    expect(result.timingType).toBe("this-turn");
    expect(result.timing).toBe("this turn");
  });

  it('should identify "next turn" patterns', () => {
    const text = "Draw an extra card next turn";
    const result = identifyTimingMarkers(text);
    expect(result.hasTimingMarker).toBe(true);
    expect(result.timingType).toBe("next-turn");
    expect(result.timing).toBe("next turn");
  });

  it('should identify "until end of turn" patterns', () => {
    const text = "All characters get +1 strength until end of turn";
    const result = identifyTimingMarkers(text);
    expect(result.hasTimingMarker).toBe(true);
    expect(result.timingType).toBe("this-turn");
    expect(result.timing).toBe("until end of turn");
  });

  it('should identify "permanently" patterns', () => {
    const text = "This character gains ward permanently";
    const result = identifyTimingMarkers(text);
    expect(result.hasTimingMarker).toBe(true);
    expect(result.timingType).toBe("permanent");
    expect(result.timing).toBe("permanently");
  });

  it('should identify "immediately" patterns', () => {
    const text = "Deal 2 damage immediately";
    const result = identifyTimingMarkers(text);
    expect(result.hasTimingMarker).toBe(true);
    expect(result.timingType).toBe("immediate");
    expect(result.timing).toBe("immediately");
  });

  it("should handle case insensitive matching", () => {
    const text = "AT THE END OF YOUR TURN, draw a card";
    const result = identifyTimingMarkers(text);
    expect(result.hasTimingMarker).toBe(true);
    expect(result.timingType).toBe("end-of-turn");
  });

  it("should return false for text without timing markers", () => {
    const text = "Draw a card and banish chosen character";
    const result = identifyTimingMarkers(text);
    expect(result.hasTimingMarker).toBe(false);
  });

  it("should handle empty text", () => {
    const result = identifyTimingMarkers("");
    expect(result.hasTimingMarker).toBe(false);
  });

  it("should extract remaining text after removing timing marker", () => {
    const text = "Draw a card. At the end of your turn, banish this character.";
    const result = identifyTimingMarkers(text);
    expect(result.remainingText).toBe("Draw a card. , banish this character.");
  });
});

describe("analyzeTextStructure", () => {
  it("should analyze simple text structure", () => {
    const text = "Draw a card.";
    const result = analyzeTextStructure(text);

    expect(result.sentences).toEqual(["Draw a card."]);
    expect(result.clauses).toEqual(["Draw a card."]);
    expect(result.modalInfo.isModal).toBe(false);
    expect(result.conditionalInfo.hasConditional).toBe(false);
    expect(result.timingInfo.hasTimingMarker).toBe(false);
    expect(result.isComplex).toBe(false);
  });

  it("should analyze complex modal text", () => {
    const text =
      "Choose one: Draw a card or deal 2 damage to chosen character.";
    const result = analyzeTextStructure(text);

    expect(result.modalInfo.isModal).toBe(true);
    expect(result.modalInfo.modalType).toBe("Choose one");
    expect(result.modalInfo.options).toEqual([
      "Draw a card",
      "Deal 2 damage to chosen character.",
    ]);
    expect(result.isComplex).toBe(true);
  });

  it("should analyze conditional text", () => {
    const text = "If you have 5 cards in hand, then draw 2 more cards.";
    const result = analyzeTextStructure(text);

    expect(result.conditionalInfo.hasConditional).toBe(true);
    expect(result.conditionalInfo.conditionalType).toBe("if");
    expect(result.isComplex).toBe(true);
  });

  it("should analyze text with timing markers", () => {
    const text =
      "Draw a card. At the end of your turn, banish chosen character.";
    const result = analyzeTextStructure(text);

    expect(result.timingInfo.hasTimingMarker).toBe(true);
    expect(result.timingInfo.timingType).toBe("end-of-turn");
    expect(result.isComplex).toBe(true);
  });

  it("should analyze multi-clause text", () => {
    const text = "Draw a card, gain 2 lore, then banish chosen character.";
    const result = analyzeTextStructure(text);

    expect(result.clauses).toEqual([
      "Draw a card",
      "Gain 2 Lore",
      "Banish chosen character.",
    ]);
    expect(result.isComplex).toBe(true); // More than 2 clauses
  });

  it("should analyze very complex text", () => {
    const text =
      "Choose one: If you have 3 characters, then draw 2 cards this turn or deal 3 damage at the end of your turn.";
    const result = analyzeTextStructure(text);

    expect(result.modalInfo.isModal).toBe(true);
    expect(result.conditionalInfo.hasConditional).toBe(true);
    expect(result.timingInfo.hasTimingMarker).toBe(true);
    expect(result.isComplex).toBe(true);
  });

  it("should handle empty text", () => {
    const result = analyzeTextStructure("");

    expect(result.sentences).toEqual([]);
    expect(result.clauses).toEqual([]);
    expect(result.modalInfo.isModal).toBe(false);
    expect(result.conditionalInfo.hasConditional).toBe(false);
    expect(result.timingInfo.hasTimingMarker).toBe(false);
    expect(result.isComplex).toBe(false);
  });

  it("should normalize text before analysis", () => {
    const text = "CHOOSE  ONE : DRAW  A  CARD  OR  DEAL  DAMAGE";
    const result = analyzeTextStructure(text);

    expect(result.modalInfo.isModal).toBe(true);
    expect(result.modalInfo.modalType).toBe("Choose one");
  });
});

describe("Edge cases and error handling", () => {
  it("should handle malformed modal patterns", () => {
    const text = "Choose: Draw a card"; // Missing "one"
    const result = identifyModalPatterns(text);
    expect(result.isModal).toBe(false);
  });

  it("should handle nested conditionals", () => {
    const text = "If you have cards, then if you have lore, draw cards";
    const result = identifyConditionalPhrases(text);
    expect(result.hasConditional).toBe(true);
    expect(result.condition).toBe("you have cards");
  });

  it("should handle multiple timing markers", () => {
    const text = "This turn, at the end of your turn, draw a card";
    const result = identifyTimingMarkers(text);
    expect(result.hasTimingMarker).toBe(true);
    // Should match the first one found
    expect(result.timingType).toBe("this-turn");
  });

  it("should handle very long text", () => {
    const longText = "Draw a card. ".repeat(50);
    const result = splitIntoSentences(longText);
    expect(result).toHaveLength(50);
    expect(result[0]).toBe("Draw a card.");
  });

  it("should handle special characters in text", () => {
    const text = "Draw a card™, then banish chosen character®";
    const result = splitIntoClauses(text);
    expect(result).toEqual(["Draw a card™", "banish chosen character®"]);
  });

  it("should handle unicode characters", () => {
    const text = "Draw a card 🃏, then banish chosen character 💀";
    const result = splitIntoClauses(text);
    expect(result).toEqual(["Draw a card 🃏", "banish chosen character 💀"]);
  });
});
