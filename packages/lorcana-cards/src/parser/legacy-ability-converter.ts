/**
 * Legacy Ability Converter
 *
 * Converts legacy @lorcanito/lorcana-engine abilities to new @tcg/lorcana-types format.
 * Orchestrates conversion using effect and target converters.
 */

import type {
  Ability,
  AbilityCost,
  AbilityDefinition,
  ActionAbility,
  ActivatedAbility,
  Condition,
  KeywordAbility,
  SequenceEffect,
  StaticAbility,
  StaticEffect,
  Trigger,
  TriggeredAbility,
} from "@tcg/lorcana-types";
import type {
  LegacyAbility,
  LegacyInlineAbility,
  LegacyKeywordHelperResult,
  LegacyWhenHelperResult,
} from "./legacy-ability-types";
import { convertLegacyEffectsToSequence } from "./legacy-effect-converter";
import {
  convertFilters,
  convertLegacyToCharacterTarget,
} from "./legacy-target-converter";

/**
 * Convert legacy ability to new format
 *
 * @param legacyAbility - Legacy ability object or helper result
 * @param cardId - Card ID for generating unique ability IDs
 * @param abilityIndex - Index of this ability in the abilities array
 * @returns New format ability with id and text
 */
export function convertLegacyAbility(
  legacyAbility: LegacyAbility,
  cardId: string,
  abilityIndex: number,
): AbilityDefinition {
  // Generate unique ability ID
  const id = `${cardId}-${abilityIndex + 1}`;

  // Extract text if available
  const text =
    typeof legacyAbility === "object" &&
    legacyAbility !== null &&
    "text" in legacyAbility
      ? ((legacyAbility as { text?: string }).text ?? "")
      : "";

  // Get the base ability
  const baseAbility = convertLegacyAbilityBase(
    legacyAbility,
    cardId,
    abilityIndex,
  );

  // Return as AbilityDefinition with id and text
  return {
    ...baseAbility,
    id,
    text,
  } as AbilityDefinition;
}

/**
 * Convert legacy ability to base Ability type (without id/text)
 */
function convertLegacyAbilityBase(
  legacyAbility: LegacyAbility,
  cardId: string,
  abilityIndex: number,
): Ability {
  // Check if it's a helper function result
  if (isKeywordHelperResult(legacyAbility)) {
    return convertKeywordHelperResult(legacyAbility);
  }

  if (isWhenHelperResult(legacyAbility)) {
    return convertWhenHelperResult(legacyAbility);
  }

  // It's an inline ability
  return convertInlineAbility(legacyAbility, abilityIndex);
}

/**
 * Convert keyword helper result (e.g., voicelessAbility, singerAbility)
 */
function convertKeywordHelperResult(
  legacy: LegacyKeywordHelperResult,
): KeywordAbility | StaticAbility {
  const helperName = legacy._helperName;

  switch (helperName) {
    case "voicelessAbility":
      // Voiceless is a static ability that prevents singing
      return {
        type: "static",
        effect: {
          type: "restriction",
          restriction: "cant-sing",
          target: "SELF",
        } as StaticEffect,
      };

    case "bodyguardAbility":
      return {
        type: "keyword",
        keyword: "Bodyguard",
      };

    case "evasiveAbility":
      return {
        type: "keyword",
        keyword: "Evasive",
      };

    case "wardAbility":
      return {
        type: "keyword",
        keyword: "Ward",
      };

    case "rushAbility":
      return {
        type: "keyword",
        keyword: "Rush",
      };

    case "recklessAbility":
      return {
        type: "keyword",
        keyword: "Reckless",
      };

    case "supportAbility":
      return {
        type: "keyword",
        keyword: "Support",
      };

    default:
      throw new Error(`Unknown keyword helper: ${helperName}`);
  }
}

/**
 * Convert when/whenever helper result
 */
function convertWhenHelperResult(
  legacy: LegacyWhenHelperResult,
): TriggeredAbility {
  const helperName = legacy._helperName;
  const inlineAbility = legacy.ability;

  // Convert the trigger
  const trigger = convertHelperNameToTrigger(helperName);

  // Convert the effect
  const effect = inlineAbility.effects
    ? convertLegacyEffectsToSequence(inlineAbility.effects)
    : ({ type: "sequence", steps: [] } as SequenceEffect);

  const result: TriggeredAbility = {
    type: "triggered",
    trigger,
    effect,
  };

  // Add name if present
  if (inlineAbility.name) {
    result.name = inlineAbility.name;
  }

  // Add optional flag
  if (inlineAbility.optional) {
    // Wrap in optional effect
    result.effect = {
      type: "optional",
      effect: result.effect,
      chooser: "CONTROLLER",
    };
  }

  return result;
}

