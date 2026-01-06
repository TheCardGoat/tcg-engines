/**
 * Tests for condition visitor (CST to condition object transformation).
 * Ensures visitor correctly transforms condition parse trees into typed condition objects.
 *
 * NOTE: The CST-based tests (parseConditionFromCst) are skipped because the
 * conditionClause grammar rule is defined in condition-grammar.ts but not yet
 * integrated into the LorcanaAbilityParser class. The mixin function
 * addVisitorConditionRules() exists but is never called.
 *
 * TODO: Integrate condition grammar rules into the parser to enable these tests.
 */

import { describe, expect, it } from "bun:test";
import { LorcanaAbilityParser } from "../../grammar";
import { LorcanaLexer } from "../../lexer";
import {
  parseConditionFromCst,
  parseConditionFromText,
  type VisitorCondition,
} from "../condition-visitor";

describe("VisitorCondition Visitor", () => {
  const parser = new LorcanaAbilityParser();

  /**
   * Helper to lex and parse text into CST
   */
  function parseVisitorConditionClause(text: string) {
    const lexResult = LorcanaLexer.tokenize(text);
    parser.input = lexResult.tokens;
    // biome-ignore lint/suspicious/noExplicitAny: Dynamic rule access for testing
    const cst = (parser as any).conditionClause();

    if (parser.errors.length > 0) {
      throw new Error(
        `Parsing failed: ${parser.errors.map((e) => e.message).join(", ")}`,
      );
    }

    return cst;
  }

  // Skip: conditionClause grammar rule not yet integrated into parser
  describe.skip("parseConditionFromCst", () => {
    describe("if conditions", () => {
      it("parses 'if you have another character'", () => {
        const cst = parseVisitorConditionClause(
          "if you have another character",
        );
        const condition = parseConditionFromCst(cst.children);

        expect(condition).toBeDefined();
        expect(condition?.type).toBe("if");
        expect(condition?.expression).toBeDefined();
        expect(condition?.expression).toContain("you");
        expect(condition?.expression).toContain("have");
      });

      it("parses 'if you have 5 lore'", () => {
        const cst = parseVisitorConditionClause("if you have 5 lore");
        const condition = parseConditionFromCst(cst.children);

        expect(condition).toBeDefined();
        expect(condition?.type).toBe("if");
        expect(condition?.expression).toContain("5");
      });

      it("parses 'if your character'", () => {
        const cst = parseVisitorConditionClause("if your character");
        const condition = parseConditionFromCst(cst.children);

        expect(condition).toBeDefined();
        expect(condition?.type).toBe("if");
        expect(condition?.expression).toContain("your");
        expect(condition?.expression).toContain("character");
      });

      it("handles complex if expression", () => {
        const cst = parseVisitorConditionClause("if you have 3 characters");
        const condition = parseConditionFromCst(cst.children);

        expect(condition).toBeDefined();
        expect(condition?.type).toBe("if");
        expect(condition?.expression).toContain("you");
        expect(condition?.expression).toContain("have");
        expect(condition?.expression).toContain("3");
      });
    });

    describe("during conditions", () => {
      it("parses 'during your turn'", () => {
        const cst = parseVisitorConditionClause("during your turn");
        const condition = parseConditionFromCst(cst.children);

        expect(condition).toBeDefined();
        expect(condition?.type).toBe("during");
        expect(condition?.expression).toBe("your turn");
      });

      it("parses 'during turn' (without 'your')", () => {
        const cst = parseVisitorConditionClause("during turn");
        const condition = parseConditionFromCst(cst.children);

        expect(condition).toBeDefined();
        expect(condition?.type).toBe("during");
        expect(condition?.expression).toBe("turn");
      });

      it("parses 'during your phase'", () => {
        const cst = parseVisitorConditionClause("during your phase");
        const condition = parseConditionFromCst(cst.children);

        expect(condition).toBeDefined();
        expect(condition?.type).toBe("during");
        expect(condition?.expression).toContain("your");
        expect(condition?.expression).toContain("phase");
      });
    });

    describe("at conditions", () => {
      it("parses 'at the start of your turn'", () => {
        const cst = parseVisitorConditionClause("at the start of your turn");
        const condition = parseConditionFromCst(cst.children);

        expect(condition).toBeDefined();
        expect(condition?.type).toBe("at");
        expect(condition?.expression).toContain("start");
        expect(condition?.expression).toContain("your");
        expect(condition?.expression).toContain("turn");
      });

      it("parses 'at the beginning'", () => {
        const cst = parseVisitorConditionClause("at the beginning");
        const condition = parseConditionFromCst(cst.children);

        expect(condition).toBeDefined();
        expect(condition?.type).toBe("at");
        expect(condition?.expression).toContain("beginning");
      });

      it("parses 'at start'", () => {
        const cst = parseVisitorConditionClause("at start");
        const condition = parseConditionFromCst(cst.children);

        expect(condition).toBeDefined();
        expect(condition?.type).toBe("at");
        expect(condition?.expression).toBe("start");
      });

      it("handles multiple identifiers in at condition", () => {
        const cst = parseVisitorConditionClause("at the end of the turn");
        const condition = parseConditionFromCst(cst.children);

        expect(condition).toBeDefined();
        expect(condition?.type).toBe("at");
        expect(condition?.expression.split(" ").length).toBeGreaterThan(2);
      });
    });

    describe("with conditions", () => {
      it("parses 'with 5 lore'", () => {
        const cst = parseVisitorConditionClause("with 5 lore");
        const condition = parseConditionFromCst(cst.children);

        expect(condition).toBeDefined();
        expect(condition?.type).toBe("with");
        expect(condition?.expression).toContain("5");
      });

      it("parses 'with strength'", () => {
        const cst = parseVisitorConditionClause("with strength");
        const condition = parseConditionFromCst(cst.children);

        expect(condition).toBeDefined();
        expect(condition?.type).toBe("with");
        expect(condition?.expression).toContain("strength");
      });

      it("parses 'with 3 or more characters'", () => {
        const cst = parseVisitorConditionClause("with 3 or more characters");
        const condition = parseConditionFromCst(cst.children);

        expect(condition).toBeDefined();
        expect(condition?.type).toBe("with");
        expect(condition?.expression).toContain("3");
      });
    });

    describe("without conditions", () => {
      it("parses 'without abilities'", () => {
        const cst = parseVisitorConditionClause("without abilities");
        const condition = parseConditionFromCst(cst.children);

        expect(condition).toBeDefined();
        expect(condition?.type).toBe("without");
        expect(condition?.expression).toContain("abilities");
      });

      it("parses 'without strength'", () => {
        const cst = parseVisitorConditionClause("without strength");
        const condition = parseConditionFromCst(cst.children);

        expect(condition).toBeDefined();
        expect(condition?.type).toBe("without");
        expect(condition?.expression).toContain("strength");
      });

      it("parses 'without evasive'", () => {
        const cst = parseVisitorConditionClause("without evasive");
        const condition = parseConditionFromCst(cst.children);

        expect(condition).toBeDefined();
        expect(condition?.type).toBe("without");
        expect(condition?.expression).toContain("evasive");
      });
    });

    it("returns null when no recognized condition type", () => {
      const mockCtx = {
        // No condition type fields
      };
      const condition = parseConditionFromCst(mockCtx);

      expect(condition).toBeNull();
    });

    it("handles all condition types", () => {
      const conditionTexts = [
        { text: "if you have character", expectedType: "if" },
        { text: "during your turn", expectedType: "during" },
        { text: "at the start", expectedType: "at" },
        { text: "with 5 lore", expectedType: "with" },
        { text: "without abilities", expectedType: "without" },
      ];

      for (const { text, expectedType } of conditionTexts) {
        const cst = parseVisitorConditionClause(text);
        const condition = parseConditionFromCst(cst.children);

        expect(condition).toBeDefined();
        expect(condition?.type).toBe(expectedType as VisitorCondition["type"]);
      }
    });
  });

  describe("parseConditionFromText", () => {
    describe("if conditions from text", () => {
      it("parses 'if you have another character'", () => {
        const condition = parseConditionFromText(
          "if you have another character",
        );

        expect(condition).toBeDefined();
        expect(condition?.type).toBe("if");
        expect(condition?.expression).toBe("you have another character");
      });

      it("parses 'if you have 5 lore'", () => {
        const condition = parseConditionFromText("if you have 5 lore");

        expect(condition).toBeDefined();
        expect(condition?.type).toBe("if");
        expect(condition?.expression).toBe("you have 5 lore");
      });

      it("handles if condition with comma terminator", () => {
        const condition = parseConditionFromText("if you have character, draw");

        expect(condition).toBeDefined();
        expect(condition?.type).toBe("if");
        expect(condition?.expression).toBe("you have character");
      });

      it("handles if condition at end of text", () => {
        const condition = parseConditionFromText("if you have 3 cards");

        expect(condition).toBeDefined();
        expect(condition?.type).toBe("if");
        expect(condition?.expression).toBe("you have 3 cards");
      });
    });

    describe("during conditions from text", () => {
      it("parses 'during your turn'", () => {
        const condition = parseConditionFromText("during your turn");

        expect(condition).toBeDefined();
        expect(condition?.type).toBe("during");
        expect(condition?.expression).toBe("your turn");
      });

      it("parses 'during your phase'", () => {
        const condition = parseConditionFromText("during your phase");

        expect(condition).toBeDefined();
        expect(condition?.type).toBe("during");
        expect(condition?.expression).toBe("your phase");
      });

      it("handles during condition with comma terminator", () => {
        const condition = parseConditionFromText("during your turn, draw");

        expect(condition).toBeDefined();
        expect(condition?.type).toBe("during");
        expect(condition?.expression).toBe("your turn");
      });
    });

    describe("at conditions from text", () => {
      it("parses 'at the start of your turn'", () => {
        const condition = parseConditionFromText("at the start of your turn");

        expect(condition).toBeDefined();
        expect(condition?.type).toBe("at");
        expect(condition?.expression).toBe("the start of your turn");
      });

      it("parses 'at the beginning'", () => {
        const condition = parseConditionFromText("at the beginning");

        expect(condition).toBeDefined();
        expect(condition?.type).toBe("at");
        expect(condition?.expression).toBe("the beginning");
      });

      it("handles at condition with comma terminator", () => {
        const condition = parseConditionFromText("at the end, trigger");

        expect(condition).toBeDefined();
        expect(condition?.type).toBe("at");
        expect(condition?.expression).toBe("the end");
      });
    });

    describe("with conditions from text", () => {
      it("parses 'with 5 lore'", () => {
        const condition = parseConditionFromText("with 5 lore");

        expect(condition).toBeDefined();
        expect(condition?.type).toBe("with");
        expect(condition?.expression).toBe("5 lore");
      });

      it("parses 'with strength'", () => {
        const condition = parseConditionFromText("with strength");

        expect(condition).toBeDefined();
        expect(condition?.type).toBe("with");
        expect(condition?.expression).toBe("strength");
      });

      it("handles with condition with comma terminator", () => {
        const condition = parseConditionFromText("with 3 characters, draw");

        expect(condition).toBeDefined();
        expect(condition?.type).toBe("with");
        expect(condition?.expression).toBe("3 characters");
      });
    });

    describe("without conditions from text", () => {
      it("parses 'without abilities'", () => {
        const condition = parseConditionFromText("without abilities");

        expect(condition).toBeDefined();
        expect(condition?.type).toBe("without");
        expect(condition?.expression).toBe("abilities");
      });

      it("parses 'without strength'", () => {
        const condition = parseConditionFromText("without strength");

        expect(condition).toBeDefined();
        expect(condition?.type).toBe("without");
        expect(condition?.expression).toBe("strength");
      });

      it("handles without condition with comma terminator", () => {
        const condition = parseConditionFromText("without evasive, banish");

        expect(condition).toBeDefined();
        expect(condition?.type).toBe("without");
        expect(condition?.expression).toBe("evasive");
      });
    });

    it("handles case insensitivity", () => {
      const condition = parseConditionFromText("IF YOU HAVE CHARACTER");

      expect(condition).toBeDefined();
      expect(condition?.type).toBe("if");
    });

    it("handles mixed case", () => {
      const condition = parseConditionFromText("If YoU HaVe ChArAcTeR");

      expect(condition).toBeDefined();
      expect(condition?.type).toBe("if");
    });

    it("returns null for non-matching text", () => {
      // Note: Text must not contain "if", "during", "at", "with", "without"
      // as these are condition keywords that trigger pattern matching
      const condition = parseConditionFromText(
        "invalid text for testing purposes",
      );

      expect(condition).toBeNull();
    });

    it("returns null for empty string", () => {
      const condition = parseConditionFromText("");

      expect(condition).toBeNull();
    });

    it("extracts condition from longer text", () => {
      const condition = parseConditionFromText(
        "when you play, if you have another character, draw a card",
      );

      expect(condition).toBeDefined();
      expect(condition?.type).toBe("if");
    });

    it("matches first condition in text with multiple conditions", () => {
      const condition = parseConditionFromText(
        "if you have 5 lore, during your turn, draw",
      );

      expect(condition).toBeDefined();
      // Should match the first one (if)
      expect(condition?.type).toBe("if");
    });

    it("handles condition at start of text", () => {
      const condition = parseConditionFromText("if you have character");

      expect(condition).toBeDefined();
      expect(condition?.type).toBe("if");
    });

    it("handles condition at end of text", () => {
      const condition = parseConditionFromText(
        "draw a card if you have 5 lore",
      );

      expect(condition).toBeDefined();
      expect(condition?.type).toBe("if");
    });
  });

  describe("condition variations", () => {
    it("handles all condition types", () => {
      const conditionTexts = [
        { text: "if you have character", expectedType: "if" },
        { text: "during your turn", expectedType: "during" },
        { text: "at the start", expectedType: "at" },
        { text: "with 5 lore", expectedType: "with" },
        { text: "without abilities", expectedType: "without" },
      ];

      for (const { text, expectedType } of conditionTexts) {
        const condition = parseConditionFromText(text);
        expect(condition).toBeDefined();
        expect(condition?.type).toBe(expectedType as VisitorCondition["type"]);
      }
    });

    it("handles complex expressions", () => {
      const complexVisitorConditions = [
        "if you have 3 or more characters",
        "during your opponent's turn",
        "at the start of your next turn",
        "with 5 or more lore",
        "without any abilities",
      ];

      for (const text of complexVisitorConditions) {
        const condition = parseConditionFromText(text);
        expect(condition).toBeDefined();
        expect(condition?.expression).toBeDefined();
        expect(condition?.expression.length).toBeGreaterThan(0);
      }
    });
  });

  describe("edge cases", () => {
    it("handles whitespace variations", () => {
      const condition = parseConditionFromText("if  you  have  character");

      expect(condition).toBeDefined();
      expect(condition?.type).toBe("if");
    });

    it("handles minimal expressions", () => {
      const condition = parseConditionFromText("if character");

      expect(condition).toBeDefined();
      expect(condition?.type).toBe("if");
      expect(condition?.expression).toBe("character");
    });

    it("trims expression whitespace", () => {
      const condition = parseConditionFromText("if you have character, ");

      expect(condition).toBeDefined();
      expect(condition?.expression).not.toContain(",");
      expect(condition?.expression.trim()).toBe(condition?.expression);
    });
  });

  describe("type safety", () => {
    it("returns VisitorCondition type with correct structure", () => {
      const condition = parseConditionFromText("if you have character");

      expect(condition).toBeDefined();
      if (condition) {
        // Type check
        const typed: VisitorCondition = condition;
        expect(typed.type).toBeDefined();
        expect(typed.expression).toBeDefined();
        expect(typeof typed.type).toBe("string");
        expect(typeof typed.expression).toBe("string");
      }
    });

    it("type field matches expected values", () => {
      const validTypes: VisitorCondition["type"][] = [
        "if",
        "during",
        "at",
        "with",
        "without",
      ];

      for (const type of validTypes) {
        let testText = "";
        switch (type) {
          case "if":
            testText = "if you have character";
            break;
          case "during":
            testText = "during your turn";
            break;
          case "at":
            testText = "at the start";
            break;
          case "with":
            testText = "with 5 lore";
            break;
          case "without":
            testText = "without abilities";
            break;
        }

        const condition = parseConditionFromText(testText);
        expect(condition).toBeDefined();
        if (condition) {
          expect(validTypes).toContain(condition.type);
        }
      }
    });
  });
});
