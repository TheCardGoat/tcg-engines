/**
 * Static Ability Parser
 *
 * Parses static abilities from text.
 * Static abilities are continuous effects that are always active.
 * Examples:
 * - "Your characters gain Ward"
 * - "Your characters get +1 {S}"
 * - "While this character has no damage, he gets +2 {S}"
 * - "HIDDEN AWAY This character can't be challenged"
 */

import type { StaticAbility } from "../../cards/abilities/types/ability-types";
import type { StaticEffect } from "../../cards/abilities/types/effect-types";
import { extractNamedAbilityPrefix } from "../preprocessor";
import type { ParseResult } from "../types";
import { extractConditionText, parseCondition } from "./condition-parser";
import { parseEffect } from "./effect-parser";

/**
 * Parse a static ability from text
 *
 * @param text - Normalized ability text
 * @returns Parse result with static ability
 */
export function parseStaticAbility(text: string): ParseResult {
  // Extract named ability prefix if present
  const extracted = extractNamedAbilityPrefix(text);
  const name = extracted?.name;
  const remainingText = extracted?.remainingText || text;

  // Extract condition if present ("While X,")
  const conditionText = extractConditionText(remainingText);
  const condition = conditionText ? parseCondition(conditionText) : undefined;

  // Remove condition from text to get effect
  const effectText = conditionText
    ? remainingText.replace(
        new RegExp(`^While\\s+${conditionText},?\\s*`, "i"),
        "",
      )
    : remainingText;

  // Parse effect - static abilities use a subset of effects
  const parsedEffect = parseEffect(effectText);
  if (!parsedEffect) {
    // Try to parse as a restriction effect (e.g., "This character can't be challenged")
    if (effectText.match(/can'?t be challenged/i)) {
      const staticEffect: StaticEffect = {
        type: "restriction",
        restriction: "cant-be-challenged",
        target: "SELF",
      };

      const ability: StaticAbility = {
        type: "static",
        effect: staticEffect,
      };

      if (name) ability.name = name;
      if (condition) ability.condition = condition;

      return {
        success: true,
        ability: {
          ability,
          text,
          name,
        },
      };
    }

    // Try to parse "can't challenge"
    if (effectText.match(/can'?t challenge/i)) {
      const staticEffect: StaticEffect = {
        type: "restriction",
        restriction: "cant-challenge",
        target: "SELF",
      };

      const ability: StaticAbility = {
        type: "static",
        effect: staticEffect,
      };

      if (name) ability.name = name;
      if (condition) ability.condition = condition;

      return {
        success: true,
        ability: {
          ability,
          text,
          name,
        },
      };
    }

    // Try to parse "can't quest"
    if (effectText.match(/can'?t quest/i)) {
      const staticEffect: StaticEffect = {
        type: "restriction",
        restriction: "cant-quest",
        target: "SELF",
      };

      const ability: StaticAbility = {
        type: "static",
        effect: staticEffect,
      };

      if (name) ability.name = name;
      if (condition) ability.condition = condition;

      return {
        success: true,
        ability: {
          ability,
          text,
          name,
        },
      };
    }

    return {
      success: false,
      error: `Could not parse static effect: "${effectText}"`,
    };
  }

  // Validate that the effect is a valid static effect
  // Static effects are: gain-keyword, modify-stat, restriction, grant-ability
  if (!isValidStaticEffect(parsedEffect)) {
    return {
      success: false,
      error: `Effect type "${parsedEffect.type}" is not a valid static effect`,
      unparsedSegments: [effectText],
    };
  }

  // Build static ability
  const ability: StaticAbility = {
    type: "static",
    effect: parsedEffect as StaticEffect,
  };

  if (name) {
    ability.name = name;
  }

  if (condition) {
    ability.condition = condition;
  }

  return {
    success: true,
    ability: {
      ability,
      text,
      name,
    },
  };
}

/**
 * Check if an effect is valid for static abilities
 *
 * Static abilities typically use:
 * - gain-keyword
 * - modify-stat
 * - restriction effects
 * - grant-ability
 */
function isValidStaticEffect(effect: any): boolean {
  const validTypes = [
    "gain-keyword",
    "modify-stat",
    "restriction",
    "grant-ability",
  ];

  return validTypes.includes(effect.type);
}
