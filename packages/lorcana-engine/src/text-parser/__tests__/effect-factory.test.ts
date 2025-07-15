// Unit tests for Effect Factory System

import { describe, expect, it } from "@jest/globals";
import {
  chosenCharacter,
  chosenCharacterOfYours,
} from "@lorcanito/lorcana-engine/abilities/target";
import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import {
  createBanishEffect,
  createCostModifierEffect,
  createDamageEffect,
  createDrawACardEffect,
  createDrawXCardsEffect,
  createEffectFromParsed,
  createEffectsFromParsed,
  createLoreModifierEffect,
  createMoveCostModifierEffect,
  createSingCostModifierEffect,
  createStrengthModifierEffect,
  createWillpowerModifierEffect,
} from "../effect-factory";
import type { ParsedEffect } from "../types";

describe("Effect Factory", () => {
  describe("createDrawACardEffect", () => {
    it("should create a draw effect for 1 card with default target", () => {
      const effect = createDrawACardEffect();

      expect(effect).toEqual({
        type: "draw",
        amount: 1,
        target: self,
      });
    });

    it("should create a draw effect with custom target", () => {
      const customTarget = {
        type: "player" as const,
        value: "opponent" as const,
      };
      const effect = createDrawACardEffect(customTarget);

      expect(effect).toEqual({
        type: "draw",
        amount: 1,
        target: customTarget,
      });
    });
  });

  describe("createDrawXCardsEffect", () => {
    it("should create a draw effect for X cards", () => {
      const effect = createDrawXCardsEffect(3);

      expect(effect).toEqual({
        type: "draw",
        amount: 3,
        target: self,
      });
    });

    it("should create a draw effect with dynamic amount", () => {
      const dynamicAmount = {
        dynamic: true as const,
        type: "count",
        filters: [],
      };
      const effect = createDrawXCardsEffect(dynamicAmount);

      expect(effect).toEqual({
        type: "draw",
        amount: dynamicAmount,
        target: self,
      });
    });

    it("should create a draw effect with custom target", () => {
      const customTarget = {
        type: "player" as const,
        value: "opponent" as const,
      };
      const effect = createDrawXCardsEffect(2, customTarget);

      expect(effect).toEqual({
        type: "draw",
        amount: 2,
        target: customTarget,
      });
    });
  });

  describe("createDamageEffect", () => {
    it("should create a damage effect with amount and target", () => {
      const effect = createDamageEffect(3, chosenCharacter);

      expect(effect).toEqual({
        type: "damage",
        amount: 3,
        target: chosenCharacter,
      });
    });

    it("should create a damage effect with dynamic amount", () => {
      const dynamicAmount = {
        dynamic: true as const,
        type: "count",
        filters: [],
      };
      const effect = createDamageEffect(dynamicAmount, chosenCharacter);

      expect(effect).toEqual({
        type: "damage",
        amount: dynamicAmount,
        target: chosenCharacter,
      });
    });
  });

  describe("createBanishEffect", () => {
    it("should create a banish effect with target", () => {
      const effect = createBanishEffect(chosenCharacter);

      expect(effect).toEqual({
        type: "banish",
        target: chosenCharacter,
      });
    });

    it("should create a banish effect with specific target", () => {
      const effect = createBanishEffect(chosenCharacterOfYours);

      expect(effect).toEqual({
        type: "banish",
        target: chosenCharacterOfYours,
      });
    });
  });

  describe("createStrengthModifierEffect", () => {
    it("should create a strength modifier effect", () => {
      const effect = createStrengthModifierEffect(2, chosenCharacterOfYours);

      expect(effect).toEqual({
        type: "attribute",
        attribute: "strength",
        amount: 2,
        modifier: "add",
        target: chosenCharacterOfYours,
      });
    });

    it("should create a strength modifier effect with duration", () => {
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

    it("should create a strength modifier effect with subtract modifier", () => {
      const effect = createStrengthModifierEffect(
        2,
        chosenCharacterOfYours,
        undefined,
        "subtract",
      );

      expect(effect).toEqual({
        type: "attribute",
        attribute: "strength",
        amount: 2,
        modifier: "subtract",
        target: chosenCharacterOfYours,
      });
    });

    it("should create a strength modifier effect with dynamic amount", () => {
      const dynamicAmount = {
        dynamic: true as const,
        type: "count",
        filters: [],
      };
      const effect = createStrengthModifierEffect(
        dynamicAmount,
        chosenCharacterOfYours,
      );

      expect(effect).toEqual({
        type: "attribute",
        attribute: "strength",
        amount: dynamicAmount,
        modifier: "add",
        target: chosenCharacterOfYours,
      });
    });
  });

  describe("createWillpowerModifierEffect", () => {
    it("should create a willpower modifier effect", () => {
      const effect = createWillpowerModifierEffect(1, chosenCharacterOfYours);

      expect(effect).toEqual({
        type: "attribute",
        attribute: "willpower",
        amount: 1,
        modifier: "add",
        target: chosenCharacterOfYours,
      });
    });

    it("should create a willpower modifier effect with duration", () => {
      const effect = createWillpowerModifierEffect(
        2,
        chosenCharacterOfYours,
        "turn",
      );

      expect(effect).toEqual({
        type: "attribute",
        attribute: "willpower",
        amount: 2,
        modifier: "add",
        target: chosenCharacterOfYours,
        duration: "turn",
      });
    });

    it("should create a willpower modifier effect with subtract modifier", () => {
      const effect = createWillpowerModifierEffect(
        1,
        chosenCharacterOfYours,
        undefined,
        "subtract",
      );

      expect(effect).toEqual({
        type: "attribute",
        attribute: "willpower",
        amount: 1,
        modifier: "subtract",
        target: chosenCharacterOfYours,
      });
    });
  });

  describe("createLoreModifierEffect", () => {
    it("should create a lore modifier effect", () => {
      const effect = createLoreModifierEffect(1, chosenCharacterOfYours);

      expect(effect).toEqual({
        type: "attribute",
        attribute: "lore",
        amount: 1,
        modifier: "add",
        target: chosenCharacterOfYours,
      });
    });

    it("should create a lore modifier effect with duration", () => {
      const effect = createLoreModifierEffect(
        2,
        chosenCharacterOfYours,
        "turn",
      );

      expect(effect).toEqual({
        type: "attribute",
        attribute: "lore",
        amount: 2,
        modifier: "add",
        target: chosenCharacterOfYours,
        duration: "turn",
      });
    });
  });

  describe("createCostModifierEffect", () => {
    it("should create a cost modifier effect with default subtract", () => {
      const effect = createCostModifierEffect(2, chosenCharacter);

      expect(effect).toEqual({
        type: "attribute",
        attribute: "cost",
        amount: 2,
        modifier: "subtract",
        target: chosenCharacter,
      });
    });

    it("should create a cost modifier effect with add modifier", () => {
      const effect = createCostModifierEffect(
        1,
        chosenCharacter,
        undefined,
        "add",
      );

      expect(effect).toEqual({
        type: "attribute",
        attribute: "cost",
        amount: 1,
        modifier: "add",
        target: chosenCharacter,
      });
    });
  });

  describe("createMoveCostModifierEffect", () => {
    it("should create a move cost modifier effect", () => {
      const effect = createMoveCostModifierEffect(1, chosenCharacter);

      expect(effect).toEqual({
        type: "attribute",
        attribute: "moveCost",
        amount: 1,
        modifier: "subtract",
        target: chosenCharacter,
      });
    });
  });

  describe("createSingCostModifierEffect", () => {
    it("should create a sing cost modifier effect", () => {
      const effect = createSingCostModifierEffect(1, chosenCharacter);

      expect(effect).toEqual({
        type: "attribute",
        attribute: "singCost",
        amount: 1,
        modifier: "subtract",
        target: chosenCharacter,
      });
    });
  });

  describe("createEffectFromParsed", () => {
    it("should create a draw effect from parsed data", () => {
      const parsedEffect: ParsedEffect = {
        type: "draw",
        amount: 1,
        target: self,
        parameters: {},
      };

      const effect = createEffectFromParsed(parsedEffect);

      expect(effect).toEqual({
        type: "draw",
        amount: 1,
        target: self,
      });
    });

    it("should create a draw X cards effect from parsed data", () => {
      const parsedEffect: ParsedEffect = {
        type: "draw",
        amount: 3,
        target: self,
        parameters: {},
      };

      const effect = createEffectFromParsed(parsedEffect);

      expect(effect).toEqual({
        type: "draw",
        amount: 3,
        target: self,
      });
    });

    it("should create a damage effect from parsed data", () => {
      const parsedEffect: ParsedEffect = {
        type: "damage",
        amount: 2,
        target: chosenCharacter,
        parameters: {},
      };

      const effect = createEffectFromParsed(parsedEffect);

      expect(effect).toEqual({
        type: "damage",
        amount: 2,
        target: chosenCharacter,
      });
    });

    it("should create a banish effect from parsed data", () => {
      const parsedEffect: ParsedEffect = {
        type: "banish",
        target: chosenCharacter,
        parameters: {},
      };

      const effect = createEffectFromParsed(parsedEffect);

      expect(effect).toEqual({
        type: "banish",
        target: chosenCharacter,
      });
    });

    it("should create a strength attribute effect from parsed data", () => {
      const parsedEffect: ParsedEffect = {
        type: "attribute",
        amount: 3,
        target: chosenCharacterOfYours,
        duration: "turn",
        parameters: { attribute: "strength" },
      };

      const effect = createEffectFromParsed(parsedEffect);

      expect(effect).toEqual({
        type: "attribute",
        attribute: "strength",
        amount: 3,
        modifier: "add",
        target: chosenCharacterOfYours,
        duration: "turn",
      });
    });

    it("should create a willpower attribute effect from parsed data", () => {
      const parsedEffect: ParsedEffect = {
        type: "attribute",
        amount: 2,
        target: chosenCharacterOfYours,
        parameters: { attribute: "willpower" },
      };

      const effect = createEffectFromParsed(parsedEffect);

      expect(effect).toEqual({
        type: "attribute",
        attribute: "willpower",
        amount: 2,
        modifier: "add",
        target: chosenCharacterOfYours,
      });
    });

    it("should create a lore attribute effect from parsed data", () => {
      const parsedEffect: ParsedEffect = {
        type: "attribute",
        amount: 1,
        target: chosenCharacterOfYours,
        parameters: { attribute: "lore" },
      };

      const effect = createEffectFromParsed(parsedEffect);

      expect(effect).toEqual({
        type: "attribute",
        attribute: "lore",
        amount: 1,
        modifier: "add",
        target: chosenCharacterOfYours,
      });
    });

    it("should create a cost attribute effect from parsed data", () => {
      const parsedEffect: ParsedEffect = {
        type: "attribute",
        amount: 2,
        target: chosenCharacter,
        parameters: { attribute: "cost", modifier: "subtract" },
      };

      const effect = createEffectFromParsed(parsedEffect);

      expect(effect).toEqual({
        type: "attribute",
        attribute: "cost",
        amount: 2,
        modifier: "subtract",
        target: chosenCharacter,
      });
    });

    it("should throw error for damage effect without amount", () => {
      const parsedEffect: ParsedEffect = {
        type: "damage",
        target: chosenCharacter,
        parameters: {},
      };

      expect(() => createEffectFromParsed(parsedEffect)).toThrow(
        "Damage effect requires amount and target",
      );
    });

    it("should throw error for damage effect without target", () => {
      const parsedEffect: ParsedEffect = {
        type: "damage",
        amount: 2,
        parameters: {},
      };

      expect(() => createEffectFromParsed(parsedEffect)).toThrow(
        "Damage effect requires amount and target",
      );
    });

    it("should throw error for banish effect without target", () => {
      const parsedEffect: ParsedEffect = {
        type: "banish",
        parameters: {},
      };

      expect(() => createEffectFromParsed(parsedEffect)).toThrow(
        "Banish effect requires target",
      );
    });

    it("should throw error for attribute effect without amount", () => {
      const parsedEffect: ParsedEffect = {
        type: "attribute",
        target: chosenCharacterOfYours,
        parameters: { attribute: "strength" },
      };

      expect(() => createEffectFromParsed(parsedEffect)).toThrow(
        "Attribute effect requires amount and target",
      );
    });

    it("should throw error for unknown attribute type", () => {
      const parsedEffect: ParsedEffect = {
        type: "attribute",
        amount: 2,
        target: chosenCharacterOfYours,
        parameters: { attribute: "unknown" },
      };

      expect(() => createEffectFromParsed(parsedEffect)).toThrow(
        "Unknown attribute type: unknown",
      );
    });

    it("should throw error for unknown effect type", () => {
      const parsedEffect: ParsedEffect = {
        type: "unknown",
        parameters: {},
      };

      expect(() => createEffectFromParsed(parsedEffect)).toThrow(
        "Unknown effect type: unknown",
      );
    });
  });

  describe("createEffectsFromParsed", () => {
    it("should create multiple effects from parsed data array", () => {
      const parsedEffects: ParsedEffect[] = [
        {
          type: "draw",
          amount: 1,
          target: self,
          parameters: {},
        },
        {
          type: "damage",
          amount: 2,
          target: chosenCharacter,
          parameters: {},
        },
        {
          type: "banish",
          target: chosenCharacterOfYours,
          parameters: {},
        },
      ];

      const effects = createEffectsFromParsed(parsedEffects);

      expect(effects).toHaveLength(3);
      expect(effects[0]).toEqual({
        type: "draw",
        amount: 1,
        target: self,
      });
      expect(effects[1]).toEqual({
        type: "damage",
        amount: 2,
        target: chosenCharacter,
      });
      expect(effects[2]).toEqual({
        type: "banish",
        target: chosenCharacterOfYours,
      });
    });

    it("should handle empty array", () => {
      const effects = createEffectsFromParsed([]);
      expect(effects).toEqual([]);
    });
  });
});
