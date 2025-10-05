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
  ModalEffect,
  MoveCardEffect,
  MoveDamageEffect,
} from "@lorcanito/lorcana-engine/effects/effectTypes";
import { parseTargetFromText } from "./target-mapper";
import type { ParsedEffect } from "./types";

/**
 * Creates a move damage effect
 */
export function createMoveDamageEffect(
  amount: number | DynamicAmount,
  from: CardEffectTarget,
  to: CardEffectTarget,
): MoveDamageEffect {
  return {
    type: "move-damage",
    amount,
    target: from,
    to,
  };
}

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
 * Creates a move card effect
 */
export function createMoveCardEffect(
  target: CardEffectTarget,
  to: "hand" | "discard" | "play" | "deck" | "inkwell",
  exerted?: boolean,
  bottom?: boolean,
  isPrivate?: boolean,
): MoveCardEffect {
  return {
    type: "move",
    target,
    to,
    exerted,
    bottom,
    isPrivate,
  };
}

/**
 * Creates a modal effect with multiple modes
 */
export function createModalEffect(
  modes: Array<{
    id: string;
    text: string;
    effects: any[];
    optional?: boolean;
  }>,
  target?: CardEffectTarget,
): ModalEffect {
  return {
    type: "modal",
    modes: modes.map((mode) => ({
      id: mode.id,
      text: mode.text,
      effects: mode.effects,
      optional: mode.optional,
      resolveEffectsIndividually: false,
    })),
    target,
  };
}

/**
 * Factory function that creates effects based on ParsedEffect data
 */
export function createEffectFromParsed(
  parsedEffect: ParsedEffect,
):
  | DrawEffect
  | DamageEffect
  | BanishEffect
  | AttributeEffect
  | MoveCardEffect
  | ModalEffect
  | MoveDamageEffect {
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

    case "move": {
      const to = parsedEffect.parameters.to as
        | "hand"
        | "discard"
        | "play"
        | "deck"
        | "inkwell";
      const exerted = parsedEffect.parameters.exerted as boolean;
      const facedown = parsedEffect.parameters.facedown as boolean;

      // If target is already resolved, use it
      if (parsedEffect.target) {
        return createMoveCardEffect(
          parsedEffect.target as CardEffectTarget,
          to,
          exerted,
          facedown,
          facedown, // facedown cards are private
        );
      }

      // Try to parse the target from the targetText
      const targetText = parsedEffect.parameters.targetText || "";
      const parsedTarget = parseTargetFromText(targetText);

      let target: CardEffectTarget;
      if (
        parsedTarget &&
        "type" in parsedTarget &&
        parsedTarget.type === "card"
      ) {
        target = parsedTarget;
      } else {
        // Fallback: construct a basic target
        target = {
          type: "card",
          value: 1,
          filters: [
            { filter: "zone", value: to === "hand" ? "discard" : "play" }, // From zone
            { filter: "owner", value: "self" },
          ],
        };
      }

      return createMoveCardEffect(target, to, exerted, facedown, facedown);
    }

    case "modal": {
      // Modal effects need special handling - they require parsing the modal options
      // For now, return a basic modal effect
      return createModalEffect([], parsedEffect.target as CardEffectTarget);
    }

    case "move-damage": {
      if (!parsedEffect.amount) {
        throw new Error("Move damage effect requires amount");
      }

      // Parse the from and to targets from the text
      const fromText = parsedEffect.parameters.fromText || "";
      const toText = parsedEffect.parameters.toText || "";

      let fromTarget: CardEffectTarget;
      let toTarget: CardEffectTarget;

      // Try to parse the targets from text
      const parsedFromTarget = parseTargetFromText(fromText);
      const parsedToTarget = parseTargetFromText(toText);

      if (
        parsedFromTarget &&
        "type" in parsedFromTarget &&
        parsedFromTarget.type === "card"
      ) {
        fromTarget = parsedFromTarget;
      } else {
        // Fallback: assume damaged characters
        fromTarget = {
          type: "card",
          value: "all",
          filters: [
            { filter: "zone", value: "play" },
            { filter: "owner", value: "self" },
            { filter: "status", value: "damaged" },
          ],
        };
      }

      if (
        parsedToTarget &&
        "type" in parsedToTarget &&
        parsedToTarget.type === "card"
      ) {
        toTarget = parsedToTarget;
      } else {
        // Fallback: assume chosen opposing character
        toTarget = {
          type: "card",
          value: 1,
          filters: [
            { filter: "zone", value: "play" },
            { filter: "owner", value: "opponent" },
            { filter: "type", value: "character" },
          ],
        };
      }

      return createMoveDamageEffect(parsedEffect.amount, fromTarget, toTarget);
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
): (
  | DrawEffect
  | DamageEffect
  | BanishEffect
  | AttributeEffect
  | MoveCardEffect
  | ModalEffect
  | MoveDamageEffect
)[] {
  return parsedEffects.map(createEffectFromParsed);
}
