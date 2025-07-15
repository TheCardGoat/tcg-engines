// Effect Factory System for Action Text Parser
// Generates specific effect objects based on parsed patterns

import type { DynamicAmount } from "@lorcanito/lorcana-engine/abilities/amounts";
import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import type {
  CardEffectTarget,
  PlayerEffectTarget,
} from "@lorcanito/lorcana-engine/effects/effectTargets";
import type {
  AttributeEffect,
  BanishEffect,
  DamageEffect,
  DrawEffect,
} from "@lorcanito/lorcana-engine/effects/effectTypes";
import type { ParsedEffect } from "./types";

/**
 * Creates a draw effect that draws a single card
 */
export function createDrawACardEffect(
  target: PlayerEffectTarget = self,
): DrawEffect {
  return {
    type: "draw",
    amount: 1,
    target,
  };
}

/**
 * Creates a draw effect that draws X cards
 */
export function createDrawXCardsEffect(
  amount: number | DynamicAmount,
  target: PlayerEffectTarget = self,
): DrawEffect {
  return {
    type: "draw",
    amount,
    target,
  };
}

/**
 * Creates a damage effect with specified amount and target
 */
export function createDamageEffect(
  amount: number | DynamicAmount,
  target: CardEffectTarget,
): DamageEffect {
  return {
    type: "damage",
    amount,
    target,
  };
}

/**
 * Creates a banish effect with specified target
 */
export function createBanishEffect(target: CardEffectTarget): BanishEffect {
  return {
    type: "banish",
    target,
  };
}

/**
 * Creates a strength attribute effect (+X {S})
 */
export function createStrengthModifierEffect(
  amount: number | DynamicAmount,
  target: CardEffectTarget,
  duration?: "turn" | "next_turn" | "static" | "next" | "challenge",
  modifier: "add" | "subtract" = "add",
): AttributeEffect {
  return {
    type: "attribute",
    attribute: "strength",
    amount,
    modifier,
    target,
    ...(duration && { duration }),
  };
}

/**
 * Creates a willpower attribute effect (+X {W})
 */
export function createWillpowerModifierEffect(
  amount: number | DynamicAmount,
  target: CardEffectTarget,
  duration?: "turn" | "next_turn" | "static" | "next" | "challenge",
  modifier: "add" | "subtract" = "add",
): AttributeEffect {
  return {
    type: "attribute",
    attribute: "willpower",
    amount,
    modifier,
    target,
    ...(duration && { duration }),
  };
}

/**
 * Creates a lore attribute effect (+X lore)
 */
export function createLoreModifierEffect(
  amount: number | DynamicAmount,
  target: CardEffectTarget,
  duration?: "turn" | "next_turn" | "static" | "next" | "challenge",
  modifier: "add" | "subtract" = "add",
): AttributeEffect {
  return {
    type: "attribute",
    attribute: "lore",
    amount,
    modifier,
    target,
    ...(duration && { duration }),
  };
}

/**
 * Creates a cost attribute effect (costs X less/more)
 */
export function createCostModifierEffect(
  amount: number | DynamicAmount,
  target: CardEffectTarget,
  duration?: "turn" | "next_turn" | "static" | "next" | "challenge",
  modifier: "add" | "subtract" = "subtract",
): AttributeEffect {
  return {
    type: "attribute",
    attribute: "cost",
    amount,
    modifier,
    target,
    ...(duration && { duration }),
  };
}

/**
 * Creates a move cost attribute effect (move costs X less/more)
 */
export function createMoveCostModifierEffect(
  amount: number | DynamicAmount,
  target: CardEffectTarget,
  duration?: "turn" | "next_turn" | "static" | "next" | "challenge",
  modifier: "add" | "subtract" = "subtract",
): AttributeEffect {
  return {
    type: "attribute",
    attribute: "moveCost",
    amount,
    modifier,
    target,
    ...(duration && { duration }),
  };
}

/**
 * Creates a sing cost attribute effect (sing costs X less/more)
 */
export function createSingCostModifierEffect(
  amount: number | DynamicAmount,
  target: CardEffectTarget,
  duration?: "turn" | "next_turn" | "static" | "next" | "challenge",
  modifier: "add" | "subtract" = "subtract",
): AttributeEffect {
  return {
    type: "attribute",
    attribute: "singCost",
    amount,
    modifier,
    target,
    ...(duration && { duration }),
  };
}

/**
 * Factory function that creates effects based on ParsedEffect data
 */
export function createEffectFromParsed(
  parsedEffect: ParsedEffect,
): DrawEffect | DamageEffect | BanishEffect | AttributeEffect {
  switch (parsedEffect.type) {
    case "draw": {
      const amount = parsedEffect.amount || 1;
      const target = (parsedEffect.target as PlayerEffectTarget) || self;

      if (amount === 1) {
        return createDrawACardEffect(target);
      }
      return createDrawXCardsEffect(amount, target);
    }

    case "damage": {
      if (!(parsedEffect.amount && parsedEffect.target)) {
        throw new Error("Damage effect requires amount and target");
      }
      return createDamageEffect(
        parsedEffect.amount,
        parsedEffect.target as CardEffectTarget,
      );
    }

    case "banish": {
      if (!parsedEffect.target) {
        throw new Error("Banish effect requires target");
      }
      return createBanishEffect(parsedEffect.target as CardEffectTarget);
    }

    case "attribute": {
      if (!(parsedEffect.amount && parsedEffect.target)) {
        throw new Error("Attribute effect requires amount and target");
      }

      const attribute = parsedEffect.parameters.attribute;
      // Use appropriate default modifier based on attribute type
      const defaultModifier = ["cost", "moveCost", "singCost"].includes(
        attribute,
      )
        ? "subtract"
        : "add";
      const modifier = parsedEffect.parameters.modifier || defaultModifier;
      const duration = parsedEffect.duration as
        | "turn"
        | "next_turn"
        | "static"
        | "next"
        | "challenge"
        | undefined;

      switch (attribute) {
        case "strength":
          return createStrengthModifierEffect(
            parsedEffect.amount,
            parsedEffect.target as CardEffectTarget,
            duration,
            modifier,
          );
        case "willpower":
          return createWillpowerModifierEffect(
            parsedEffect.amount,
            parsedEffect.target as CardEffectTarget,
            duration,
            modifier,
          );
        case "lore":
          return createLoreModifierEffect(
            parsedEffect.amount,
            parsedEffect.target as CardEffectTarget,
            duration,
            modifier,
          );
        case "cost":
          return createCostModifierEffect(
            parsedEffect.amount,
            parsedEffect.target as CardEffectTarget,
            duration,
            modifier,
          );
        case "moveCost":
          return createMoveCostModifierEffect(
            parsedEffect.amount,
            parsedEffect.target as CardEffectTarget,
            duration,
            modifier,
          );
        case "singCost":
          return createSingCostModifierEffect(
            parsedEffect.amount,
            parsedEffect.target as CardEffectTarget,
            duration,
            modifier,
          );
        default:
          throw new Error(`Unknown attribute type: ${attribute}`);
      }
    }

    default:
      throw new Error(`Unknown effect type: ${parsedEffect.type}`);
  }
}

/**
 * Batch creates multiple effects from an array of ParsedEffect objects
 */
export function createEffectsFromParsed(
  parsedEffects: ParsedEffect[],
): (DrawEffect | DamageEffect | BanishEffect | AttributeEffect)[] {
  return parsedEffects.map(createEffectFromParsed);
}
