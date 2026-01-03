/**
 * Tests for Activated Ability Parser
 *
 * Tests parsing of activated abilities with various cost patterns:
 * - Exert-only costs
 * - Ink-only costs (with {d} placeholder support)
 * - Combined exert + ink costs
 * - Combined exert + banish costs
 * - Banish-only costs
 * - Named activated abilities
 * - Various cost separator types (-, −, –, :)
 */

import { describe, expect, it } from "bun:test";
import type { ActivatedAbility } from "@tcg/lorcana";
import { parseActivatedAbility } from "../parsers/activated-parser";

describe("Activated Ability Parser", () => {
  describe("Exert-only Costs", () => {
    it("should parse {E} - Draw a card", () => {
      const result = parseActivatedAbility("{E} - Draw a card.");

      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("activated");
      const ability = result.ability?.ability as ActivatedAbility;
      expect(ability.cost).toMatchObject({ exert: true });
      expect(ability.cost.ink).toBeUndefined();
      expect(ability.effect).toBeDefined();
    });

    it("should parse {E} - Deal 3 damage to chosen character", () => {
      const result = parseActivatedAbility(
        "{E} - Deal 3 damage to chosen character.",
      );

      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("activated");
      const ability = result.ability?.ability as ActivatedAbility;
      expect(ability.cost).toMatchObject({ exert: true });
      expect(ability.effect).toBeDefined();
    });
  });

  describe("Ink-only Costs", () => {
    it("should parse {d} {I} - Draw a card with placeholder", () => {
      const result = parseActivatedAbility("{d} {I} - Draw a card.");

      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("activated");
      const ability = result.ability?.ability as ActivatedAbility;
      expect(ability.cost).toMatchObject({ ink: -1 });
      expect(ability.cost.exert).toBeUndefined();
      expect(ability.effect).toBeDefined();
    });

    it("should parse 2 {I} - Draw a card with numeric cost", () => {
      const result = parseActivatedAbility("2 {I} - Draw a card.");

      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("activated");
      const ability = result.ability?.ability as ActivatedAbility;
      expect(ability.cost).toMatchObject({ ink: 2 });
      expect(ability.cost.exert).toBeUndefined();
      expect(ability.effect).toBeDefined();
    });
  });

  describe("Combined Exert + Ink Costs", () => {
    it("should parse {E}, {d} {I} - Deal {d} damage with placeholders", () => {
      const result = parseActivatedAbility(
        "{E}, {d} {I} - Deal {d} damage to chosen character.",
      );

      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("activated");
      const ability = result.ability?.ability as ActivatedAbility;
      expect(ability.cost).toMatchObject({ exert: true, ink: -1 });
      expect(ability.effect).toBeDefined();
    });

    it("should parse {E}, 2 {I} - Deal 3 damage with numeric costs", () => {
      const result = parseActivatedAbility(
        "{E}, 2 {I} - Deal 3 damage to chosen character.",
      );

      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("activated");
      const ability = result.ability?.ability as ActivatedAbility;
      expect(ability.cost).toMatchObject({ exert: true, ink: 2 });
      expect(ability.effect).toBeDefined();
    });

    it("should parse {E}, 1 {I} - Gain 3 lore", () => {
      const result = parseActivatedAbility("{E}, 1 {I} - Gain 3 lore.");

      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("activated");
      const ability = result.ability?.ability as ActivatedAbility;
      expect(ability.cost).toMatchObject({ exert: true, ink: 1 });
      expect(ability.effect).toBeDefined();
    });
  });

  describe("Combined Exert + Banish Costs", () => {
    it("should parse {E}, Banish this item - Gain 2 lore", () => {
      const result = parseActivatedAbility(
        "{E}, Banish this item - Gain 2 lore.",
      );

      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("activated");
      const ability = result.ability?.ability as ActivatedAbility;
      expect(ability.cost).toMatchObject({ exert: true, banishSelf: true });
      expect(ability.effect).toBeDefined();
    });

    it("should parse {E}, Banish this character - Draw 2 cards", () => {
      const result = parseActivatedAbility(
        "{E}, Banish this character - Draw 2 cards.",
      );

      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("activated");
      const ability = result.ability?.ability as ActivatedAbility;
      expect(ability.cost).toMatchObject({ exert: true, banishSelf: true });
      expect(ability.effect).toBeDefined();
    });
  });

  describe("Banish-only Costs", () => {
    it("should parse Banish this item - Gain 3 lore", () => {
      const result = parseActivatedAbility("Banish this item - Gain 3 lore.");

      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("activated");
      const ability = result.ability?.ability as ActivatedAbility;
      expect(ability.cost).toMatchObject({ banishSelf: true });
      expect(ability.cost.exert).toBeUndefined();
      expect(ability.effect).toBeDefined();
    });
  });

  describe("Named Activated Abilities", () => {
    it("should parse MAGIC HAIR {E} - Remove up to 3 damage", () => {
      const result = parseActivatedAbility(
        "MAGIC HAIR {E} - Remove up to 3 damage from chosen character.",
      );

      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("activated");
      const ability = result.ability?.ability as ActivatedAbility;
      expect(ability.name).toBe("MAGIC HAIR");
      expect(ability.cost).toMatchObject({ exert: true });
      expect(ability.effect).toBeDefined();
    });

    it("should parse SKIRMISH {E} - Deal {d} damage", () => {
      const result = parseActivatedAbility(
        "SKIRMISH {E} - Deal {d} damage to chosen character.",
      );

      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("activated");
      const ability = result.ability?.ability as ActivatedAbility;
      expect(ability.name).toBe("SKIRMISH");
      expect(ability.cost).toMatchObject({ exert: true });
      expect(ability.effect).toBeDefined();
    });

    it("should parse HEALING INCANTATION {E}, {d} {I} - Remove {d} damage", () => {
      const result = parseActivatedAbility(
        "HEALING INCANTATION {E}, {d} {I} - Remove {d} damage from chosen character.",
      );

      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("activated");
      const ability = result.ability?.ability as ActivatedAbility;
      expect(ability.name).toBe("HEALING INCANTATION");
      expect(ability.cost).toMatchObject({ exert: true, ink: -1 });
      expect(ability.effect).toBeDefined();
    });
  });

  describe("Cost Separator Variants", () => {
    it("should parse with hyphen separator: {E} - Draw a card", () => {
      const result = parseActivatedAbility("{E} - Draw a card.");

      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("activated");
    });

    it("should parse with en dash separator: {E} − Draw a card", () => {
      const result = parseActivatedAbility("{E} − Draw a card.");

      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("activated");
    });

    it("should parse with em dash separator: {E} – Draw a card", () => {
      const result = parseActivatedAbility("{E} – Draw a card.");

      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("activated");
    });

    it("should parse with colon separator: {E} : Draw a card", () => {
      const result = parseActivatedAbility("{E} : Draw a card.");

      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("activated");
    });

    it("should parse named ability with en dash: SKIRMISH {E} − Deal {d} damage", () => {
      const result = parseActivatedAbility(
        "SKIRMISH {E} − Deal {d} damage to chosen character.",
      );

      expect(result.success).toBe(true);
      expect(result.ability?.name).toBe("SKIRMISH");
      expect(result.ability?.ability.type).toBe("activated");
    });
  });

  describe("Edge Cases", () => {
    it("should fail to parse text without cost separator", () => {
      const result = parseActivatedAbility("{E} Draw a card");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Could not find cost separator");
    });

    it("should fail to parse text without recognizable cost", () => {
      const result = parseActivatedAbility("Something - Draw a card");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Could not parse cost");
    });

    it("should fail to parse text without parseable effect", () => {
      const result = parseActivatedAbility("{E} - Do something impossible");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Could not parse effect");
    });

    it("should preserve original text in result", () => {
      const originalText = "{E} - Draw a card.";
      const result = parseActivatedAbility(originalText);

      expect(result.success).toBe(true);
      expect(result.ability?.text).toBe(originalText);
    });
  });

  describe("Real Card Examples", () => {
    it("should parse Rapunzel - Gifted with Healing activated ability", () => {
      const result = parseActivatedAbility(
        "MAGIC HAIR {E} - Remove up to 3 damage from chosen character.",
      );

      expect(result.success).toBe(true);
      expect(result.ability?.name).toBe("MAGIC HAIR");
      const ability = result.ability?.ability as ActivatedAbility;
      expect(ability.cost.exert).toBe(true);
      expect(ability.effect.type).toBe("remove-damage");
    });

    it("should parse Beast - Hardheaded activated ability", () => {
      const result = parseActivatedAbility(
        "{E}, 2 {I} - Ready chosen character.",
      );

      expect(result.success).toBe(true);
      const ability = result.ability?.ability as ActivatedAbility;
      expect(ability.cost.exert).toBe(true);
      expect(ability.cost.ink).toBe(2);
      expect(ability.effect.type).toBe("ready");
    });

    it("should parse Coconut Basket activated ability", () => {
      const result = parseActivatedAbility("Banish this item - Gain 3 lore.");

      expect(result.success).toBe(true);
      const ability = result.ability?.ability as ActivatedAbility;
      expect(ability.cost.banishSelf).toBe(true);
      expect(ability.effect.type).toBe("gain-lore");
    });
  });
});
