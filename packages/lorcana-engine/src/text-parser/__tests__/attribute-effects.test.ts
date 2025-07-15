// Comprehensive tests for Attribute and Modifier Effects

import { describe, expect, it } from "@jest/globals";
import {
  chosenCharacter,
  chosenCharacterOfYours,
} from "@lorcanito/lorcana-engine/abilities/target";
import {
  createCostModifierEffect,
  createEffectFromParsed,
  createLoreModifierEffect,
  createMoveCostModifierEffect,
  createSingCostModifierEffect,
  createStrengthModifierEffect,
  createWillpowerModifierEffect,
} from "../effect-factory";
import type { ParsedEffect } from "../types";

describe("Attribute and Modifier Effects", () => {
  describe("Duration Handling", () => {
    it("should handle 'turn' duration for strength effects", () => {
      const effect = createStrengthModifierEffect(
        3,
        chosenCharacterOfYours,
        "turn",
      );

      expect(effect).toEqual({
        type: "attribute",
        attribute: "strength",
        amount: 3,
        modifier: "add",
        target: chosenCharacterOfYours,
        duration: "turn",
      });
    });

    it("should handle 'next_turn' duration for willpower effects", () => {
      const effect = createWillpowerModifierEffect(
        2,
        chosenCharacterOfYours,
        "next_turn",
      );

      expect(effect).toEqual({
        type: "attribute",
        attribute: "willpower",
        amount: 2,
        modifier: "add",
        target: chosenCharacterOfYours,
        duration: "next_turn",
      });
    });

    it("should handle 'static' duration for lore effects", () => {
      const effect = createLoreModifierEffect(
        1,
        chosenCharacterOfYours,
        "static",
      );

      expect(effect).toEqual({
        type: "attribute",
        attribute: "lore",
        amount: 1,
        modifier: "add",
        target: chosenCharacterOfYours,
        duration: "static",
      });
    });

    it("should handle 'challenge' duration for cost effects", () => {
      const effect = createCostModifierEffect(2, chosenCharacter, "challenge");

      expect(effect).toEqual({
        type: "attribute",
        attribute: "cost",
        amount: 2,
        modifier: "subtract",
        target: chosenCharacter,
        duration: "challenge",
      });
    });
  });

  describe("Modifier Types", () => {
    it("should create add modifier effects", () => {
      const effect = createStrengthModifierEffect(
        5,
        chosenCharacterOfYours,
        undefined,
        "add",
      );

      expect(effect.modifier).toBe("add");
      expect(effect.amount).toBe(5);
    });

    it("should create subtract modifier effects", () => {
      const effect = createStrengthModifierEffect(
        3,
        chosenCharacterOfYours,
        undefined,
        "subtract",
      );

      expect(effect.modifier).toBe("subtract");
      expect(effect.amount).toBe(3);
    });

    it("should default to 'add' for strength and willpower", () => {
      const strengthEffect = createStrengthModifierEffect(
        2,
        chosenCharacterOfYours,
      );
      const willpowerEffect = createWillpowerModifierEffect(
        1,
        chosenCharacterOfYours,
      );

      expect(strengthEffect.modifier).toBe("add");
      expect(willpowerEffect.modifier).toBe("add");
    });

    it("should default to 'subtract' for cost effects", () => {
      const costEffect = createCostModifierEffect(1, chosenCharacter);
      const moveCostEffect = createMoveCostModifierEffect(2, chosenCharacter);
      const singCostEffect = createSingCostModifierEffect(1, chosenCharacter);

      expect(costEffect.modifier).toBe("subtract");
      expect(moveCostEffect.modifier).toBe("subtract");
      expect(singCostEffect.modifier).toBe("subtract");
    });
  });

  describe("Dynamic Amounts", () => {
    it("should handle dynamic amounts for all attribute types", () => {
      const dynamicAmount = {
        dynamic: true as const,
        type: "count",
        filters: [{ filter: "owner" as const, value: "player_one" }],
      };

      const strengthEffect = createStrengthModifierEffect(
        dynamicAmount,
        chosenCharacterOfYours,
      );
      const willpowerEffect = createWillpowerModifierEffect(
        dynamicAmount,
        chosenCharacterOfYours,
      );
      const loreEffect = createLoreModifierEffect(
        dynamicAmount,
        chosenCharacterOfYours,
      );
      const costEffect = createCostModifierEffect(
        dynamicAmount,
        chosenCharacter,
      );

      expect(strengthEffect.amount).toEqual(dynamicAmount);
      expect(willpowerEffect.amount).toEqual(dynamicAmount);
      expect(loreEffect.amount).toEqual(dynamicAmount);
      expect(costEffect.amount).toEqual(dynamicAmount);
    });
  });

  describe("Parsed Effect Integration", () => {
    it("should create all attribute types from parsed effects", () => {
      const attributeTypes = [
        { attribute: "strength", expectedModifier: "add" },
        { attribute: "willpower", expectedModifier: "add" },
        { attribute: "lore", expectedModifier: "add" },
        { attribute: "cost", expectedModifier: "subtract" },
        { attribute: "moveCost", expectedModifier: "subtract" },
        { attribute: "singCost", expectedModifier: "subtract" },
      ];

      attributeTypes.forEach(({ attribute, expectedModifier }) => {
        const parsedEffect: ParsedEffect = {
          type: "attribute",
          amount: 2,
          target: chosenCharacterOfYours,
          duration: "turn",
          parameters: { attribute },
        };

        const effect = createEffectFromParsed(parsedEffect);

        expect(effect).toEqual({
          type: "attribute",
          attribute,
          amount: 2,
          modifier: expectedModifier,
          target: chosenCharacterOfYours,
          duration: "turn",
        });
      });
    });

    it("should respect explicit modifier in parsed effects", () => {
      const parsedEffect: ParsedEffect = {
        type: "attribute",
        amount: 3,
        target: chosenCharacterOfYours,
        parameters: { attribute: "strength", modifier: "subtract" },
      };

      const effect = createEffectFromParsed(parsedEffect);

      expect(effect).toEqual({
        type: "attribute",
        attribute: "strength",
        amount: 3,
        modifier: "subtract",
        target: chosenCharacterOfYours,
      });
    });

    it("should handle missing duration in parsed effects", () => {
      const parsedEffect: ParsedEffect = {
        type: "attribute",
        amount: 1,
        target: chosenCharacterOfYours,
        parameters: { attribute: "willpower" },
      };

      const effect = createEffectFromParsed(parsedEffect);

      expect(effect).toEqual({
        type: "attribute",
        attribute: "willpower",
        amount: 1,
        modifier: "add",
        target: chosenCharacterOfYours,
      });
    });
  });

  describe("Error Handling", () => {
    it("should throw error for unknown attribute types", () => {
      const parsedEffect: ParsedEffect = {
        type: "attribute",
        amount: 1,
        target: chosenCharacterOfYours,
        parameters: { attribute: "unknown" },
      };

      expect(() => createEffectFromParsed(parsedEffect)).toThrow(
        "Unknown attribute type: unknown",
      );
    });

    it("should throw error for missing amount", () => {
      const parsedEffect: ParsedEffect = {
        type: "attribute",
        target: chosenCharacterOfYours,
        parameters: { attribute: "strength" },
      };

      expect(() => createEffectFromParsed(parsedEffect)).toThrow(
        "Attribute effect requires amount and target",
      );
    });

    it("should throw error for missing target", () => {
      const parsedEffect: ParsedEffect = {
        type: "attribute",
        amount: 2,
        parameters: { attribute: "strength" },
      };

      expect(() => createEffectFromParsed(parsedEffect)).toThrow(
        "Attribute effect requires amount and target",
      );
    });
  });

  describe("Complex Scenarios", () => {
    it("should handle negative amounts correctly", () => {
      const effect = createStrengthModifierEffect(
        -2,
        chosenCharacterOfYours,
        "turn",
        "add",
      );

      expect(effect).toEqual({
        type: "attribute",
        attribute: "strength",
        amount: -2,
        modifier: "add",
        target: chosenCharacterOfYours,
        duration: "turn",
      });
    });

    it("should handle zero amounts", () => {
      const effect = createWillpowerModifierEffect(0, chosenCharacterOfYours);

      expect(effect).toEqual({
        type: "attribute",
        attribute: "willpower",
        amount: 0,
        modifier: "add",
        target: chosenCharacterOfYours,
      });
    });

    it("should handle large amounts", () => {
      const effect = createLoreModifierEffect(
        999,
        chosenCharacterOfYours,
        "static",
      );

      expect(effect).toEqual({
        type: "attribute",
        attribute: "lore",
        amount: 999,
        modifier: "add",
        target: chosenCharacterOfYours,
        duration: "static",
      });
    });
  });
});
