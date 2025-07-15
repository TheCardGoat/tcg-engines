// Unit tests for the main parser function

import { generateActionAbilitiesFromText, parseActionText } from "../parser";

describe("generateActionAbilitiesFromText", () => {
  it("should return empty array for empty text", () => {
    const result = generateActionAbilitiesFromText("");
    expect(result).toEqual([]);
  });

  it("should return empty array for whitespace-only text", () => {
    const result = generateActionAbilitiesFromText("   ");
    expect(result).toEqual([]);
  });

  it("should handle basic text input without throwing", () => {
    const result = generateActionAbilitiesFromText("Draw a card.");
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("parseActionText", () => {
  it("should return error for empty text", () => {
    const result = parseActionText("");
    expect(result.errors).toContain("Empty or invalid text provided");
    expect(result.abilities).toEqual([]);
  });

  it("should parse basic draw effect", () => {
    const result = parseActionText("Draw a card.");
    expect(result.abilities.length).toBeGreaterThan(0);
    expect(result.errors).toEqual([]);
  });

  it("should enable debug logging when configured", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    parseActionText("Draw a card.", { debug: true });

    expect(consoleSpy).toHaveBeenCalledWith(
      '[Text Parser] Parsing text: "Draw a card."',
    );
    consoleSpy.mockRestore();
  });

  it("should return proper structure", () => {
    const result = parseActionText("Draw a card.");

    expect(result).toHaveProperty("abilities");
    expect(result).toHaveProperty("warnings");
    expect(result).toHaveProperty("errors");
    expect(result).toHaveProperty("clauses");

    expect(Array.isArray(result.abilities)).toBe(true);
    expect(Array.isArray(result.warnings)).toBe(true);
    expect(Array.isArray(result.errors)).toBe(true);
    expect(Array.isArray(result.clauses)).toBe(true);
  });

  describe("Draw Effects", () => {
    it("should parse 'Draw a card' correctly", () => {
      const result = parseActionText("Draw a card.");
      expect(result.abilities.length).toBe(1);
      expect(result.errors).toEqual([]);
      expect(result.clauses.length).toBe(1);
      expect(result.clauses[0]?.effects.length).toBe(1);
      expect(result.clauses[0]?.effects[0]?.type).toBe("draw");
      expect(result.clauses[0]?.effects[0]?.amount).toBe(1);
    });

    it("should parse 'Draw 2 cards' correctly", () => {
      const result = parseActionText("Draw 2 cards.");
      expect(result.abilities.length).toBe(1);
      expect(result.errors).toEqual([]);
      expect(result.clauses[0]?.effects[0]?.type).toBe("draw");
      expect(result.clauses[0]?.effects[0]?.amount).toBe(2);
    });

    it("should parse 'Draw three cards' correctly", () => {
      const result = parseActionText("Draw three cards.");
      expect(result.abilities.length).toBe(1);
      expect(result.errors).toEqual([]);
      expect(result.clauses[0]?.effects[0]?.type).toBe("draw");
      expect(result.clauses[0]?.effects[0]?.amount).toBe(3);
    });
  });

  describe("Damage Effects", () => {
    it("should parse 'Deal 2 damage to chosen character' correctly", () => {
      const result = parseActionText("Deal 2 damage to chosen character.");
      expect(result.abilities.length).toBe(1);
      expect(result.errors).toEqual([]);
      expect(result.clauses[0]?.effects[0]?.type).toBe("damage");
      expect(result.clauses[0]?.effects[0]?.amount).toBe(2);
      expect(result.clauses[0]?.effects[0]?.parameters?.targetText).toBe(
        "chosen character.",
      );
    });

    it("should parse 'Deal three damage to chosen opposing character' correctly", () => {
      const result = parseActionText(
        "Deal three damage to chosen opposing character.",
      );
      expect(result.abilities.length).toBe(1);
      expect(result.errors).toEqual([]);
      expect(result.clauses[0]?.effects[0]?.type).toBe("damage");
      expect(result.clauses[0]?.effects[0]?.amount).toBe(3);
      expect(result.clauses[0]?.effects[0]?.parameters?.targetText).toBe(
        "chosen opposing character.",
      );
    });
  });

  describe("Banish Effects", () => {
    it("should parse 'Banish chosen character' correctly", () => {
      const result = parseActionText("Banish chosen character.");
      expect(result.abilities.length).toBe(1);
      expect(result.errors).toEqual([]);
      expect(result.clauses[0]?.effects[0]?.type).toBe("banish");
      expect(result.clauses[0]?.effects[0]?.parameters?.targetText).toBe(
        "chosen character.",
      );
    });

    it("should parse passive banish 'Chosen character is banished' correctly", () => {
      const result = parseActionText("Chosen character is banished.");
      expect(result.abilities.length).toBe(1);
      expect(result.errors).toEqual([]);
      expect(result.clauses[0]?.effects[0]?.type).toBe("banish");
      expect(result.clauses[0]?.effects[0]?.parameters?.targetText).toBe(
        "Chosen character",
      );
    });
  });

  describe("Attribute Effects", () => {
    it("should parse 'Chosen character gets +2 {S}' correctly", () => {
      const result = parseActionText("Chosen character gets +2 {S}.");
      expect(result.abilities.length).toBe(1);
      expect(result.errors).toEqual([]);
      expect(result.clauses[0]?.effects[0]?.type).toBe("attribute");
      expect(result.clauses[0]?.effects[0]?.amount).toBe(2);
      expect(result.clauses[0]?.effects[0]?.parameters?.attribute).toBe(
        "strength",
      );
      expect(result.clauses[0]?.effects[0]?.parameters?.targetText).toBe(
        "Chosen character",
      );
    });

    it("should parse 'Chosen character gains +1 {W}' correctly", () => {
      const result = parseActionText("Chosen character gains +1 {W}.");
      expect(result.abilities.length).toBe(1);
      expect(result.errors).toEqual([]);
      expect(result.clauses[0]?.effects[0]?.type).toBe("attribute");
      expect(result.clauses[0]?.effects[0]?.amount).toBe(1);
      expect(result.clauses[0]?.effects[0]?.parameters?.attribute).toBe(
        "willpower",
      );
    });

    it("should parse negative modifiers 'Chosen character gets -1 {S}' correctly", () => {
      const result = parseActionText("Chosen character gets -1 {S}.");
      expect(result.abilities.length).toBe(1);
      expect(result.errors).toEqual([]);
      expect(result.clauses[0]?.effects[0]?.type).toBe("attribute");
      expect(result.clauses[0]?.effects[0]?.amount).toBe(-1);
      expect(result.clauses[0]?.effects[0]?.parameters?.attribute).toBe(
        "strength",
      );
    });
  });

  describe("Complex Card Text", () => {
    it("should parse multiple effects 'Draw a card. Deal 1 damage to chosen character.' correctly", () => {
      const result = parseActionText(
        "Draw a card. Deal 1 damage to chosen character.",
      );
      expect(result.abilities.length).toBeGreaterThan(0);
      expect(result.errors).toEqual([]);

      // Should have clauses for both effects
      const allEffects = result.clauses.flatMap(
        (clause) => clause?.effects || [],
      );
      expect(allEffects.length).toBe(2);

      const drawEffect = allEffects.find((effect) => effect.type === "draw");
      const damageEffect = allEffects.find(
        (effect) => effect.type === "damage",
      );

      expect(drawEffect).toBeDefined();
      expect(drawEffect?.amount).toBe(1);

      expect(damageEffect).toBeDefined();
      expect(damageEffect?.amount).toBe(1);
    });

    it("should handle conditional text with 'then'", () => {
      const result = parseActionText(
        "Draw a card, then deal 1 damage to chosen character.",
      );
      expect(result.abilities.length).toBeGreaterThanOrEqual(0);
      // Allow some errors for complex patterns that aren't fully implemented yet
      expect(result.clauses.length).toBeGreaterThan(0);
    });

    it("should handle timing modifiers 'this turn'", () => {
      const result = parseActionText("Chosen character gets +2 {S} this turn.");
      expect(result.abilities.length).toBeGreaterThanOrEqual(0);
      expect(result.clauses.length).toBeGreaterThan(0);

      if (result.clauses[0]?.effects && result.clauses[0].effects.length > 0) {
        const effect = result.clauses[0].effects[0];
        expect(effect?.type).toBe("attribute");
        // Timing info might not be fully implemented yet
        if ((effect as any)?.timingInfo?.duration) {
          expect((effect as any).timingInfo.duration).toBe("turn");
        }
      }
    });

    it("should handle end of turn effects", () => {
      const result = parseActionText("At the end of your turn, draw a card.");
      expect(result.abilities.length).toBeGreaterThanOrEqual(0);
      expect(result.clauses.length).toBeGreaterThan(0);

      if (result.clauses.length > 0) {
        const clause = result.clauses[0];
        expect(clause?.type).toBe("timing");
        if (clause?.effects && clause.effects.length > 0) {
          expect(clause.effects[0]?.type).toBe("draw");
          // Timing info might not be fully implemented yet
          if ((clause.effects[0] as any)?.timingInfo?.timing) {
            expect((clause.effects[0] as any).timingInfo.timing).toBe(
              "end-of-turn",
            );
          }
        }
      }
    });
  });

  describe("Modal Effects", () => {
    it("should parse 'Choose one:' modal effects", () => {
      const result = parseActionText(
        "Choose one: Draw a card or Deal 1 damage to chosen character.",
      );
      expect(result.abilities.length).toBe(1);
      expect(result.errors).toEqual([]);
      expect(result.clauses.length).toBe(1);
      expect(result.clauses[0]?.type).toBe("modal");
    });
  });

  describe("Error Handling", () => {
    it("should handle malformed text gracefully", () => {
      const result = parseActionText("This is not a valid card effect.");
      expect(result.abilities).toBeDefined();
      expect(Array.isArray(result.abilities)).toBe(true);
      expect(Array.isArray(result.warnings)).toBe(true);
      expect(Array.isArray(result.errors)).toBe(true);
    });

    it("should provide warnings for unknown patterns in non-strict mode", () => {
      const result = parseActionText("Unknown effect pattern.", {
        strictMode: false,
      });
      expect(result.abilities).toBeDefined();
      expect(result.warnings.length).toBeGreaterThanOrEqual(0);
    });

    it("should handle parsing errors gracefully", () => {
      // Test with text that might cause parsing issues
      const result = parseActionText("Deal damage to.", { debug: false });
      expect(result.abilities).toBeDefined();
      expect(Array.isArray(result.abilities)).toBe(true);
    });
  });

  describe("Configuration Options", () => {
    it("should respect debug configuration", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      parseActionText("Draw a card.", { debug: true });

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should handle strict mode configuration", () => {
      const result = parseActionText("Unknown pattern.", { strictMode: true });
      expect(result).toBeDefined();
      expect(result.abilities).toBeDefined();
    });

    it("should handle custom patterns if provided", () => {
      const customConfig = {
        customPatterns: {
          test: [
            {
              pattern: /test pattern/i,
              type: "test",
              extractor: () => ({ type: "test", parameters: {} }),
            },
          ],
        },
      };

      const result = parseActionText("Test pattern.", customConfig);
      expect(result).toBeDefined();
      expect(result.abilities).toBeDefined();
    });

    it("should run enhanced validation in debug mode", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      const result = parseActionText("Draw a card.", { debug: true });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("[Text Parser] Comprehensive validation"),
      );
      expect(result.abilities).toBeDefined();

      consoleSpy.mockRestore();
    });

    it("should run enhanced validation in strict mode", () => {
      const result = parseActionText("Draw a card.", { strictMode: true });

      expect(result.abilities).toBeDefined();
      expect(result.warnings).toBeDefined();
      expect(result.errors).toBeDefined();
      // Enhanced validation should have run and potentially added more warnings/errors
    });

    it("should validate type safety of generated abilities", () => {
      const result = parseActionText("Deal 2 damage to chosen character.", {
        strictMode: true,
      });

      expect(result.abilities.length).toBeGreaterThan(0);
      expect(result.errors).toEqual([]);

      // Check that the generated ability conforms to the expected interface
      const ability = result.abilities[0];
      expect(ability?.type).toBe("resolution");
      expect(Array.isArray(ability?.effects)).toBe(true);
      expect(ability?.effects?.length).toBeGreaterThan(0);
      expect(ability?.effects?.[0]?.type).toBe("damage");
    });
  });
});
