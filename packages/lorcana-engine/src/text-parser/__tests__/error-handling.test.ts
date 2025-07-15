// Error handling and edge case tests for the action text parser

import { generateActionAbilitiesFromText, parseActionText } from "../parser";

describe("Error Handling and Edge Cases", () => {
  describe("Input Validation", () => {
    it("should handle null and undefined input", () => {
      expect(() => generateActionAbilitiesFromText(null as any)).not.toThrow();
      expect(() =>
        generateActionAbilitiesFromText(undefined as any),
      ).not.toThrow();

      const nullResult = parseActionText(null as any);
      expect(nullResult.abilities).toEqual([]);
      expect(nullResult.errors.length).toBeGreaterThan(0);

      const undefinedResult = parseActionText(undefined as any);
      expect(undefinedResult.abilities).toEqual([]);
      expect(undefinedResult.errors.length).toBeGreaterThan(0);
    });

    it("should handle empty and whitespace-only strings", () => {
      const emptyInputs = ["", "   ", "\n\t  \n", "     \t"];

      emptyInputs.forEach((input) => {
        const result = parseActionText(input);
        expect(result.abilities).toEqual([]);
        expect(result.errors).toContain("Empty or invalid text provided");
      });
    });

    it("should handle very long input strings", () => {
      const longText = "Draw a card. ".repeat(1000);

      expect(() => parseActionText(longText)).not.toThrow();

      const result = parseActionText(longText);
      expect(result.abilities).toBeDefined();
      expect(Array.isArray(result.abilities)).toBe(true);
    });

    it("should handle special characters and unicode", () => {
      const specialTexts = [
        "Draw a card with émojis 🎴",
        "Deal 2 damage to chosen character™",
        "Banish chosen character © 2023",
        "Draw a card\u0000with null character",
        "Effect with\u200Bzero-width space",
      ];

      specialTexts.forEach((text) => {
        expect(() => parseActionText(text)).not.toThrow();

        const result = parseActionText(text);
        expect(result.abilities).toBeDefined();
        expect(Array.isArray(result.abilities)).toBe(true);
      });
    });
  });

  describe("Malformed Card Text", () => {
    it("should handle incomplete effect descriptions", () => {
      const incompleteTexts = [
        "Deal damage to",
        "Draw cards",
        "Chosen character gets +",
        "Banish chosen",
        "At the end of",
        "Choose one:",
      ];

      incompleteTexts.forEach((text) => {
        const result = parseActionText(text);
        expect(result.abilities).toBeDefined();
        expect(Array.isArray(result.abilities)).toBe(true);

        // Should either generate partial abilities or provide warnings
        expect(
          result.abilities.length +
            result.warnings.length +
            result.errors.length,
        ).toBeGreaterThan(0);
      });
    });

    it("should handle malformed numbers and amounts", () => {
      const malformedNumbers = [
        "Deal X damage to chosen character",
        "Draw NaN cards",
        "Deal -5 damage to chosen character",
        "Draw 0 cards",
        "Deal 999999 damage to chosen character",
        "Draw Infinity cards",
      ];

      malformedNumbers.forEach((text) => {
        const result = parseActionText(text);
        expect(result.abilities).toBeDefined();
        expect(Array.isArray(result.abilities)).toBe(true);

        // Should handle gracefully, possibly with warnings
        if (result.abilities.length > 0) {
          const effects = result.abilities.flatMap(
            (ability) => ability.effects || [],
          );
          effects.forEach((effect) => {
            if ("amount" in effect && effect.amount !== undefined) {
              expect(
                typeof effect.amount === "number" ||
                  typeof effect.amount === "object",
              ).toBe(true);
            }
          });
        }
      });
    });

    it("should handle malformed game symbols", () => {
      const malformedSymbols = [
        "Deal 2 damage and gain +1 {X}",
        "Chosen character gets +2 {STRENGTH}",
        "Draw a card and gain {L",
        "Effect with }S{ reversed symbols",
        "Gain +1 {S} {W} {L} multiple symbols",
      ];

      malformedSymbols.forEach((text) => {
        const result = parseActionText(text);
        expect(result.abilities).toBeDefined();
        expect(Array.isArray(result.abilities)).toBe(true);

        // Should normalize or handle malformed symbols gracefully
        // The parser should either generate abilities or provide warnings
        expect(
          result.abilities.length +
            result.warnings.length +
            result.errors.length,
        ).toBeGreaterThan(0);
      });
    });

    it("should handle inconsistent punctuation", () => {
      const inconsistentPunctuation = [
        "Draw a card,, then deal 1 damage",
        "Chosen character gets +2 {S}...",
        "Deal damage to chosen character!?",
        "Draw a card; banish chosen character;",
        "Effect with no punctuation at all",
      ];

      inconsistentPunctuation.forEach((text) => {
        const result = parseActionText(text);
        expect(result.abilities).toBeDefined();
        expect(Array.isArray(result.abilities)).toBe(true);

        // Should normalize punctuation during preprocessing
        // The parser should either generate clauses or provide feedback
        expect(
          result.clauses.length + result.warnings.length + result.errors.length,
        ).toBeGreaterThan(0);
      });
    });
  });

  describe("Unknown Patterns", () => {
    it("should handle completely unknown effect types", () => {
      const unknownEffects = [
        "Summon a creature from the void",
        "Transform chosen character into a frog",
        "Exile all cards from the game permanently",
        "Create a token copy of chosen character",
        "Shuffle your library and draw 7 cards",
        "Destroy target permanent",
      ];

      unknownEffects.forEach((text) => {
        const result = parseActionText(text, { strictMode: false });
        expect(result.abilities).toBeDefined();
        expect(Array.isArray(result.abilities)).toBe(true);

        // Should handle gracefully - either generate abilities or provide feedback
        expect(
          result.abilities.length +
            result.warnings.length +
            result.errors.length,
        ).toBeGreaterThan(0);
      });
    });

    it("should handle mixed known and unknown patterns", () => {
      const mixedTexts = [
        "Draw a card, then summon a creature",
        "Deal 2 damage to chosen character and exile them",
        "Transform chosen character, then they get +1 {S}",
        "Create a token, then banish chosen character",
      ];

      mixedTexts.forEach((text) => {
        const result = parseActionText(text);
        expect(result.abilities).toBeDefined();
        expect(Array.isArray(result.abilities)).toBe(true);

        // Should parse the known parts
        if (result.abilities.length > 0) {
          const effects = result.abilities.flatMap(
            (ability) => ability.effects || [],
          );
          expect(effects.length).toBeGreaterThan(0);
        }
      });
    });

    it("should provide helpful warnings for unknown patterns", () => {
      const result = parseActionText("Summon a dragon from your deck", {
        debug: true,
      });

      expect(result.abilities).toBeDefined();

      // Should provide informative warnings about parsing issues
      expect(result.warnings.length).toBeGreaterThan(0);

      // Check for expected warning messages
      const hasRelevantWarning = result.warnings.some(
        (w) =>
          w.includes("No clauses found") ||
          w.includes("unknown") ||
          w.includes("pattern") ||
          w.includes("not recognized") ||
          w.includes("abilities from"),
      );
      expect(hasRelevantWarning).toBe(true);
    });
  });

  describe("Parser Configuration Edge Cases", () => {
    it("should handle invalid configuration objects", () => {
      const invalidConfigs = [
        { matchThreshold: -1 },
        { matchThreshold: 2 },
        { debug: "true" as any },
        { strictMode: 1 as any },
        { customPatterns: "invalid" as any },
      ];

      invalidConfigs.forEach((config) => {
        expect(() => parseActionText("Draw a card", config)).not.toThrow();

        const result = parseActionText("Draw a card", config);
        expect(result.abilities).toBeDefined();
        expect(Array.isArray(result.abilities)).toBe(true);
      });
    });

    it("should handle circular references in custom patterns", () => {
      const circularConfig = {
        customPatterns: {},
      };

      // Create circular reference
      (circularConfig.customPatterns as any).self =
        circularConfig.customPatterns;

      expect(() =>
        parseActionText("Draw a card", circularConfig),
      ).not.toThrow();
    });
  });

  describe("Memory and Performance Edge Cases", () => {
    it("should handle deeply nested text structures", () => {
      const deeplyNested =
        "If you have a character in play, then if that character has Bodyguard, then if it's your turn, then draw a card.";

      const result = parseActionText(deeplyNested);
      expect(result.abilities).toBeDefined();
      expect(Array.isArray(result.abilities)).toBe(true);

      // Should not cause stack overflow
      expect(result.clauses.length).toBeGreaterThan(0);
    });

    it("should handle repetitive patterns", () => {
      const repetitive =
        "Draw a card. " + "Deal 1 damage to chosen character. ".repeat(50);

      const startTime = performance.now();
      const result = parseActionText(repetitive);
      const endTime = performance.now();

      expect(result.abilities).toBeDefined();
      expect(Array.isArray(result.abilities)).toBe(true);

      // Should complete in reasonable time (less than 100ms)
      expect(endTime - startTime).toBeLessThan(100);
    });

    it("should handle concurrent parsing requests", async () => {
      const texts = [
        "Draw a card",
        "Deal 2 damage to chosen character",
        "Banish chosen character",
        "Chosen character gets +1 {S}",
        "Return chosen character to hand",
      ];

      const promises = texts.map((text) =>
        Promise.resolve(parseActionText(text)),
      );

      const results = await Promise.all(promises);

      results.forEach((result) => {
        expect(result.abilities).toBeDefined();
        expect(Array.isArray(result.abilities)).toBe(true);
      });
    });
  });

  describe("Boundary Conditions", () => {
    it("should handle maximum reasonable effect counts", () => {
      // Test with a card that has many effects
      const manyEffects = [
        "Draw a card",
        "Deal 1 damage to chosen character",
        "Banish chosen character",
        "Return chosen character to hand",
        "Chosen character gets +1 {S}",
        "Chosen character gets +1 {W}",
        "Chosen character gets +1 {L}",
        "Each player draws a card",
        "Each player discards a card",
        "Look at the top card of your deck",
      ].join(". ");

      const result = parseActionText(manyEffects);
      expect(result.abilities).toBeDefined();
      expect(Array.isArray(result.abilities)).toBe(true);

      // Should handle multiple effects
      const totalEffects = result.abilities.reduce(
        (sum, ability) => sum + (ability.effects?.length || 0),
        0,
      );
      expect(totalEffects).toBeGreaterThan(0);
    });

    it("should handle minimum effect requirements", () => {
      const minimalTexts = ["Draw.", "Deal.", "Banish.", "Return.", "Choose."];

      minimalTexts.forEach((text) => {
        const result = parseActionText(text);
        expect(result.abilities).toBeDefined();
        expect(Array.isArray(result.abilities)).toBe(true);

        // Should handle gracefully even if incomplete
        expect(
          result.abilities.length +
            result.warnings.length +
            result.errors.length,
        ).toBeGreaterThan(0);
      });
    });

    it("should handle edge cases in number parsing", () => {
      const edgeNumbers = [
        "Deal 0 damage to chosen character",
        "Draw -1 cards",
        "Chosen character gets +0 {S}",
        "Deal 1.5 damage to chosen character",
        "Draw 2.0 cards",
      ];

      edgeNumbers.forEach((text) => {
        const result = parseActionText(text);
        expect(result.abilities).toBeDefined();
        expect(Array.isArray(result.abilities)).toBe(true);

        if (result.abilities.length > 0) {
          const effects = result.abilities.flatMap(
            (ability) => ability.effects || [],
          );
          effects.forEach((effect) => {
            if ("amount" in effect && effect.amount !== undefined) {
              // Should be a valid number or object
              expect(
                typeof effect.amount === "number" ||
                  typeof effect.amount === "object",
              ).toBe(true);

              if (typeof effect.amount === "number") {
                expect(Number.isFinite(effect.amount)).toBe(true);
              }
            }
          });
        }
      });
    });
  });

  describe("Recovery and Graceful Degradation", () => {
    it("should continue parsing after encountering errors", () => {
      const textWithErrors =
        "Invalid effect pattern. Draw a card. Another invalid pattern. Deal 2 damage to chosen character.";

      const result = parseActionText(textWithErrors);
      expect(result.abilities).toBeDefined();
      expect(Array.isArray(result.abilities)).toBe(true);

      // Should parse the valid parts
      const effects = result.abilities.flatMap(
        (ability) => ability.effects || [],
      );
      const hasDrawEffect = effects.some((effect) => effect.type === "draw");
      const hasDamageEffect = effects.some(
        (effect) => effect.type === "damage",
      );

      expect(hasDrawEffect || hasDamageEffect).toBe(true);
    });

    it("should provide partial results when possible", () => {
      const partiallyValidText =
        "Draw a card. Deal X damage to chosen character. Banish chosen character.";

      const result = parseActionText(partiallyValidText);
      expect(result.abilities).toBeDefined();
      expect(Array.isArray(result.abilities)).toBe(true);

      // Should parse what it can
      const effects = result.abilities.flatMap(
        (ability) => ability.effects || [],
      );
      expect(effects.length).toBeGreaterThan(0);

      // Should have warnings about the problematic parts
      if (effects.length < 3) {
        expect(result.warnings.length + result.errors.length).toBeGreaterThan(
          0,
        );
      }
    });

    it("should maintain parser state consistency after errors", () => {
      // Parse a problematic text first
      parseActionText("Invalid pattern that might corrupt state");

      // Then parse a valid text
      const result = parseActionText("Draw a card");

      expect(result.abilities).toBeDefined();
      expect(Array.isArray(result.abilities)).toBe(true);
      expect(result.abilities.length).toBeGreaterThan(0);

      const effects = result.abilities.flatMap(
        (ability) => ability.effects || [],
      );
      const drawEffect = effects.find((effect) => effect.type === "draw");
      expect(drawEffect).toBeDefined();
    });
  });

  describe("Specific Requirements 5.2 and 5.3 Tests", () => {
    describe("Requirement 5.2: Clear error messages for parsing failures", () => {
      it("should provide clear error messages for completely invalid input", () => {
        const invalidInputs = ["", null, undefined, "   ", "\n\t"];

        invalidInputs.forEach((input) => {
          const result = parseActionText(input as any);

          expect(result.errors.length).toBeGreaterThan(0);
          expect(result.errors[0]).toContain("Empty or invalid text provided");
          expect(result.errors[0]).toMatch(/empty|invalid|text|provided/i);
        });
      });

      it("should provide specific error messages for malformed effect patterns", () => {
        const malformedPatterns = [
          { text: "Deal damage to", shouldHaveIssues: true },
          { text: "Draw cards", shouldHaveIssues: true },
          { text: "Banish chosen", shouldHaveIssues: true },
          { text: "Choose one:", shouldHaveIssues: false }, // This actually works - creates modal
        ];

        malformedPatterns.forEach(({ text, shouldHaveIssues }) => {
          const result = parseActionText(text, { debug: true });

          if (shouldHaveIssues) {
            // Should have either errors or warnings about the malformed pattern
            const allMessages = [...result.errors, ...result.warnings];
            expect(allMessages.length).toBeGreaterThan(0);

            // Should indicate parsing issues
            const hasRelevantMessage = allMessages.some(
              (msg) =>
                msg.toLowerCase().includes("no clauses found") ||
                msg.toLowerCase().includes("no abilities") ||
                msg.toLowerCase().includes("failed to build") ||
                msg.toLowerCase().includes("requires target"),
            );
            expect(hasRelevantMessage).toBe(true);
          } else {
            // Should parse successfully
            expect(result.abilities.length).toBeGreaterThan(0);
          }
        });
      });

      it("should provide clear error messages for type validation failures", () => {
        // Test with invalid effect structures that would fail validation
        const result = parseActionText("Draw a card", { strictMode: true });

        // Force a validation error by modifying the result
        if (result.abilities.length > 0) {
          const invalidAbility = { ...result.abilities[0] };
          delete (invalidAbility as any).type;

          const { validateResolutionAbility } = require("../parser");
          const validation = validateResolutionAbility(invalidAbility);

          expect(validation.isValid).toBe(false);
          expect(validation.errors.length).toBeGreaterThan(0);
          expect(validation.errors[0]).toMatch(/type|missing|required/i);
        }
      });

      it("should provide detailed error context for parsing failures", () => {
        const complexFailureText =
          "Deal X damage to chosen character where X is the number of cards in your hand plus the lore value of chosen character";

        const result = parseActionText(complexFailureText, { debug: true });

        // This complex text actually parses successfully with X as a dynamic amount
        // So let's test with a truly unparseable pattern
        const unparseable =
          "Completely invalid syntax with no recognizable patterns at all";
        const unparseableResult = parseActionText(unparseable, { debug: true });

        // Should provide context about what couldn't be parsed
        const allMessages = [
          ...unparseableResult.errors,
          ...unparseableResult.warnings,
        ];
        expect(allMessages.length).toBeGreaterThan(0);

        // Messages should be informative
        allMessages.forEach((message) => {
          expect(typeof message).toBe("string");
          expect(message.length).toBeGreaterThan(10); // Not just empty or single word
        });
      });
    });

    describe("Requirement 5.3: Continue processing with unknown patterns", () => {
      it("should parse known patterns while warning about unknown ones", () => {
        const mixedTexts = [
          {
            text: "Draw a card. Summon a dragon. Deal 2 damage to chosen character.",
            expectedKnownEffects: ["draw", "damage"],
          },
          {
            text: "Transform chosen character into a frog. Banish chosen character.",
            expectedKnownEffects: ["banish"],
          },
          {
            text: "Create a token copy. Draw a card. Exile all permanents.",
            expectedKnownEffects: ["draw"],
          },
        ];

        mixedTexts.forEach(({ text, expectedKnownEffects }) => {
          const result = parseActionText(text, {
            debug: false,
            strictMode: false,
          });

          // Should continue processing and generate abilities for known patterns
          expect(result.abilities).toBeDefined();
          expect(Array.isArray(result.abilities)).toBe(true);

          // Should have found at least some known effects
          const allEffects = result.abilities.flatMap(
            (ability) => ability.effects || [],
          );
          const foundEffectTypes = allEffects.map((effect) => effect.type);

          const hasExpectedEffects = expectedKnownEffects.some(
            (expectedType: string) =>
              foundEffectTypes.includes(expectedType as any),
          );

          // Should either parse known effects or provide appropriate feedback
          if (allEffects.length > 0) {
            expect(hasExpectedEffects).toBe(true);
          } else {
            // If no effects parsed, should have warnings
            expect(
              result.warnings.length + result.errors.length,
            ).toBeGreaterThan(0);
          }
        });
      });

      it("should log warnings but not errors for unknown patterns", () => {
        const unknownPatterns = [
          "Summon a creature from the void",
          "Transform chosen character into a frog",
          "Exile all cards permanently",
          "Create a token copy of chosen character",
        ];

        unknownPatterns.forEach((text) => {
          const result = parseActionText(text, { strictMode: false });

          // Should not have critical errors that stop processing
          expect(result.abilities).toBeDefined();
          expect(Array.isArray(result.abilities)).toBe(true);

          // Should provide feedback about unknown patterns
          // Either through warnings or by having no abilities generated
          const hasAppropriateResponse =
            result.warnings.length > 0 || result.abilities.length === 0;
          expect(hasAppropriateResponse).toBe(true);

          // If there are warnings, they should be informative
          if (result.warnings.length > 0) {
            const hasRelevantWarning = result.warnings.some(
              (warning) =>
                warning.toLowerCase().includes("no clauses found") ||
                warning.toLowerCase().includes("no abilities") ||
                warning.toLowerCase().includes("unknown") ||
                warning.toLowerCase().includes("not recognized"),
            );
            expect(hasRelevantWarning).toBe(true);
          }
        });
      });

      it("should maintain parser state when encountering unknown patterns", () => {
        // Parse unknown pattern first
        const unknownResult = parseActionText("Summon a dragon from the void");
        expect(unknownResult.abilities).toBeDefined();

        // Then parse a known pattern - should work normally
        const knownResult = parseActionText("Draw a card");
        expect(knownResult.abilities).toBeDefined();
        expect(knownResult.abilities.length).toBeGreaterThan(0);

        const effects = knownResult.abilities.flatMap(
          (ability) => ability.effects || [],
        );
        const hasDrawEffect = effects.some((effect) => effect.type === "draw");
        expect(hasDrawEffect).toBe(true);
      });

      it("should provide progressive parsing with partial failures", () => {
        const partiallyValidTexts = [
          "Draw a card. Invalid pattern here. Deal 2 damage to chosen character.",
          "Unknown effect. Banish chosen character. Another unknown effect.",
          "Transform something. Draw a card. Create tokens. Deal 1 damage to chosen character.",
        ];

        partiallyValidTexts.forEach((text) => {
          const result = parseActionText(text, { strictMode: false });

          expect(result.abilities).toBeDefined();
          expect(Array.isArray(result.abilities)).toBe(true);

          // Should parse what it can
          const allEffects = result.abilities.flatMap(
            (ability) => ability.effects || [],
          );
          const knownEffectTypes = [
            "draw",
            "damage",
            "banish",
            "attribute",
            "move",
          ];
          const hasKnownEffects = allEffects.some((effect) =>
            knownEffectTypes.includes(effect.type),
          );

          // Should either have known effects or appropriate warnings
          if (!hasKnownEffects) {
            expect(result.warnings.length).toBeGreaterThan(0);
          }
        });
      });
    });
  });

  describe("Partial Parsing Scenarios", () => {
    it("should handle partial effect parsing with missing components", () => {
      const partialEffects = [
        { text: "Deal damage", expectedPartial: true },
        { text: "Draw", expectedPartial: true },
        { text: "Banish", expectedPartial: true },
        { text: "Choose", expectedPartial: true },
        { text: "Return to", expectedPartial: true },
      ];

      partialEffects.forEach(({ text, expectedPartial }) => {
        const result = parseActionText(text);

        expect(result.abilities).toBeDefined();
        expect(Array.isArray(result.abilities)).toBe(true);

        // Should provide feedback about partial parsing
        if (expectedPartial) {
          expect(result.warnings.length + result.errors.length).toBeGreaterThan(
            0,
          );
        }
      });
    });

    it("should handle partial clause parsing with incomplete sentences", () => {
      const incompleteSentences = [
        "Draw a card, then",
        "If you have a character in play, then",
        "Choose one: Draw a card or",
        "At the end of your turn,",
        "When this card enters play,",
      ];

      incompleteSentences.forEach((text) => {
        const result = parseActionText(text);

        expect(result.abilities).toBeDefined();
        expect(Array.isArray(result.abilities)).toBe(true);

        // Should handle incomplete sentences gracefully
        expect(result.clauses).toBeDefined();
        expect(Array.isArray(result.clauses)).toBe(true);

        // Should provide appropriate feedback
        expect(
          result.abilities.length +
            result.warnings.length +
            result.errors.length,
        ).toBeGreaterThan(0);
      });
    });

    it("should handle partial target parsing", () => {
      const partialTargets = [
        "Deal 2 damage to chosen",
        "Banish chosen character of",
        "Return chosen character to",
        "Each opponent",
        "Your characters",
      ];

      partialTargets.forEach((text) => {
        const result = parseActionText(text);

        expect(result.abilities).toBeDefined();
        expect(Array.isArray(result.abilities)).toBe(true);

        // Should attempt to parse what it can
        const allEffects = result.abilities.flatMap(
          (ability) => ability.effects || [],
        );

        // Should provide feedback about parsing issues
        if (allEffects.length === 0) {
          expect(result.warnings.length + result.errors.length).toBeGreaterThan(
            0,
          );
        }
      });
    });

    it("should handle partial modal parsing", () => {
      const partialModals = [
        "Choose one:",
        "Choose one: Draw a card",
        "Choose one: Draw a card or",
        "Select one:",
        "Pick one: Deal damage",
      ];

      partialModals.forEach((text) => {
        const result = parseActionText(text);

        expect(result.abilities).toBeDefined();
        expect(Array.isArray(result.abilities)).toBe(true);

        // Should handle partial modal patterns
        expect(result.clauses).toBeDefined();

        // Should provide appropriate feedback for incomplete modals
        if (result.abilities.length === 0) {
          expect(result.warnings.length + result.errors.length).toBeGreaterThan(
            0,
          );
        }
      });
    });
  });

  describe("Additional Edge Cases", () => {
    it("should handle text with only punctuation", () => {
      const punctuationOnly = ["...", "!!!", "???", ";;;", ",,,"];

      punctuationOnly.forEach((text) => {
        const result = parseActionText(text);
        expect(result.abilities).toBeDefined();
        expect(Array.isArray(result.abilities)).toBe(true);

        // Should handle gracefully - either generate abilities or provide feedback
        expect(
          result.abilities.length +
            result.warnings.length +
            result.errors.length,
        ).toBeGreaterThan(0);
      });
    });

    it("should handle text with mixed languages", () => {
      const mixedLanguageTexts = [
        "Draw una carta",
        "Deal 2 damage à chosen character",
        "Banish 選択されたキャラクター",
        "Pioche une carte et inflige 1 dégât",
      ];

      mixedLanguageTexts.forEach((text) => {
        const result = parseActionText(text);
        expect(result.abilities).toBeDefined();
        expect(Array.isArray(result.abilities)).toBe(true);

        // Should handle gracefully even if not fully understood
        expect(
          result.abilities.length +
            result.warnings.length +
            result.errors.length,
        ).toBeGreaterThan(0);
      });
    });

    it("should handle extremely nested conditional structures", () => {
      const deeplyNested =
        "If you have a character in play, then if that character has Bodyguard, " +
        "then if it's your turn, then if you have ink available, then if the " +
        "opponent has characters in play, then draw a card.";

      const result = parseActionText(deeplyNested);
      expect(result.abilities).toBeDefined();
      expect(Array.isArray(result.abilities)).toBe(true);

      // Should not cause infinite recursion or stack overflow
      expect(result.clauses.length).toBeGreaterThan(0);
    });

    it("should handle text with HTML/XML-like tags", () => {
      const htmlLikeTexts = [
        "Draw <b>a card</b>",
        "Deal 2 damage to <i>chosen character</i>",
        "Banish <strong>chosen character</strong>",
        "<effect>Draw a card</effect>",
      ];

      htmlLikeTexts.forEach((text) => {
        const result = parseActionText(text);
        expect(result.abilities).toBeDefined();
        expect(Array.isArray(result.abilities)).toBe(true);

        // Should strip or handle HTML-like tags gracefully
        expect(
          result.abilities.length +
            result.warnings.length +
            result.errors.length,
        ).toBeGreaterThan(0);
      });
    });

    it("should handle text with escape sequences", () => {
      const escapeSequenceTexts = [
        "Draw a card\\nDeal 1 damage",
        "Effect with \\t tab character",
        'Text with \\" escaped quotes',
        "Backslash \\\\ in text",
      ];

      escapeSequenceTexts.forEach((text) => {
        const result = parseActionText(text);
        expect(result.abilities).toBeDefined();
        expect(Array.isArray(result.abilities)).toBe(true);

        // Should handle escape sequences appropriately
        expect(
          result.abilities.length +
            result.warnings.length +
            result.errors.length,
        ).toBeGreaterThan(0);
      });
    });

    it("should handle text with mathematical expressions", () => {
      const mathExpressions = [
        "Deal (2+3) damage to chosen character",
        "Draw X*2 cards where X is 1",
        "Gain +√4 {S} this turn",
        "Deal π damage (rounded down)",
      ];

      mathExpressions.forEach((text) => {
        const result = parseActionText(text);
        expect(result.abilities).toBeDefined();
        expect(Array.isArray(result.abilities)).toBe(true);

        // Should handle mathematical expressions gracefully
        expect(
          result.abilities.length +
            result.warnings.length +
            result.errors.length,
        ).toBeGreaterThan(0);
      });
    });

    it("should handle text with regex-breaking characters", () => {
      const regexBreakingTexts = [
        "Draw a card.*+?",
        "Deal [2] damage to (chosen) character",
        "Effect with {unclosed brace",
        "Text with |pipe| characters",
        "Pattern with ^start and end$",
      ];

      regexBreakingTexts.forEach((text) => {
        expect(() => parseActionText(text)).not.toThrow();

        const result = parseActionText(text);
        expect(result.abilities).toBeDefined();
        expect(Array.isArray(result.abilities)).toBe(true);
      });
    });

    it("should handle extremely long single words", () => {
      const longWord = "a".repeat(1000);
      const textWithLongWord = `Draw ${longWord} card`;

      const result = parseActionText(textWithLongWord);
      expect(result.abilities).toBeDefined();
      expect(Array.isArray(result.abilities)).toBe(true);

      // Should handle without performance issues
      expect(
        result.abilities.length + result.warnings.length + result.errors.length,
      ).toBeGreaterThan(0);
    });

    it("should handle text with only numbers", () => {
      const numberOnlyTexts = ["123", "0", "-5", "3.14", "1,000"];

      numberOnlyTexts.forEach((text) => {
        const result = parseActionText(text);
        expect(result.abilities).toBeDefined();
        expect(Array.isArray(result.abilities)).toBe(true);

        // Should handle gracefully - either generate abilities or provide feedback
        expect(
          result.abilities.length +
            result.warnings.length +
            result.errors.length,
        ).toBeGreaterThan(0);
      });
    });

    it("should handle text with control characters", () => {
      const controlCharTexts = [
        "Draw a card\x00with null",
        "Effect\x01with control char",
        "Text\x1Fwith unit separator",
        "Draw\x7Fa card with DEL",
      ];

      controlCharTexts.forEach((text) => {
        expect(() => parseActionText(text)).not.toThrow();

        const result = parseActionText(text);
        expect(result.abilities).toBeDefined();
        expect(Array.isArray(result.abilities)).toBe(true);
      });
    });
  });

  describe("Validation Function Edge Cases", () => {
    it("should handle validation of malformed ParsedEffect objects", () => {
      const { validateParsedEffect } = require("../parser");

      const malformedEffects = [
        null,
        undefined,
        {},
        { type: null },
        { type: "draw", parameters: null },
        { type: "damage", amount: "invalid", parameters: {} },
        { type: "attribute", parameters: { attribute: "invalid_attribute" } },
        { type: "unknown_type", parameters: {} },
      ];

      malformedEffects.forEach((effect) => {
        const result = validateParsedEffect(effect as any);

        if (
          effect === null ||
          effect === undefined ||
          typeof effect !== "object"
        ) {
          expect(result.isValid).toBe(false);
          expect(result.errors.length).toBeGreaterThan(0);
        } else {
          // Should handle gracefully and provide specific error messages
          expect(result.errors).toBeDefined();
          expect(Array.isArray(result.errors)).toBe(true);
        }
      });
    });

    it("should handle validation of malformed ParsedClause objects", () => {
      const { validateParsedClause } = require("../parser");

      const malformedClauses = [
        null,
        undefined,
        {},
        { text: null, type: "effect", effects: [] },
        { text: "test", type: "invalid_type", effects: [] },
        { text: "test", type: "effect", effects: null },
        { text: "test", type: "effect", effects: [{ type: "invalid" }] },
      ];

      malformedClauses.forEach((clause) => {
        const result = validateParsedClause(clause as any);

        if (
          clause === null ||
          clause === undefined ||
          typeof clause !== "object"
        ) {
          expect(result.isValid).toBe(false);
          expect(result.errors.length).toBeGreaterThan(0);
        } else {
          // Should handle gracefully and provide specific error messages
          expect(result.errors).toBeDefined();
          expect(Array.isArray(result.errors)).toBe(true);
        }
      });
    });

    it("should handle validation of malformed ResolutionAbility objects", () => {
      const { validateResolutionAbility } = require("../parser");

      const malformedAbilities = [
        null,
        undefined,
        {},
        { type: "invalid" },
        { type: "resolution", effects: null },
        { type: "resolution", effects: [null] },
        { type: "resolution", effects: [{ type: "damage" }] }, // Missing required properties
      ];

      malformedAbilities.forEach((ability) => {
        const result = validateResolutionAbility(ability as any);

        if (
          ability === null ||
          ability === undefined ||
          typeof ability !== "object"
        ) {
          expect(result.isValid).toBe(false);
          expect(result.errors.length).toBeGreaterThan(0);
        } else {
          // Should handle gracefully and provide specific error messages
          expect(result.errors).toBeDefined();
          expect(Array.isArray(result.errors)).toBe(true);
          expect(result.warnings).toBeDefined();
          expect(Array.isArray(result.warnings)).toBe(true);
        }
      });
    });
  });

  describe("Text Normalization Edge Cases", () => {
    it("should handle extreme text normalization scenarios", () => {
      const { normalizeText, validateTextFormat } = require("../parser");

      const extremeTexts = [
        "",
        "   ",
        "\n\n\n",
        "\t\t\t",
        "a".repeat(10000), // Very long text
        "Draw    a     card    with    excessive    spacing",
        "Text...with...excessive...punctuation!!!???",
        "MiXeD cAsE tExT tHaT nEeDs NoRmAlIzAtIoN",
        "{INVALID_SYMBOL} with {S} valid symbol",
        "Text with\x00null\x01control\x1Fcharacters",
      ];

      extremeTexts.forEach((text) => {
        expect(() => normalizeText(text)).not.toThrow();
        expect(() => validateTextFormat(text)).not.toThrow();

        const normalized = normalizeText(text);
        expect(typeof normalized).toBe("string");

        const validation = validateTextFormat(text);
        expect(validation).toHaveProperty("isValid");
        expect(validation).toHaveProperty("issues");
        expect(validation).toHaveProperty("symbols");
      });
    });

    it("should handle text structure analysis edge cases", () => {
      const { analyzeTextStructure } = require("../parser");

      const complexStructures = [
        "",
        "Single word",
        "If you have a character, then if that character has Bodyguard, then if it's your turn, then if you have ink, then draw a card.",
        "Choose one: Draw a card or deal damage or banish character or return to hand or gain lore.",
        "When this enters play, if you control a character, then at the end of your turn, draw a card.",
        "Text with multiple... sentences! Each with different? punctuation patterns.",
      ];

      complexStructures.forEach((text) => {
        expect(() => analyzeTextStructure(text)).not.toThrow();

        const analysis = analyzeTextStructure(text);
        expect(analysis).toHaveProperty("sentences");
        expect(analysis).toHaveProperty("clauses");
        expect(analysis).toHaveProperty("modalInfo");
        expect(analysis).toHaveProperty("conditionalInfo");
        expect(analysis).toHaveProperty("timingInfo");
        expect(analysis).toHaveProperty("isComplex");

        expect(Array.isArray(analysis.sentences)).toBe(true);
        expect(Array.isArray(analysis.clauses)).toBe(true);
      });
    });
  });

  describe("Parser State and Memory Management", () => {
    it("should handle rapid successive parsing calls", () => {
      const texts = [
        "Draw a card",
        "Deal 2 damage to chosen character",
        "Banish chosen character",
        "Invalid pattern here",
        "Choose one: Draw a card or deal damage",
      ];

      // Rapid successive calls
      for (let i = 0; i < 100; i++) {
        const text = texts[i % texts.length];
        const result = parseActionText(text || "");

        expect(result).toBeDefined();
        expect(result.abilities).toBeDefined();
        expect(Array.isArray(result.abilities)).toBe(true);
        expect(Array.isArray(result.warnings)).toBe(true);
        expect(Array.isArray(result.errors)).toBe(true);
        expect(Array.isArray(result.clauses)).toBe(true);
      }
    });

    it("should handle parser with different configurations", () => {
      const text = "Draw a card. Deal 2 damage to chosen character.";
      const configs = [
        {},
        { debug: true },
        { strictMode: true },
        { debug: true, strictMode: true },
        { debug: false, strictMode: false },
        { matchThreshold: 0.5 },
        { customPatterns: {} },
      ];

      configs.forEach((config) => {
        expect(() => parseActionText(text, config)).not.toThrow();

        const result = parseActionText(text, config);
        expect(result).toBeDefined();
        expect(result.abilities).toBeDefined();
        expect(Array.isArray(result.abilities)).toBe(true);
      });
    });

    it("should maintain consistent results across multiple calls", () => {
      const text = "Draw a card. Deal 2 damage to chosen character.";

      const results = [];
      for (let i = 0; i < 10; i++) {
        results.push(parseActionText(text));
      }

      // All results should be consistent
      const firstResult = results[0];
      if (firstResult) {
        results.forEach((result, index) => {
          expect(result.abilities.length).toBe(firstResult.abilities.length);
          expect(result.errors.length).toBe(firstResult.errors.length);
          expect(result.warnings.length).toBe(firstResult.warnings.length);
          expect(result.clauses.length).toBe(firstResult.clauses.length);
        });
      }
    });
  });
});