/**
 * Convert inline ability object
 */
function convertInlineAbility(
  legacy: LegacyInlineAbility,
  _id: number,
): Ability {
  // Check for static keyword abilities (e.g., Singer)
  if (legacy.type === "static" && legacy.ability === "singer") {
    return {
      type: "keyword",
      keyword: "Singer",
      value: legacy.value ?? 0,
    } as KeywordAbility;
  }

  // Regular ability types
  switch (legacy.type) {
    case "resolution":
      return convertResolutionAbility(legacy);

    case "activated":
      return convertActivatedAbility(legacy);

    case "static":
      return convertStaticAbility(legacy);

    default:
      throw new Error(
        `Unknown legacy ability type: ${(legacy as { type: string }).type}`,
      );
  }
}

/**
 * Convert resolution ability (used in action cards)
 */
function convertResolutionAbility(legacy: LegacyInlineAbility): ActionAbility {
  const effect = legacy.effects
    ? convertLegacyEffectsToSequence(legacy.effects)
    : ({ type: "sequence", steps: [] } as SequenceEffect);

  return {
    type: "action",
    effect,
  };
}

/**
 * Convert activated ability
 */
function convertActivatedAbility(
  legacy: LegacyInlineAbility,
): ActivatedAbility {
  const effect = legacy.effects
    ? convertLegacyEffectsToSequence(legacy.effects)
    : ({ type: "sequence", steps: [] } as SequenceEffect);

  const result: ActivatedAbility = {
    type: "activated",
    cost: convertLegacyCosts(legacy.costs ?? []),
    effect,
  };

  // Add name if present
  if (legacy.name) {
    result.name = legacy.name;
  }

  return result;
}

/**
 * Convert static ability
 */
function convertStaticAbility(legacy: LegacyInlineAbility): StaticAbility {
  // Static abilities need special handling
  // For now, return a basic structure
  const result: StaticAbility = {
    type: "static",
    effect: {
      type: "restriction",
      restriction: "cant-sing", // Placeholder
      target: "SELF",
    } as StaticEffect,
  };

  // Add name if present
  if (legacy.name) {
    result.name = legacy.name;
  }

  return result;
}

/**
 * Convert legacy costs to new format
 */
function convertLegacyCosts(
  costs: Array<{ type: string; amount?: number }>,
): AbilityCost {
  const result: AbilityCost = {};

  for (const cost of costs) {
    switch (cost.type) {
      case "exert":
        result.exert = true;
        break;

      case "ink":
        result.ink = cost.amount ?? 1;
        break;

      case "banish":
        result.banishSelf = true;
        break;

      case "damage":
        result.damageSelf = cost.amount;
        break;

      default:
        console.warn(`Unknown cost type: ${cost.type}`);
    }
  }

  return result;
}

/**
 * Convert helper name to trigger event
 */
function convertHelperNameToTrigger(helperName: string): Trigger {
  switch (helperName) {
    case "whenYouPlayThisCharAbility":
      return {
        event: "play",
        timing: "when",
        on: "SELF",
      };

    case "wheneverThisCharacterQuests":
      return {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      };

    case "atStartOfTurn":
      return {
        event: "start-turn",
        timing: "at",
        on: "YOU",
      };

    case "whenThisCharacterChallenges":
      return {
        event: "challenge",
        timing: "when",
        on: "SELF",
      };

    case "whenCharacterIsBanished":
      return {
        event: "banish",
        timing: "when",
        on: "SELF",
      };

    default:
      throw new Error(`Unknown when helper: ${helperName}`);
  }
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if legacy ability is a keyword helper result
 */
function isKeywordHelperResult(
  ability: LegacyAbility,
): ability is LegacyKeywordHelperResult {
  return (
    typeof ability === "object" && ability !== null && "_helperName" in ability
  );
}

/**
 * Check if legacy ability is a when helper result
 */
function isWhenHelperResult(
  ability: LegacyAbility,
): ability is LegacyWhenHelperResult {
  return (
    typeof ability === "object" && ability !== null && "_helperName" in ability
  );
}

/**
 * Check if legacy ability is an inline ability
 */
function isInlineAbility(
  ability: LegacyAbility,
): ability is LegacyInlineAbility {
  return typeof ability === "object" && ability !== null && "type" in ability;
}

/**
 * Convert all abilities in a legacy card
 *
 * @param legacyAbilities - Array of legacy abilities
 * @param cardId - Card ID for tracking
 * @returns Array of converted abilities with id and text
 */
export function convertLegacyAbilities(
  legacyAbilities: LegacyAbility[],
  cardId: string,
): AbilityDefinition[] {
  return legacyAbilities.map((ability, index) =>
    convertLegacyAbility(ability, cardId, index),
  );
}
