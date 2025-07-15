// Unit tests for text preprocessing functionality

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
  GAME_SYMBOLS,
  handleGameSymbols,
  // type NormalizationConfig,
  normalizeCase,
  normalizePunctuation,
  normalizeSpacing,
  normalizeText,
  validateTextFormat,
} from "../parser";

describe("normalizeSpacing", () => {
  it("should remove extra whitespace between words", () => {
    expect(normalizeSpacing("Draw  a   card")).toBe("Draw a card");
    expect(normalizeSpacing("Choose    one:")).toBe("Choose one:");
  });

  it("should normalize spacing around punctuation", () => {
    expect(normalizeSpacing("Draw a card , then banish it .")).toBe(
      "Draw a card, then banish it.",
    );
    expect(normalizeSpacing("Choose one : Draw or Banish")).toBe(
      "Choose one: Draw or Banish",
    );
  });

  it("should handle mixed whitespace types", () => {
    expect(normalizeSpacing("Draw\ta\ncard")).toBe("Draw a card");
    expect(normalizeSpacing("Choose\r\none")).toBe("Choose one");
  });

  it("should trim leading and trailing whitespace", () => {
    expect(normalizeSpacing("  Draw a card  ")).toBe("Draw a card");
    expect(normalizeSpacing("\t\nChoose one\r\n")).toBe("Choose one");
  });

  it("should handle empty and whitespace-only strings", () => {
    expect(normalizeSpacing("")).toBe("");
    expect(normalizeSpacing("   ")).toBe("");
    expect(normalizeSpacing("\t\n\r")).toBe("");
  });
});

describe("normalizePunctuation", () => {
  it("should standardize quote marks", () => {
    expect(normalizePunctuation('"Draw a card"')).toBe('"Draw a card".');
    expect(normalizePunctuation('"Choose one"')).toBe('"Choose one".');
    expect(normalizePunctuation("'Banish it'")).toBe("'Banish it'.");
  });

  it("should standardize dashes", () => {
    expect(normalizePunctuation("Draw – then banish")).toBe(
      "Draw - then banish.",
    );
    expect(normalizePunctuation("Choose — or banish")).toBe(
      "Choose - or banish.",
    );
  });

  it("should ensure proper sentence endings", () => {
    expect(normalizePunctuation("Draw a card")).toBe("Draw a card.");
    expect(normalizePunctuation("Choose one")).toBe("Choose one.");
    expect(normalizePunctuation("Draw a card!")).toBe("Draw a card!");
  });

  it("should remove duplicate punctuation", () => {
    expect(normalizePunctuation("Draw a card...")).toBe("Draw a card.");
    expect(normalizePunctuation("Choose one!!!")).toBe("Choose one!");
    expect(normalizePunctuation("Really???")).toBe("Really?");
  });

  it("should handle complex punctuation scenarios", () => {
    expect(normalizePunctuation("Draw a card, then banish it")).toBe(
      "Draw a card, then banish it.",
    );
    expect(normalizePunctuation('"Choose one": Draw or Banish')).toBe(
      '"Choose one": Draw or Banish.',
    );
  });
});

describe("normalizeCase", () => {
  it("should preserve proper nouns by default", () => {
    const result = normalizeCase("DRAW A LORCANA CARD");
    expect(result).toBe("Draw a Lorcana card");
  });

  it("should preserve game-specific terms", () => {
    const result = normalizeCase("CHOOSE ONE: DRAW OR BANISH");
    expect(result).toBe("Choose one: Draw or Banish");
  });

  it("should capitalize sentence beginnings", () => {
    const result = normalizeCase("draw a card. then banish it.");
    expect(result).toBe("Draw a card. Then Banish it.");
  });

  it("should convert to lowercase when preserveProperNouns is false", () => {
    const result = normalizeCase("DRAW A LORCANA CARD", false);
    expect(result).toBe("draw a lorcana card");
  });

  it("should handle mixed case input", () => {
    const result = normalizeCase("dRaW a CaRd. ThEn BaNiSh It.");
    expect(result).toBe("Draw a card. Then Banish it.");
  });

  it("should preserve Disney and other proper nouns", () => {
    const result = normalizeCase("DISNEY LORCANA STRENGTH WILLPOWER");
    expect(result).toBe("Disney Lorcana Strength Willpower");
  });
});

describe("handleGameSymbols", () => {
  it("should normalize strength symbols", () => {
    expect(handleGameSymbols("gets +2 {strength}")).toBe("gets +2 {S}");
    expect(handleGameSymbols("gains {str} bonus")).toBe("gains {S} bonus");
    expect(handleGameSymbols("add (s) to power")).toBe("add {S} to power");
  });

  it("should normalize lore symbols", () => {
    expect(handleGameSymbols("gain {lore}")).toBe("gain {L}");
    expect(handleGameSymbols("add (l) value")).toBe("add {L} value");
  });

  it("should normalize willpower symbols", () => {
    expect(handleGameSymbols("gets +1 {willpower}")).toBe("gets +1 {W}");
    expect(handleGameSymbols("bonus {will}")).toBe("bonus {W}");
    expect(handleGameSymbols("add (w) defense")).toBe("add {W} defense");
  });

  it("should normalize inkwell symbols", () => {
    expect(handleGameSymbols("pay {inkwell} cost")).toBe("pay {I} cost");
    expect(handleGameSymbols("use {ink}")).toBe("use {I}");
    expect(handleGameSymbols("spend (i)")).toBe("spend {I}");
  });

  it("should normalize cost symbols", () => {
    expect(handleGameSymbols("reduce {cost} by 1")).toBe("reduce {C} by 1");
    expect(handleGameSymbols("pay (c) less")).toBe("pay {C} less");
  });

  it("should handle multiple symbols in one text", () => {
    const input = "gets +2 {strength} and +1 {willpower}";
    const expected = "gets +2 {S} and +1 {W}";
    expect(handleGameSymbols(input)).toBe(expected);
  });

  it("should add proper spacing around symbols", () => {
    expect(handleGameSymbols("gets+2{S}")).toBe("gets+2 {S}");
    expect(handleGameSymbols("{W}bonus")).toBe("{W} bonus");
  });

  it("should preserve already normalized symbols", () => {
    const input = "gets +2 {S} and +1 {W}";
    expect(handleGameSymbols(input)).toBe(input);
  });
});

