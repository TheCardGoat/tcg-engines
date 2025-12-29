/**
 * Tests for target visitor (CST to target object transformation).
 * Ensures visitor correctly transforms target parse trees into typed target objects.
 */

import { describe, expect, it } from "bun:test";
import { LorcanaAbilityParser } from "../../grammar";
import { LorcanaLexer } from "../../lexer";
import {
  parseTargetFromCst,
  parseTargetFromText,
  type Target,
} from "../target-visitor";

describe("Target Visitor", () => {
  const parser = new LorcanaAbilityParser();

  /**
   * Helper to lex and parse text into CST
   */
  function parseTargetClause(text: string) {
    const lexResult = LorcanaLexer.tokenize(text);
    parser.input = lexResult.tokens;
    const cst = parser.targetClause();

    if (parser.errors.length > 0) {
      throw new Error(
        `Parsing failed: ${parser.errors.map((e) => e.message).join(", ")}`,
      );
    }

    return cst;
  }

  describe("parseTargetFromCst", () => {
    it("parses chosen character", () => {
      const cst = parseTargetClause("chosen character");
      const target = parseTargetFromCst(cst.children);

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("chosen");
    });

    it("parses another character", () => {
      const cst = parseTargetClause("another character");
      const target = parseTargetFromCst(cst.children);

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("another");
    });

    it("parses all characters", () => {
      const cst = parseTargetClause("all characters");
      const target = parseTargetFromCst(cst.children);

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("all");
    });

    it("parses each character", () => {
      const cst = parseTargetClause("each character");
      const target = parseTargetFromCst(cst.children);

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("each");
    });

    it("parses your character", () => {
      const cst = parseTargetClause("your character");
      const target = parseTargetFromCst(cst.children);

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("your");
    });

    it("parses opponent character", () => {
      const cst = parseTargetClause("opponent character");
      const target = parseTargetFromCst(cst.children);

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("opponent");
    });

    it("parses other character", () => {
      const cst = parseTargetClause("other character");
      const target = parseTargetFromCst(cst.children);

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("other");
    });

    it("parses this character", () => {
      const cst = parseTargetClause("this character");
      const target = parseTargetFromCst(cst.children);

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("this");
    });

    it("parses character without modifier", () => {
      const cst = parseTargetClause("character");
      const target = parseTargetFromCst(cst.children);

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBeUndefined();
    });

    it("parses item type", () => {
      const cst = parseTargetClause("chosen item");
      const target = parseTargetFromCst(cst.children);

      expect(target).toBeDefined();
      expect(target?.type).toBe("item");
      expect(target?.modifier).toBe("chosen");
    });

    it("parses location type", () => {
      const cst = parseTargetClause("your location");
      const target = parseTargetFromCst(cst.children);

      expect(target).toBeDefined();
      expect(target?.type).toBe("location");
      expect(target?.modifier).toBe("your");
    });

    it("parses card type (singular)", () => {
      const cst = parseTargetClause("chosen card");
      const target = parseTargetFromCst(cst.children);

      expect(target).toBeDefined();
      expect(target?.type).toBe("card");
      expect(target?.modifier).toBe("chosen");
    });

    it("parses cards type (plural)", () => {
      const cst = parseTargetClause("your cards");
      const target = parseTargetFromCst(cst.children);

      expect(target).toBeDefined();
      expect(target?.type).toBe("cards");
      expect(target?.modifier).toBe("your");
    });

    it("parses player type via identifier", () => {
      const cst = parseTargetClause("player");
      const target = parseTargetFromCst(cst.children);

      expect(target).toBeDefined();
      expect(target?.type).toBe("player");
      expect(target?.modifier).toBeUndefined();
    });

    it("returns null when no targetType present", () => {
      const mockCtx = {
        // No targetType field
      };
      const target = parseTargetFromCst(mockCtx);

      expect(target).toBeNull();
    });

    it("handles missing targetType array", () => {
      const mockCtx = {
        targetType: undefined,
      };
      const target = parseTargetFromCst(mockCtx);

      expect(target).toBeNull();
    });

    it("handles all modifier variations", () => {
      const modifiers = [
        "your",
        "opponent",
        "each",
        "all",
        "another",
        "other",
        "chosen",
        "this",
      ];

      for (const modifier of modifiers) {
        const cst = parseTargetClause(`${modifier} character`);
        const target = parseTargetFromCst(cst.children);

        expect(target).toBeDefined();
        expect(target?.modifier).toBe(modifier);
      }
    });

    it("handles all type variations", () => {
      const types = ["character", "item", "location", "card", "cards"];

      for (const type of types) {
        const cst = parseTargetClause(type);
        const target = parseTargetFromCst(cst.children);

        expect(target).toBeDefined();
        expect(target?.type).toBe(type);
      }
    });
  });

  describe("parseTargetFromText", () => {
    it("parses 'your character' from text", () => {
      const target = parseTargetFromText("your character");

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("your");
    });

    it("parses 'opponent's character' from text", () => {
      const target = parseTargetFromText("opponent's character");

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("opponent");
    });

    it("parses 'opponent character' from text (without apostrophe)", () => {
      const target = parseTargetFromText("opponent character");

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("opponent");
    });

    it("parses 'each character' from text", () => {
      const target = parseTargetFromText("each character");

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("each");
    });

    it("parses 'all characters' from text", () => {
      const target = parseTargetFromText("all characters");

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("all");
    });

    it("parses 'another character' from text", () => {
      const target = parseTargetFromText("another character");

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("another");
    });

    it("parses 'other character' from text", () => {
      const target = parseTargetFromText("other character");

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("other");
    });

    it("parses 'chosen character' from text", () => {
      const target = parseTargetFromText("chosen character");

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("chosen");
    });

    it("parses 'this character' from text", () => {
      const target = parseTargetFromText("this character");

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("this");
    });

    it("parses 'character' without modifier from text", () => {
      const target = parseTargetFromText("character");

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBeUndefined();
    });

    it("parses 'your item' from text", () => {
      const target = parseTargetFromText("your item");

      expect(target).toBeDefined();
      expect(target?.type).toBe("item");
      expect(target?.modifier).toBe("your");
    });

    it("parses 'chosen location' from text", () => {
      const target = parseTargetFromText("chosen location");

      expect(target).toBeDefined();
      expect(target?.type).toBe("location");
      expect(target?.modifier).toBe("chosen");
    });

    it("parses 'your card' from text", () => {
      const target = parseTargetFromText("your card");

      expect(target).toBeDefined();
      expect(target?.type).toBe("card");
      expect(target?.modifier).toBe("your");
    });

    it("parses 'your cards' from text (plural)", () => {
      const target = parseTargetFromText("your cards");

      expect(target).toBeDefined();
      expect(target?.type).toBe("card");
      expect(target?.modifier).toBe("your");
    });

    it("handles case insensitivity", () => {
      const target = parseTargetFromText("CHOSEN CHARACTER");

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("chosen");
    });

    it("handles mixed case", () => {
      const target = parseTargetFromText("ChOsEn ChArAcTeR");

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
    });

    it("returns null for non-matching text", () => {
      const target = parseTargetFromText("invalid text with no target");

      expect(target).toBeNull();
    });

    it("returns null for empty string", () => {
      const target = parseTargetFromText("");

      expect(target).toBeNull();
    });

    it("extracts target from longer text", () => {
      const target = parseTargetFromText("deal 2 damage to chosen character");

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("chosen");
    });

    it("matches first target in text with multiple targets", () => {
      const target = parseTargetFromText(
        "move chosen character to another location",
      );

      expect(target).toBeDefined();
      // Should match the first one (chosen character)
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("chosen");
    });

    it("handles word boundaries correctly", () => {
      // "character" shouldn't match if it's part of another word
      const target = parseTargetFromText("characterize");

      // Since the regex uses word boundaries, this should not match
      expect(target).toBeNull();
    });
  });

  describe("target variations", () => {
    it("handles singular and plural forms", () => {
      const singular = parseTargetFromText("your character");
      const plural = parseTargetFromText("your characters");

      expect(singular).toBeDefined();
      expect(plural).toBeDefined();
      expect(singular?.type).toBe("character");
      expect(plural?.type).toBe("character");
    });

    it("handles all card types", () => {
      const types = ["character", "item", "location", "card"];

      for (const type of types) {
        const target = parseTargetFromText(`chosen ${type}`);
        expect(target).toBeDefined();
        expect(target?.type).toBe(type);
      }
    });

    it("handles all modifier types", () => {
      const modifiers = [
        "your",
        "opponent",
        "each",
        "all",
        "another",
        "other",
        "chosen",
        "this",
      ];

      for (const modifier of modifiers) {
        const target = parseTargetFromText(`${modifier} character`);
        expect(target).toBeDefined();
        expect(target?.modifier).toBe(modifier);
      }
    });
  });

  describe("edge cases", () => {
    it("handles whitespace variations", () => {
      const target = parseTargetFromText("chosen  character");

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
    });

    it("handles target at start of text", () => {
      const target = parseTargetFromText("chosen character");

      expect(target).toBeDefined();
    });

    it("handles target at end of text", () => {
      const target = parseTargetFromText("deal damage to chosen character");

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
    });

    it("handles target in middle of text", () => {
      const target = parseTargetFromText(
        "when you play, deal 2 damage to chosen character, then draw a card",
      );

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
    });
  });

  describe("type safety", () => {
    it("returns Target type with correct structure", () => {
      const target = parseTargetFromText("chosen character");

      expect(target).toBeDefined();
      if (target) {
        // Type check
        const typed: Target = target;
        expect(typed.type).toBeDefined();
        expect(typeof typed.type).toBe("string");
      }
    });

    it("modifier is optional in Target type", () => {
      const withModifier = parseTargetFromText("chosen character");
      const withoutModifier = parseTargetFromText("character");

      if (withModifier) {
        expect(withModifier.modifier).toBeDefined();
      }

      if (withoutModifier) {
        expect(withoutModifier.modifier).toBeUndefined();
      }
    });
  });
});
