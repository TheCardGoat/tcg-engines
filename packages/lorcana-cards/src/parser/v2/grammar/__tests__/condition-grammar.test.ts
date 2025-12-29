/**
 * Tests for condition grammar parsing.
 * Ensures condition-related grammar rules correctly parse condition phrases.
 *
 * NOTE: These tests are skipped because the conditionClause grammar rule
 * is defined in condition-grammar.ts but not yet integrated into the
 * LorcanaAbilityParser class. The mixin function addConditionRules() exists
 * but is never called.
 *
 * TODO: Integrate condition grammar rules into the parser to enable these tests.
 */

import { describe, expect, it } from "bun:test";
import { LorcanaLexer } from "../../lexer";
import { LorcanaAbilityParser } from "../ability-grammar";

// Skip: conditionClause grammar rule not yet integrated into parser
describe.skip("Condition Grammar", () => {
  const parser = new LorcanaAbilityParser();

  /**
   * Helper function to lex and parse text with a specific rule.
   * Note: Rule names are passed as strings because condition rules
   * are not yet wired into the parser class.
   */
  function parseText(text: string, rule: string) {
    const lexResult = LorcanaLexer.tokenize(text);
    parser.input = lexResult.tokens;
    // biome-ignore lint/suspicious/noExplicitAny: Dynamic rule access for testing
    const cst = (parser as any)[rule]();
    return {
      cst,
      errors: parser.errors,
      lexErrors: lexResult.errors,
    };
  }

  describe("conditionClause rule", () => {
    it("parses 'if' condition", () => {
      const result = parseText(
        "if you have another character",
        "conditionClause",
      );

      expect(result.errors).toHaveLength(0);
      expect(result.lexErrors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.ifCondition).toBeDefined();
    });

    it("parses 'during' condition", () => {
      const result = parseText("during your turn", "conditionClause");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.duringCondition).toBeDefined();
    });

    it("parses 'at' condition", () => {
      const result = parseText("at the start of your turn", "conditionClause");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.atCondition).toBeDefined();
    });

    it("parses 'with' condition", () => {
      const result = parseText("with 5 lore", "conditionClause");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.withCondition).toBeDefined();
    });

    it("parses 'without' condition", () => {
      const result = parseText("without abilities", "conditionClause");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.withoutCondition).toBeDefined();
    });

    it("handles case insensitivity", () => {
      const result = parseText("IF YOU HAVE CHARACTER", "conditionClause");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
    });
  });

  describe("ifCondition rule", () => {
    it("parses 'if you have another character'", () => {
      const result = parseText("if you have another character", "ifCondition");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.If).toBeDefined();
      expect(result.cst.children.conditionExpression).toBeDefined();
    });

    it("parses 'if you have 5 lore'", () => {
      const result = parseText("if you have 5 lore", "ifCondition");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.conditionExpression).toBeDefined();
    });

    it("parses 'if your character'", () => {
      const result = parseText("if your character", "ifCondition");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
    });

    it("handles case insensitivity", () => {
      const result = parseText("IF you HAVE another CHARACTER", "ifCondition");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
    });
  });

  describe("duringCondition rule", () => {
    it("parses 'during your turn'", () => {
      const result = parseText("during your turn", "duringCondition");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.During).toBeDefined();
      expect(result.cst.children.Your).toBeDefined();
      expect(result.cst.children.Identifier).toBeDefined();
    });

    it("parses 'during turn' (without 'your')", () => {
      const result = parseText("during turn", "duringCondition");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.During).toBeDefined();
      expect(result.cst.children.Identifier).toBeDefined();
    });

    it("parses 'during your phase'", () => {
      const result = parseText("during your phase", "duringCondition");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
    });

    it("handles case insensitivity", () => {
      const result = parseText("DURING YOUR TURN", "duringCondition");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
    });
  });

  describe("atCondition rule", () => {
    it("parses 'at the start of your turn'", () => {
      const result = parseText("at the start of your turn", "atCondition");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.At).toBeDefined();
      expect(result.cst.children.Identifier).toBeDefined();
    });

    it("parses 'at the beginning'", () => {
      const result = parseText("at the beginning", "atCondition");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
    });

    it("parses 'at start'", () => {
      const result = parseText("at start", "atCondition");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
    });

    it("handles multiple identifiers", () => {
      const result = parseText("at the end of the turn", "atCondition");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      // Should capture multiple identifier tokens
      expect(result.cst.children.Identifier?.length).toBeGreaterThan(1);
    });

    it("handles case insensitivity", () => {
      const result = parseText("AT THE START", "atCondition");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
    });
  });

  describe("withCondition rule", () => {
    it("parses 'with 5 lore'", () => {
      const result = parseText("with 5 lore", "withCondition");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.Identifier).toBeDefined();
      expect(result.cst.children.conditionExpression).toBeDefined();
    });

    it("parses 'with strength'", () => {
      const result = parseText("with strength", "withCondition");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
    });

    it("parses 'with 3 or more characters'", () => {
      const result = parseText("with 3 or more characters", "withCondition");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
    });

    it("handles case insensitivity", () => {
      const result = parseText("WITH 5 LORE", "withCondition");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
    });
  });

  describe("withoutCondition rule", () => {
    it("parses 'without abilities'", () => {
      const result = parseText("without abilities", "withoutCondition");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.Identifier).toBeDefined();
      expect(result.cst.children.conditionExpression).toBeDefined();
    });

    it("parses 'without strength'", () => {
      const result = parseText("without strength", "withoutCondition");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
    });

    it("parses 'without evasive'", () => {
      const result = parseText("without evasive", "withoutCondition");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
    });

    it("handles case insensitivity", () => {
      const result = parseText("WITHOUT ABILITIES", "withoutCondition");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
    });
  });

  describe("conditionExpression rule", () => {
    it("parses simple expression", () => {
      const result = parseText("you have character", "conditionExpression");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.Identifier).toBeDefined();
    });

    it("parses expression with numbers", () => {
      const result = parseText("5 lore", "conditionExpression");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.Number).toBeDefined();
    });

    it("parses expression with character keyword", () => {
      const result = parseText("another character", "conditionExpression");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.Character).toBeDefined();
    });

    it("parses expression with 'your' keyword", () => {
      const result = parseText("your character", "conditionExpression");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.Your).toBeDefined();
      expect(result.cst.children.Character).toBeDefined();
    });

    it("parses complex expression", () => {
      const result = parseText("you have 3 characters", "conditionExpression");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.Identifier).toBeDefined();
      expect(result.cst.children.Number).toBeDefined();
    });

    it("handles empty expression (no tokens)", () => {
      const result = parseText("", "conditionExpression");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      // Empty expression should still parse successfully (MANY allows zero matches)
    });
  });

  describe("condition operators", () => {
    it("parses comparison with numbers", () => {
      const result = parseText("if you have 5 lore", "ifCondition");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
    });

    it("parses existence check", () => {
      const result = parseText("if you have another character", "ifCondition");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
    });

    it("parses complex condition", () => {
      const result = parseText("if you have 3 characters", "ifCondition");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
    });
  });

  describe("timing conditions", () => {
    it("parses start of turn timing", () => {
      const result = parseText("at the start of your turn", "atCondition");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
    });

    it("parses end of turn timing", () => {
      const result = parseText("at the end of your turn", "atCondition");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
    });

    it("parses during phase timing", () => {
      const result = parseText("during your turn", "duringCondition");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
    });
  });

  describe("edge cases", () => {
    it("handles whitespace variations", () => {
      const result = parseText("if  you  have  character", "ifCondition");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
    });

    it("handles mixed case", () => {
      const result = parseText("If YoU HaVe ChArAcTeR", "ifCondition");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
    });

    it("handles minimal condition", () => {
      const result = parseText("if character", "ifCondition");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
    });
  });
});
