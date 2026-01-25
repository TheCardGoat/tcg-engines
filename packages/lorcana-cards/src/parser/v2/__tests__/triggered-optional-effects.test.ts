/**
 * Tests for Task Group 2.4: Fix Optional Effects in Triggered Abilities
 *
 * Tests parsing of triggered abilities that contain optional effects ("you may").
 * This was a common failure pattern where OptionalEffect was incorrectly rejected.
 */

import { describe, expect, it } from "bun:test";
import type { OptionalEffect, TriggeredAbility } from "@tcg/lorcana";
import { parseAbilityText } from "../parser";

describe("Task 2.4: Triggered Abilities with Optional Effects", () => {
  describe("Basic Triggered Abilities with 'you may'", () => {
    it("should parse 'Whenever you play an item, you may draw a card'", () => {
      const result = parseAbilityText(
        "Whenever you play an item, you may draw a card.",
      );

      expect(result.success).toBe(true);
      const ability = result.ability?.ability as TriggeredAbility | undefined;
      expect(ability?.type).toBe("triggered");
      expect(ability!.trigger.event).toBe("play");
      expect(ability!.trigger.timing).toBe("whenever");
      expect(ability!.effect.type).toBe("optional");

      const effect = ability!.effect as OptionalEffect;
      expect(effect.effect).toBeDefined();
      expect(effect.effect!.type).toBe("draw");
    });

    it("should parse 'When this character is banished, you may draw a card'", () => {
      const result = parseAbilityText(
        "When this character is banished, you may draw a card.",
      );

      expect(result.success).toBe(true);
      const ability = result.ability?.ability as TriggeredAbility | undefined;
      expect(ability?.type).toBe("triggered");
      expect(ability!.trigger.event).toBe("banish");
      expect(ability!.trigger.timing).toBe("when");
      expect(ability!.effect.type).toBe("optional");

      const effect = ability!.effect as OptionalEffect;
      expect(effect.effect).toBeDefined();
      expect(effect.effect!.type).toBe("draw");
    });

    it("should parse 'Whenever this character quests, you may gain 1 lore'", () => {
      const result = parseAbilityText(
        "Whenever this character quests, you may gain 1 lore.",
      );

      expect(result.success).toBe(true);
      const ability = result.ability?.ability as TriggeredAbility | undefined;
      expect(ability?.type).toBe("triggered");
      expect(ability!.trigger.event).toBe("quest");
      expect(ability!.effect.type).toBe("optional");

      const effect = ability!.effect as OptionalEffect;
      expect(effect.effect!.type).toBe("gain-lore");
    });
  });

  describe("Named Abilities with Optional Effects", () => {
    it("should parse 'TEA PARTY Whenever this character is challenged, you may draw a card'", () => {
      const result = parseAbilityText(
        "TEA PARTY Whenever this character is challenged, you may draw a card.",
      );

      expect(result.success).toBe(true);
      const ability = result.ability?.ability as TriggeredAbility | undefined;
      expect(ability?.type).toBe("triggered");
      expect(result.ability?.name).toBe("TEA PARTY");
      expect(ability!.name).toBe("TEA PARTY");
      expect(ability!.trigger.event).toBe("challenged");
      expect(ability!.effect.type).toBe("optional");

      const effect = ability!.effect as OptionalEffect;
      expect(effect.effect).toBeDefined();
      expect(effect.effect!.type).toBe("draw");
    });

    it("should parse 'DARK KNOWLEDGE Whenever this character quests, you may draw a card'", () => {
      const result = parseAbilityText(
        "DARK KNOWLEDGE Whenever this character quests, you may draw a card.",
      );

      expect(result.success).toBe(true);
      const ability = result.ability?.ability as TriggeredAbility | undefined;
      expect(ability?.type).toBe("triggered");
      expect(result.ability?.name).toBe("DARK KNOWLEDGE");
      expect(ability!.name).toBe("DARK KNOWLEDGE");
      expect(ability!.trigger.event).toBe("quest");
      expect(ability!.effect.type).toBe("optional");
    });
  });

  describe("Triggered Abilities with Restriction Prefixes", () => {
    it("should parse 'Once per turn, when you play a character here, you may draw a card'", () => {
      const result = parseAbilityText(
        "Once per turn, when you play a character here, you may draw a card.",
      );

      expect(result.success).toBe(true);
      const ability = result.ability?.ability as TriggeredAbility | undefined;
      expect(ability?.type).toBe("triggered");
      expect(ability!.trigger.event).toBe("play");
      expect(ability!.trigger.timing).toBe("when");
      expect(ability!.effect.type).toBe("optional");
    });

    it("should parse 'During your turn, when this character is banished, you may draw a card'", () => {
      const result = parseAbilityText(
        "During your turn, when this character is banished, you may draw a card.",
      );

      expect(result.success).toBe(true);
      const ability = result.ability?.ability as TriggeredAbility | undefined;
      expect(ability?.type).toBe("triggered");
      expect(ability!.trigger.event).toBe("banish");
      expect(ability!.effect.type).toBe("optional");
    });

    it("should parse named ability with restriction prefix", () => {
      const result = parseAbilityText(
        "NEW INFORMATION Once per turn, when you play a character here, you may draw a card.",
      );

      expect(result.success).toBe(true);
      const ability = result.ability?.ability as TriggeredAbility | undefined;
      expect(ability?.type).toBe("triggered");
      expect(result.ability?.name).toBe("NEW INFORMATION");
      expect(ability!.effect.type).toBe("optional");
    });
  });

  describe("Optional Effects with Different Effect Types", () => {
    it("should parse optional damage effect", () => {
      const result = parseAbilityText(
        "When you play this character, you may deal 2 damage to chosen character.",
      );

      expect(result.success).toBe(true);
      const ability = result.ability?.ability as TriggeredAbility | undefined;
      expect(ability!.effect.type).toBe("optional");

      const effect = ability!.effect as OptionalEffect;
      expect(effect.effect!.type).toBe("deal-damage");
    });

    it("should parse optional banish effect", () => {
      const result = parseAbilityText(
        "When you play this character, you may banish chosen character.",
      );

      expect(result.success).toBe(true);
      const ability = result.ability?.ability as TriggeredAbility | undefined;
      expect(ability!.effect.type).toBe("optional");

      const effect = ability!.effect as OptionalEffect;
      expect(effect.effect!.type).toBe("banish");
    });

    it("should parse optional exert effect", () => {
      const result = parseAbilityText(
        "Whenever this character quests, you may exert chosen character.",
      );

      expect(result.success).toBe(true);
      const ability = result.ability?.ability as TriggeredAbility | undefined;
      expect(ability!.effect.type).toBe("optional");

      const effect = ability!.effect as OptionalEffect;
      expect(effect.effect!.type).toBe("exert");
    });
  });

  describe("Real Card Examples", () => {
    it("should parse IT WORKS! ability", () => {
      const result = parseAbilityText(
        "IT WORKS! Whenever you play an item, you may draw a card.",
      );

      expect(result.success).toBe(true);
      const ability = result.ability?.ability as TriggeredAbility | undefined;
      expect(ability?.type).toBe("triggered");
      expect(result.ability?.name).toBe("IT WORKS!");
      expect(ability!.effect.type).toBe("optional");
    });

    it("should parse DOUBLE-CROSSING CROOK! ability", () => {
      const result = parseAbilityText(
        "DOUBLE-CROSSING CROOK! During your turn, when this character is banished, you may draw a card.",
      );

      expect(result.success).toBe(true);
      const ability = result.ability?.ability as TriggeredAbility | undefined;
      expect(ability?.type).toBe("triggered");
      expect(result.ability?.name).toBe("DOUBLE-CROSSING CROOK!");
      expect(ability!.effect.type).toBe("optional");

      const effect = ability!.effect as OptionalEffect;
      expect(effect.effect).toBeDefined();
      expect(effect.effect!.type).toBe("draw");
    });
  });
});
