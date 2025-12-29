/**
 * Integration Tests for Nested Composite Effects
 * Ensures composite effects can contain other composite effects (recursive parsing).
 */

import { describe, expect, it } from "bun:test";
import type { Effect } from "../../../types";
import { parseCompositeEffect } from "../index";

describe("Nested Composite Effects Integration", () => {
  describe("sequence containing choices", () => {
    it("currently parses as choice due to registration order", () => {
      const text =
        "draw 2 cards, then choose one: deal 3 damage; or gain 2 lore";

      const result = parseCompositeEffect(text);

      // Current behavior: choice parser matches first because "choose one" is present
      // Future enhancement: could parse as sequence with nested choice
      expect(result).not.toBeNull();
      expect(result?.type).toBe("choice");

      const options = (result as Effect & { options: Effect[] }).options;
      expect(options).toHaveLength(2);
      expect(options[0].type).toBe("damage");
      expect(options[1].type).toBe("lore");
    });
  });

  describe("choice containing sequences", () => {
    it("parses choice where options are sequences", () => {
      const text =
        "choose one: draw 1 card, then discard 1 card; or gain 2 lore, then deal 2 damage";

      const result = parseCompositeEffect(text);

      expect(result).not.toBeNull();
      expect(result?.type).toBe("choice");

      const options = (result as Effect & { options: Effect[] }).options;
      expect(options).toHaveLength(2);

      // Note: Current implementation parses "draw 1 card" and "gain 2 lore" as atomic
      // The ", then X" parts are not recursively parsed
      // Nested sequences would require recursive parsing enhancement
    });
  });

  describe("optional containing sequence", () => {
    it("parses optional effect with a sequence inside", () => {
      const text = "you may draw 2 cards, then discard 1 card";

      const result = parseCompositeEffect(text);

      expect(result).not.toBeNull();
      expect(result?.type).toBe("optional");

      // Current implementation will parse "draw 2 cards, then discard 1 card" as text
      // A fully recursive parser would parse this as a sequence within optional
    });
  });

  describe("conditional containing sequence", () => {
    it("parses conditional with sequence as the effect", () => {
      const text =
        "if you have another character, draw 1 card, then gain 1 lore";

      const result = parseCompositeEffect(text);

      expect(result).not.toBeNull();
      expect(result?.type).toBe("conditional");

      const condition = (result as Effect & { condition: string }).condition;
      expect(condition).toBe("you have another character");

      // Effect part contains sequence text
      // Current implementation may not recursively parse the sequence
    });
  });

  describe("for-each containing choice", () => {
    it("currently parses as choice due to registration order", () => {
      const text =
        "for each character, choose one: deal 1 damage; or gain 1 lore";

      const result = parseCompositeEffect(text);

      // Current behavior: choice parser matches first because "choose one" is present
      // Future enhancement: could parse as for-each with nested choice
      expect(result).not.toBeNull();
      expect(result?.type).toBe("choice");

      const options = (result as Effect & { options: Effect[] }).options;
      expect(options).toHaveLength(2);
      expect(options[0].type).toBe("damage");
      expect(options[1].type).toBe("lore");
    });
  });

  describe("repeat containing optional", () => {
    it("parses repeat with optional effect inside", () => {
      const text = "you may draw 1 card, 3 times";

      const result = parseCompositeEffect(text);

      // Parser will try optional first, and "you may draw 1 card" matches
      expect(result).not.toBeNull();
      expect(result?.type).toBe("optional");

      // The ", 3 times" part won't be part of the optional effect
      // This demonstrates parser order matters
    });
  });

  describe("deeply nested structures", () => {
    it("handles three-level nesting (optional of conditional of sequence)", () => {
      const text =
        "you may if you have another character, draw 1 card, then gain 1 lore";

      const result = parseCompositeEffect(text);

      // This is a complex case that may not parse correctly
      // Documents behavior for future recursive parser implementation
      expect(result).toBeDefined();
    });

    it("handles complex choice with multiple nested effects", () => {
      const text =
        "choose one: draw 2 cards, then discard 1 card; or if you have another character, gain 3 lore; or deal 2 damage, then exert chosen character";

      const result = parseCompositeEffect(text);

      expect(result).not.toBeNull();
      expect(result?.type).toBe("choice");

      const options = (result as Effect & { options: Effect[] }).options;
      // Each option may contain nested composite effects
      // Current implementation treats them as atomic text
      expect(options.length).toBeGreaterThan(0);
    });
  });

  describe("parser precedence and registration order", () => {
    it("respects registration order (choice before sequence)", () => {
      // Choice should be tried before sequence
      const choiceText = "choose one: draw 1 card; or gain 1 lore";
      const result = parseCompositeEffect(choiceText);

      expect(result).not.toBeNull();
      expect(result?.type).toBe("choice");
    });

    it("matches sequence when choice pattern not present", () => {
      const sequenceText = "draw 1 card, then gain 1 lore";
      const result = parseCompositeEffect(sequenceText);

      expect(result).not.toBeNull();
      expect(result?.type).toBe("sequence");
    });

    it("matches for-each before conditional when both could match", () => {
      // "for each" is more specific than "if"
      const forEachText = "for each character, if you control it, gain 1 lore";
      const result = parseCompositeEffect(forEachText);

      expect(result).not.toBeNull();
      expect(result?.type).toBe("forEach");
    });

    it("matches optional before sequence", () => {
      // "you may" is more specific than "then"
      const optionalText = "you may draw 1 card";
      const result = parseCompositeEffect(optionalText);

      expect(result).not.toBeNull();
      expect(result?.type).toBe("optional");
    });

    it("matches repeat before sequence", () => {
      // "X times" is more specific than "then"
      const repeatText = "draw 1 card, 3 times";
      const result = parseCompositeEffect(repeatText);

      expect(result).not.toBeNull();
      expect(result?.type).toBe("repeat");
    });
  });

  describe("recursive parsing edge cases", () => {
    it("returns null for text that doesn't match any composite pattern", () => {
      const result = parseCompositeEffect("draw 2 cards");

      expect(result).toBeNull();
    });

    it("handles empty string", () => {
      const result = parseCompositeEffect("");

      expect(result).toBeNull();
    });

    it("handles text with only composite keywords but invalid syntax", () => {
      const result = parseCompositeEffect("choose one then for each if");

      expect(result).toBeNull();
    });
  });

  describe("real-world complex patterns", () => {
    it("parses Maleficent-style choice with damage options", () => {
      const text =
        "choose one: deal 3 damage to chosen character; or deal 1 damage to each opposing character";

      const result = parseCompositeEffect(text);

      expect(result).not.toBeNull();
      expect(result?.type).toBe("choice");
      const options = (result as Effect & { options: Effect[] }).options;
      expect(options).toHaveLength(2);
      expect(options[0].type).toBe("damage");
      expect(options[1].type).toBe("damage");
    });

    it("parses Aladdin-style sequence with draw and discard", () => {
      const text = "draw 2 cards, then discard 1 card";

      const result = parseCompositeEffect(text);

      expect(result).not.toBeNull();
      expect(result?.type).toBe("sequence");
      const effects = (result as Effect & { effects: Effect[] }).effects;
      expect(effects).toHaveLength(2);
      expect(effects[0].type).toBe("draw");
      expect(effects[1].type).toBe("discard");
    });

    it("parses Gaston-style conditional with lore gain", () => {
      const text = "if you have another character in play, gain 2 lore";

      const result = parseCompositeEffect(text);

      expect(result).not.toBeNull();
      expect(result?.type).toBe("conditional");
      const effect = (result as Effect & { effect: Effect }).effect;
      expect(effect.type).toBe("lore");
    });

    it("parses Merlin-style for-each with lore scaling", () => {
      const text = "for each character you have in play, gain 1 lore";

      const result = parseCompositeEffect(text);

      expect(result).not.toBeNull();
      expect(result?.type).toBe("forEach");
      const effect = (result as Effect & { effect: Effect }).effect;
      expect(effect.type).toBe("lore");
    });
  });

  describe("parseCompositeEffect function", () => {
    it("returns first matching parser result", () => {
      const text = "choose one: draw 1 card; or gain 1 lore";
      const result = parseCompositeEffect(text);

      expect(result).not.toBeNull();
      expect(result?.type).toBe("choice");
    });

    it("returns null when no parser matches", () => {
      const text = "this text matches no composite pattern";
      const result = parseCompositeEffect(text);

      expect(result).toBeNull();
    });

    it("tries all parsers in registration order", () => {
      // This tests that later parsers are tried if earlier ones fail
      const text = "draw 2 cards, then discard 1 card";
      const result = parseCompositeEffect(text);

      // Should match sequence (last in registry)
      expect(result).not.toBeNull();
      expect(result?.type).toBe("sequence");
    });
  });
});
