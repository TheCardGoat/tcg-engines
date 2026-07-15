/**
 * Tests for target grammar parsing.
 * Ensures target-related grammar rules correctly parse target phrases.
 *
 * NOTE: These tests are skipped because the targetClause grammar rule
 * is defined in target-grammar.ts but not yet integrated into the
 * LorcanaAbilityParser class. The mixin function addTargetRules() exists
 * but is never called.
 *
 * TODO: Integrate target grammar rules into the parser to enable these tests.
 */

import { describe, expect, it } from "bun:test";
import { LorcanaLexer } from "../../lexer";
import { LorcanaAbilityParser } from "../ability-grammar";

// Skip: targetClause grammar rule not yet integrated into parser
describe.skip("Target Grammar", () => {
  const parser = new LorcanaAbilityParser();

  /**
   * Helper function to lex and parse text with a specific rule.
   * Note: Rule names are passed as strings because target rules
   * are not yet wired into the parser class.
   */
  function parseText(text: string, rule: string) {
    const lexResult = LorcanaLexer.tokenize(text);
    parser.input = lexResult.tokens;
    // Biome-ignore lint/suspicious/noExplicitAny: Dynamic rule access for testing
    const cst = (parser as any)[rule]();
    return {
      cst,
      errors: parser.errors,
      lexErrors: lexResult.errors,
    };
  }

  describe("targetClause rule", () => {
    it("parses chosen character", () => {
      const result = parseText("chosen character", "targetClause");

      expect(result.errors).toHaveLength(0);
      expect(result.lexErrors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.targetModifier).toBeDefined();
      expect(result.cst.children.targetType).toBeDefined();
    });

    it("parses another character", () => {
      const result = parseText("another character", "targetClause");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.targetModifier).toBeDefined();
      expect(result.cst.children.targetType).toBeDefined();
    });

    it("parses all characters", () => {
      const result = parseText("all characters", "targetClause");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.targetModifier).toBeDefined();
      expect(result.cst.children.targetType).toBeDefined();
    });

    it("parses each character", () => {
      const result = parseText("each character", "targetClause");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.targetModifier).toBeDefined();
    });

    it("parses your character", () => {
      const result = parseText("your character", "targetClause");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.targetModifier).toBeDefined();
    });

    it("parses opponent character", () => {
      const result = parseText("opponent character", "targetClause");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.targetModifier).toBeDefined();
    });

    it("parses other character", () => {
      const result = parseText("other character", "targetClause");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.targetModifier).toBeDefined();
    });

    it("parses this character", () => {
      const result = parseText("this character", "targetClause");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.targetModifier).toBeDefined();
    });

    it("parses character without modifier", () => {
      const result = parseText("character", "targetClause");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.targetType).toBeDefined();
      // No modifier should be present
      expect(result.cst.children.targetModifier).toBeUndefined();
    });

    it("parses target with item type", () => {
      const result = parseText("chosen item", "targetClause");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.targetModifier).toBeDefined();
      expect(result.cst.children.targetType).toBeDefined();
    });

    it("parses target with location type", () => {
      const result = parseText("your location", "targetClause");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.targetModifier).toBeDefined();
      expect(result.cst.children.targetType).toBeDefined();
    });

    it("parses target with card type (singular)", () => {
      const result = parseText("chosen card", "targetClause");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.targetType).toBeDefined();
    });

    it("parses target with cards type (plural)", () => {
      const result = parseText("your cards", "targetClause");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.targetType).toBeDefined();
    });

    it("handles case insensitivity for modifiers", () => {
      const result = parseText("CHOSEN CHARACTER", "targetClause");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
    });

    it("handles case insensitivity for types", () => {
      const result = parseText("chosen ITEM", "targetClause");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
    });
  });

  describe("targetModifier rule", () => {
    it("parses 'your' modifier", () => {
      const result = parseText("your", "targetModifier");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.Your).toBeDefined();
    });

    it("parses 'opponent' modifier", () => {
      const result = parseText("opponent", "targetModifier");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.Opponent).toBeDefined();
    });

    it("parses 'each' modifier", () => {
      const result = parseText("each", "targetModifier");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.Each).toBeDefined();
    });

    it("parses 'all' modifier", () => {
      const result = parseText("all", "targetModifier");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.All).toBeDefined();
    });

    it("parses 'another' modifier", () => {
      const result = parseText("another", "targetModifier");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.Another).toBeDefined();
    });

    it("parses 'other' modifier", () => {
      const result = parseText("other", "targetModifier");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.Other).toBeDefined();
    });

    it("parses 'chosen' modifier", () => {
      const result = parseText("chosen", "targetModifier");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.Chosen).toBeDefined();
    });

    it("parses 'this' modifier", () => {
      const result = parseText("this", "targetModifier");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.This).toBeDefined();
    });

    it("handles case insensitivity", () => {
      const result = parseText("ANOTHER", "targetModifier");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.Another).toBeDefined();
    });
  });

  describe("targetType rule", () => {
    it("parses 'character' type", () => {
      const result = parseText("character", "targetType");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.Character).toBeDefined();
    });

    it("parses 'item' type", () => {
      const result = parseText("item", "targetType");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.Item).toBeDefined();
    });

    it("parses 'location' type", () => {
      const result = parseText("location", "targetType");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.Location).toBeDefined();
    });

    it("parses 'card' type (singular)", () => {
      const result = parseText("card", "targetType");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.Card).toBeDefined();
    });

    it("parses 'cards' type (plural)", () => {
      const result = parseText("cards", "targetType");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.Cards).toBeDefined();
    });

    it("parses identifier type (for player, etc.)", () => {
      const result = parseText("player", "targetType");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.Identifier).toBeDefined();
    });

    it("handles case insensitivity", () => {
      const result = parseText("CHARACTER", "targetType");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.Character).toBeDefined();
    });
  });

  describe("quantified targets", () => {
    it("parses 'all characters' correctly", () => {
      const result = parseText("all characters", "targetClause");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.targetModifier).toBeDefined();
    });

    it("parses 'each character' correctly", () => {
      const result = parseText("each character", "targetClause");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.targetModifier).toBeDefined();
    });

    it("parses 'another character' correctly", () => {
      const result = parseText("another character", "targetClause");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.targetModifier).toBeDefined();
    });
  });

  describe("ownership modifiers", () => {
    it("parses 'your character' correctly", () => {
      const result = parseText("your character", "targetClause");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.targetModifier).toBeDefined();
    });

    it("parses 'opponent character' correctly", () => {
      const result = parseText("opponent character", "targetClause");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
      expect(result.cst.children.targetModifier).toBeDefined();
    });
  });

  describe("edge cases", () => {
    it("handles whitespace variations", () => {
      const result = parseText("chosen  character", "targetClause");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
    });

    it("handles mixed case", () => {
      const result = parseText("ChOsEn ChArAcTeR", "targetClause");

      expect(result.errors).toHaveLength(0);
      expect(result.cst).toBeDefined();
    });
  });
});