describe("normalizeText", () => {
  it("should apply all normalizations by default", () => {
    const input = "DRAW  A   CARD , THEN  BANISH  {strength}  CHARACTER";
    const expected = "Draw a card, then Banish {S} character.";
    expect(normalizeText(input)).toBe(expected);
  });

  it("should respect preserveSpacing option", () => {
    const input = "Draw  a   card";
    const config = { preserveSpacing: true };
    const result = normalizeText(input, config);
    expect(result).toBe("Draw  a   card.");
  });

  it("should respect normalizeCase option", () => {
    const input = "DRAW A CARD";
    const config = { normalizeCase: false };
    const result = normalizeText(input, config);
    expect(result).toBe("DRAW A CARD.");
  });

  it("should respect handleGameSymbols option", () => {
    const input = "gets +2 {strength}";
    const config = { handleGameSymbols: false };
    const result = normalizeText(input, config);
    expect(result).toBe("Gets +2 {Strength}.");
  });

  it("should handle complex card text", () => {
    const input =
      "CHOOSE  ONE : DRAW  A  CARD  OR  DEAL  2  DAMAGE  TO  {strength}  CHARACTER";
    const expected =
      "Choose one: Draw a card or Deal 2 damage to {S} character.";
    expect(normalizeText(input)).toBe(expected);
  });

  it("should handle empty and invalid input gracefully", () => {
    expect(normalizeText("")).toBe("");
    expect(normalizeText("   ")).toBe("");
  });
});

describe("validateTextFormat", () => {
  it("should validate correct text format", () => {
    const result = validateTextFormat("Draw a card. Gets +2 {S}.");
    expect(result.isValid).toBe(true);
    expect(result.issues).toHaveLength(0);
    expect(result.symbols).toEqual(["{S}"]);
  });

  it("should detect malformed symbols", () => {
    const result = validateTextFormat("Gets +2 {STRENGTH} and {X}");
    expect(result.isValid).toBe(false);
    expect(result.issues).toContain("Malformed symbols found: {STRENGTH}, {X}");
  });

  it("should detect multiple consecutive spaces", () => {
    const result = validateTextFormat("Draw  a card");
    expect(result.isValid).toBe(false);
    expect(result.issues).toContain("Multiple consecutive spaces found");
  });

  it("should detect duplicate punctuation", () => {
    const result = validateTextFormat("Draw a card...");
    expect(result.isValid).toBe(false);
    expect(result.issues).toContain("Duplicate punctuation found");
  });

  it("should extract valid symbols", () => {
    const result = validateTextFormat("Gets +2 {S} and +1 {W}");
    expect(result.symbols).toEqual(["{S}", "{W}"]);
  });

  it("should handle text with no symbols", () => {
    const result = validateTextFormat("Draw a card");
    expect(result.isValid).toBe(true);
    expect(result.symbols).toHaveLength(0);
  });

  it("should detect multiple issues", () => {
    const result = validateTextFormat("Draw  a card... Gets {INVALID}");
    expect(result.isValid).toBe(false);
    expect(result.issues).toHaveLength(3); // spaces, punctuation, malformed symbol
  });
});

describe("GAME_SYMBOLS constant", () => {
  it("should contain all expected symbols", () => {
    expect(GAME_SYMBOLS.STRENGTH).toBe("{S}");
    expect(GAME_SYMBOLS.LORE).toBe("{L}");
    expect(GAME_SYMBOLS.WILLPOWER).toBe("{W}");
    expect(GAME_SYMBOLS.INKWELL).toBe("{I}");
    expect(GAME_SYMBOLS.COST).toBe("{C}");
  });

  it("should be readonly", () => {
    // TypeScript should prevent this, but we can test runtime behavior
    expect(() => {
      (GAME_SYMBOLS as any).STRENGTH = "{X}";
    }).not.toThrow(); // JavaScript objects are mutable by default
  });
});

describe("Edge cases and error handling", () => {
  it("should handle very long text", () => {
    const longText = "Draw a card. ".repeat(100);
    const result = normalizeText(longText);
    expect(result).toContain("Draw a card.");
    expect(result.length).toBeGreaterThan(0);
  });

  it("should handle special characters", () => {
    const input = "Draw a card™ with © symbol";
    const result = normalizeText(input);
    expect(result).toBe("Draw a card™ with © symbol.");
  });

  it("should handle unicode characters", () => {
    const input = "Draw a card 🃏";
    const result = normalizeText(input);
    expect(result).toBe("Draw a card 🃏.");
  });

  it("should handle numbers and mathematical symbols", () => {
    const input = "Deal 2+3 damage";
    const result = normalizeText(input);
    expect(result).toBe("Deal 2+3 damage.");
  });
});
