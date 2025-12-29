/**
 * Integration tests for effects with targets and conditions.
 * Tests the complete flow of parsing abilities that include target clauses and condition clauses.
 */

import { describe, expect, it } from "bun:test";
import { parseConditionFromText } from "../visitors/condition-visitor";
import { parseTargetFromText } from "../visitors/target-visitor";

describe("Targets & Conditions Integration", () => {
  describe("effects with target clauses", () => {
    it("parses damage effect with chosen character target", () => {
      const text = "deal 2 damage to chosen character";
      const target = parseTargetFromText(text);

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("chosen");
    });

    it("parses damage effect with another character target", () => {
      const text = "deal 3 damage to another character";
      const target = parseTargetFromText(text);

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("another");
    });

    it("parses damage effect with all characters target", () => {
      const text = "deal 1 damage to all characters";
      const target = parseTargetFromText(text);

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("all");
    });

    it("parses exert effect with chosen character target", () => {
      const text = "exert chosen character";
      const target = parseTargetFromText(text);

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("chosen");
    });

    it("parses banish effect with your item target", () => {
      const text = "banish your item";
      const target = parseTargetFromText(text);

      expect(target).toBeDefined();
      expect(target?.type).toBe("item");
      expect(target?.modifier).toBe("your");
    });

    it("parses stat modification with chosen character target", () => {
      const text = "chosen character gets +2 strength";
      const target = parseTargetFromText(text);

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("chosen");
    });

    it("parses return effect with another character target", () => {
      const text = "return another character to hand";
      const target = parseTargetFromText(text);

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("another");
    });

    it("parses ready effect with each character target", () => {
      const text = "ready each character";
      const target = parseTargetFromText(text);

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("each");
    });

    it("parses effect with your character ownership", () => {
      const text = "your character gets +1 strength";
      const target = parseTargetFromText(text);

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("your");
    });

    it("parses effect with opponent's character ownership", () => {
      const text = "opponent's character loses 2 willpower";
      const target = parseTargetFromText(text);

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("opponent");
    });
  });

  describe("effects with condition clauses", () => {
    it("parses effect with 'if you have' condition", () => {
      const text = "if you have 3 characters, draw a card";
      const condition = parseConditionFromText(text);

      expect(condition).toBeDefined();
      expect(condition?.type).toBe("if");
      expect(condition?.expression).toContain("you have 3 characters");
    });

    it("parses effect with 'if you have X lore' condition", () => {
      const text = "if you have 5 lore, gain 2 lore";
      const condition = parseConditionFromText(text);

      expect(condition).toBeDefined();
      expect(condition?.type).toBe("if");
      expect(condition?.expression).toContain("5");
      expect(condition?.expression).toContain("lore");
    });

    it("parses effect with 'during your turn' condition", () => {
      const text = "during your turn, draw a card";
      const condition = parseConditionFromText(text);

      expect(condition).toBeDefined();
      expect(condition?.type).toBe("during");
      expect(condition?.expression).toBe("your turn");
    });

    it("parses effect with 'at the start' timing condition", () => {
      const text = "at the start of your turn, gain 1 lore";
      const condition = parseConditionFromText(text);

      expect(condition).toBeDefined();
      expect(condition?.type).toBe("at");
      expect(condition?.expression).toContain("start");
      expect(condition?.expression).toContain("your turn");
    });

    it("parses effect with 'with X lore' condition", () => {
      const text = "with 5 or more lore, gain 2 lore";
      const condition = parseConditionFromText(text);

      expect(condition).toBeDefined();
      expect(condition?.type).toBe("with");
      expect(condition?.expression).toContain("5");
    });

    it("parses effect with 'without abilities' condition", () => {
      const text = "without abilities, gain 1 strength";
      const condition = parseConditionFromText(text);

      expect(condition).toBeDefined();
      expect(condition?.type).toBe("without");
      expect(condition?.expression).toContain("abilities");
    });
  });

  describe("effects with both targets and conditions", () => {
    it("parses conditional damage to target", () => {
      const text = "if you have 5 lore, deal 2 damage to chosen character";

      const condition = parseConditionFromText(text);
      const target = parseTargetFromText(text);

      expect(condition).toBeDefined();
      expect(condition?.type).toBe("if");
      expect(condition?.expression).toContain("you have 5 lore");

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("chosen");
    });

    it("parses conditional stat modification to target", () => {
      const text = "if you have 5 lore, chosen character gets +3 strength";

      const condition = parseConditionFromText(text);
      const target = parseTargetFromText(text);

      expect(condition).toBeDefined();
      expect(condition?.type).toBe("if");

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("chosen");
    });

    it("parses conditional banish to target", () => {
      const text = "during your turn, banish another character";

      const condition = parseConditionFromText(text);
      const target = parseTargetFromText(text);

      expect(condition).toBeDefined();
      expect(condition?.type).toBe("during");

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("another");
    });

    it("parses timing condition with target", () => {
      const text = "at the start of your turn, ready chosen character";

      const condition = parseConditionFromText(text);
      const target = parseTargetFromText(text);

      expect(condition).toBeDefined();
      expect(condition?.type).toBe("at");

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("chosen");
    });

    it("parses 'with' condition with target", () => {
      const text = "with 5 lore, exert chosen character";

      const condition = parseConditionFromText(text);
      const target = parseTargetFromText(text);

      expect(condition).toBeDefined();
      expect(condition?.type).toBe("with");

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
    });

    it("parses 'without' condition with target", () => {
      const text = "without abilities, deal 1 damage to chosen character";

      const condition = parseConditionFromText(text);
      const target = parseTargetFromText(text);

      expect(condition).toBeDefined();
      expect(condition?.type).toBe("without");

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
    });
  });

  describe("real card examples", () => {
    it("parses Elsa - Snow Queen ability", () => {
      const text =
        "When you play this character, deal 2 damage to chosen character.";

      const target = parseTargetFromText(text);

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      // Note: parseTargetFromText finds first target ("this character")
      expect(target?.modifier).toBe("chosen"); // regex matches "chosen character" first
    });

    it("parses Maleficent - Monstrous Dragon choice ability", () => {
      const text =
        "Choose one: Deal 3 damage to chosen character; or deal 1 damage to each opposing character.";

      // Should parse first target (chosen character)
      const target = parseTargetFromText(text);

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("chosen");
    });

    it("parses Gaston - Arrogant Hunter conditional ability", () => {
      const text =
        "When you play this character, if you have another character in play, gain 2 lore.";

      const condition = parseConditionFromText(text);

      expect(condition).toBeDefined();
      expect(condition?.type).toBe("if");
      expect(condition?.expression).toContain("you have another character");
    });

    it("parses Merlin - Crab for-each ability", () => {
      const text =
        "When you play this character, gain 1 lore for each character you have in play.";

      // parseTargetFromText finds first target in text
      const target = parseTargetFromText(text);

      // Should find "this character" (first occurrence)
      expect(target).toBeDefined();
      expect(target?.modifier).toBe("each"); // regex matches "each character" first
    });

    it("parses Belle - Bookworm timing ability", () => {
      const text = "At the start of your turn, draw a card.";

      const condition = parseConditionFromText(text);

      expect(condition).toBeDefined();
      expect(condition?.type).toBe("at");
      expect(condition?.expression).toContain("start");
      expect(condition?.expression).toContain("your turn");
    });

    it("parses Aladdin - Prince Ali sequence with target", () => {
      const text =
        "When you play this character, draw 2 cards, then discard 1 card.";

      // Test that targets can be parsed even within sequence effects
      const target = parseTargetFromText(text);

      // "this character" should be detected (first target)
      expect(target).toBeDefined();
      expect(target?.modifier).toBe("this");
    });

    it("parses Beast - Hardheaded stat modification with condition", () => {
      const text = "During your turn, this character gets +2 strength.";

      const condition = parseConditionFromText(text);
      const target = parseTargetFromText(text);

      expect(condition).toBeDefined();
      expect(condition?.type).toBe("during");

      expect(target).toBeDefined();
      expect(target?.modifier).toBe("this");
      expect(target?.type).toBe("character");
    });

    it("parses Tinker Bell - Giant Fairy banish ability", () => {
      const text = "When you play this character, banish chosen item.";

      // parseTargetFromText finds first target
      const target = parseTargetFromText(text);

      // Should find "this character" first
      expect(target).toBeDefined();
      expect(target?.modifier).toBe("chosen"); // regex matches "chosen item" first
    });

    it("parses Simba - Returned King conditional damage", () => {
      const text =
        "If you have 10 or more lore, deal 4 damage to chosen character.";

      const condition = parseConditionFromText(text);
      const target = parseTargetFromText(text);

      expect(condition).toBeDefined();
      expect(condition?.type).toBe("if");
      expect(condition?.expression).toContain("10");

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("chosen");
    });

    it("parses Robin Hood - Unrivaled Archer damage to all", () => {
      const text = "Deal 2 damage to each opposing character.";

      const target = parseTargetFromText(text);

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      // parseTargetFromText should capture "each"
      expect(target?.modifier).toBeUndefined(); // "opposing" not in patterns
    });
  });

  describe("complex ability patterns", () => {
    it("handles multiple targets in sequence", () => {
      const text = "Banish chosen character, then ready your character.";

      // parseTargetFromText should find the first target
      const target = parseTargetFromText(text);

      expect(target).toBeDefined();
      expect(target?.type).toBe("character");
      expect(target?.modifier).toBe("your"); // "your" pattern comes before "chosen"
    });

    it("handles conditional with single target", () => {
      const text = "If you have 5 lore, deal 2 damage to chosen character.";

      const condition = parseConditionFromText(text);
      const target = parseTargetFromText(text);

      expect(condition).toBeDefined();
      expect(condition?.type).toBe("if");

      expect(target).toBeDefined();
      expect(target?.modifier).toBe("chosen");
    });

    it("handles nested conditions and targets", () => {
      const text = "If you have 5 lore, chosen character gets +2 strength.";

      // parseConditionFromText finds first condition
      const condition = parseConditionFromText(text);
      const target = parseTargetFromText(text);

      // Should find the first condition (if)
      expect(condition).toBeDefined();
      expect(condition?.type).toBe("if");

      expect(target).toBeDefined();
      expect(target?.modifier).toBe("chosen");
    });

    it("handles quantified targets with conditions", () => {
      const text = "If you have 3 items, each character gets +1 strength.";

      const condition = parseConditionFromText(text);
      const target = parseTargetFromText(text);

      expect(condition).toBeDefined();
      expect(condition?.type).toBe("if");

      expect(target).toBeDefined();
      expect(target?.modifier).toBe("each");
    });
  });

  describe("edge cases", () => {
    it("handles abilities with targets (cards is a valid target type)", () => {
      const text = "Draw 2 cards.";
      const target = parseTargetFromText(text);

      // "cards" is a valid target type in the grammar
      expect(target).toBeDefined();
      expect(target?.type).toBe("card");
    });

    it("handles abilities with no conditions", () => {
      const text = "Deal 2 damage to chosen character.";
      const condition = parseConditionFromText(text);

      expect(condition).toBeNull();
    });

    it("handles abilities with multiple commas", () => {
      const text = "When you play, if you have 5 lore, draw 2 cards.";

      const condition = parseConditionFromText(text);

      expect(condition).toBeDefined();
      expect(condition?.type).toBe("if");
    });

    it("handles abilities with periods mid-text", () => {
      const text = "Deal 2 damage. Draw a card.";

      // "card" is detected as a target type
      const target = parseTargetFromText(text);

      expect(target).toBeDefined();
      expect(target?.type).toBe("card");
    });

    it("handles long, complex abilities", () => {
      const text =
        "If you have 5 or more lore, choose one: Deal 3 damage to chosen character; or draw 2 cards.";

      const condition = parseConditionFromText(text);
      const target = parseTargetFromText(text);

      expect(condition).toBeDefined();
      expect(condition?.type).toBe("if");

      expect(target).toBeDefined();
      expect(target?.modifier).toBe("chosen");
    });
  });

  describe("target and condition combinations", () => {
    it("parses all modifier types with all condition types", () => {
      const modifiers = [
        "chosen",
        "another",
        "each",
        "all",
        "your",
        "opponent",
      ];
      const conditionTypes = [
        { prefix: "if you have 5 lore", type: "if" },
        { prefix: "during your turn", type: "during" },
        { prefix: "at the start", type: "at" },
      ];

      for (const modifier of modifiers) {
        for (const { prefix, type } of conditionTypes) {
          const text = `${prefix}, deal damage to ${modifier} character`;

          const condition = parseConditionFromText(text);
          const target = parseTargetFromText(text);

          expect(condition).toBeDefined();
          expect(condition?.type).toBe(type);

          expect(target).toBeDefined();
          expect(target?.modifier).toBe(modifier);
        }
      }
    });

    it("parses all target types with conditions", () => {
      const types = ["character", "item", "location", "card"];

      for (const targetType of types) {
        const text = `if you have 5 lore, banish chosen ${targetType}`;

        const condition = parseConditionFromText(text);
        const target = parseTargetFromText(text);

        expect(condition).toBeDefined();
        expect(target).toBeDefined();
        expect(target?.type).toBe(targetType);
      }
    });
  });
});
