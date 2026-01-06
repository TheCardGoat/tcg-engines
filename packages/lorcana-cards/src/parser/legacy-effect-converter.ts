/**
 * Legacy Effect Converter
 *
 * Converts legacy @lorcanito/lorcana-engine effect types to new @tcg/lorcana-types format.
 */

import type {
  BanishEffect,
  CharacterTarget,
  DealDamageEffect,
  DrawEffect,
  Effect,
  ExertEffect,
  GainKeywordEffect,
  GainLoreEffect,
  ItemTarget,
  LocationTarget,
  LookAtCardsEffect,
  LoseLoreEffect,
  PlayerTarget,
  ReadyEffect,
  RemoveDamageEffect,
  RestrictionEffect,
  SequenceEffect,
} from "@tcg/lorcana-types";

/**
 * Card target for effects (excludes generic card enum targets)
 * Includes only the specific card type targets that effects can use
 */
type EffectCardTarget = CharacterTarget | ItemTarget | LocationTarget;

/**
 * Damage effect target (characters and locations only)
 */
type DamageEffectTarget = CharacterTarget | LocationTarget;

import type {
  LegacyBanishEffect,
  LegacyDamageEffect,
  LegacyDrawEffect,
  LegacyEffect,
  LegacyExertEffect,
  LegacyGainKeywordEffect,
  LegacyGainLoreEffect,
  LegacyHealEffect,
  LegacyLoseLoreEffect,
  LegacyModifyStatEffect,
  LegacyMoveEffect,
  LegacyReadyEffect,
  LegacyRestrictionEffect,
  LegacyScryEffect,
} from "./legacy-ability-types";

/**
 * Convert legacy effect to new format
 *
 * @param legacyEffect - Legacy effect object
 * @returns New format effect
 */
export function convertLegacyEffect(legacyEffect: LegacyEffect): Effect {
  switch (legacyEffect.type) {
    case "scry":
      return convertScryEffect(legacyEffect);

    case "heal":
      return convertHealEffect(legacyEffect);

    case "damage":
      return convertDamageEffect(legacyEffect);

    case "banish":
      return convertBanishEffect(legacyEffect);

    case "draw":
      return convertDrawEffect(legacyEffect);

    case "move":
      return convertMoveEffect(legacyEffect);

    case "exert":
      return convertExertEffect(legacyEffect);

    case "ready":
      return convertReadyEffect(legacyEffect);

    case "ability":
      return convertGainKeywordEffect(legacyEffect);

    case "attribute":
      return convertModifyStatEffect(legacyEffect);

    case "restriction":
      return convertRestrictionEffect(legacyEffect);

    case "loseLore":
      return convertLoseLoreEffect(legacyEffect);

    case "gainLore":
      return convertGainLoreEffect(legacyEffect);

    default:
      throw new Error(
        `Unknown legacy effect type: ${(legacyEffect as { type: string }).type}`,
      );
  }
}

/**
 * Convert legacy scry effect to look-at-cards effect
 *
 * Legacy scry has complex structure with limits and tutor filters
 * New format uses look-at-cards with then clause
 */
function convertScryEffect(legacy: LegacyScryEffect): LookAtCardsEffect {
  const baseEffect: LookAtCardsEffect = {
    type: "look-at-cards",
    amount: legacy.amount,
    from: "top-of-deck",
    target: convertLegacyPlayerTarget(legacy.target),
  };

  // Handle tutor effects (find specific card and put in hand)
  if (legacy.tutorFilters && legacy.tutorFilters.length > 0) {
    const filterType = legacy.tutorFilters.find(
      (f) => f.filter === "characteristics",
    );
    if (
      filterType &&
      "value" in filterType &&
      Array.isArray(filterType.value)
    ) {
      const characteristic = filterType.value[0];
      const isSong = characteristic === "song";

      baseEffect.then = {
        action: "put-in-hand",
        count: legacy.limits?.hand ?? 1,
        filter: isSong
          ? { type: "card-type" as const, cardType: "song" as const }
          : {
              type: "classification" as const,
              classification: characteristic as string,
            },
      };
    }
  }

  // Handle "put rest on bottom" (very common in scry effects)
  if (legacy.mode === "bottom") {
    if (!baseEffect.then) {
      baseEffect.then = { action: "put-on-bottom" };
    } else if (typeof baseEffect.then === "object") {
      // For sequence effects, we need to put remaining cards on bottom
      // This is handled at higher level by wrapping in sequence
    }
  }

  return baseEffect;
}

/**
 * Convert legacy heal effect to remove-damage effect
 */
function convertHealEffect(legacy: LegacyHealEffect): RemoveDamageEffect {
  return {
    type: "remove-damage",
    amount: legacy.amount,
    upTo: legacy.upTo,
    target: convertLegacyToDamageTarget(legacy.target),
  };
}

/**
 * Convert legacy damage effect to deal-damage effect
 */
function convertDamageEffect(legacy: LegacyDamageEffect): DealDamageEffect {
  return {
    type: "deal-damage",
    amount: legacy.amount,
    target: convertLegacyToDamageTarget(legacy.target),
  };
}

/**
 * Convert legacy banish effect
 */
function convertBanishEffect(legacy: LegacyBanishEffect): BanishEffect {
  return {
    type: "banish",
    target: convertLegacyCardTarget(legacy.target),
  };
}

/**
 * Convert legacy draw effect
 */
function convertDrawEffect(legacy: LegacyDrawEffect): DrawEffect {
  const target =
    legacy.target === "self"
      ? "CONTROLLER"
      : legacy.target === "opponent"
        ? "OPPONENT"
        : (convertLegacyCardTarget(legacy.target) as PlayerTarget);

  return {
    type: "draw",
    amount: legacy.amount,
    target,
  };
}

/**
 * Convert legacy move effect to zone movement
 */
function convertMoveEffect(legacy: LegacyMoveEffect): Effect {
  // Legacy "move" effects are typically:
  // - Move to hand -> return-to-hand
  // - Move to discard -> banish (already handled)
  // - Move from deck to hand -> return-from-discard variant

  if (legacy.to === "hand") {
    return {
      type: "return-to-hand",
      target: convertLegacyCardTarget(legacy.target),
    };
  }

  // For other movement types, we may need to map to different effects
  // This is a simplified version - may need expansion based on actual cards
  return {
    type: "banish",
    target: convertLegacyCardTarget(legacy.target),
  };
}

/**
 * Convert legacy exert effect
 */
function convertExertEffect(legacy: LegacyExertEffect): ExertEffect {
  return {
    type: "exert",
    target: convertLegacyCardTarget(legacy.target),
  };
}

/**
 * Convert legacy ready effect
 */
function convertReadyEffect(legacy: LegacyReadyEffect): ReadyEffect {
  return {
    type: "ready",
    target: convertLegacyCardTarget(legacy.target),
  };
}

/**
 * Convert legacy gain keyword effect
 */
function convertGainKeywordEffect(
  legacy: LegacyGainKeywordEffect,
): GainKeywordEffect {
  const keywordMap: Record<
    string,
    | "Rush"
    | "Ward"
    | "Evasive"
    | "Bodyguard"
    | "Support"
    | "Reckless"
    | "Challenger"
    | "Resist"
  > = {
    rush: "Rush",
    ward: "Ward",
    evasive: "Evasive",
    bodyguard: "Bodyguard",
    support: "Support",
    reckless: "Reckless",
    challenger: "Challenger",
    resist: "Resist",
  };

  const mappedKeyword = keywordMap[legacy.keyword.toLowerCase()];
  if (!mappedKeyword) {
    throw new Error(`Unknown legacy keyword: ${legacy.keyword}`);
  }

  const result: GainKeywordEffect = {
    type: "gain-keyword",
    keyword: mappedKeyword,
    target: convertLegacyToCharacterTarget(legacy.target),
  };

  if (legacy.value !== undefined) {
    result.value = legacy.value;
  }

  return result;
}

/**
 * Convert legacy modify stat effect
 */
function convertModifyStatEffect(legacy: LegacyModifyStatEffect): Effect {
  // Legacy "attribute" effect for modifying stats
  // Maps to modify-stat in new format
  return {
    type: "modify-stat",
    stat: legacy.stat,
    modifier: legacy.amount,
    target: convertLegacyToCharacterTarget(legacy.target),
  };
}

/**
 * Convert legacy restriction effect
 */
function convertRestrictionEffect(
  legacy: LegacyRestrictionEffect,
): RestrictionEffect {
  const restrictionMap: Record<string, RestrictionEffect["restriction"]> = {
    "cant-sing": "cant-sing",
    "cant-quest": "cant-quest",
    "cant-challenge": "cant-challenge",
    "cant-be-challenged": "cant-be-challenged",
  };

  const mappedRestriction = restrictionMap[legacy.restriction];
  if (!mappedRestriction) {
    throw new Error(`Unknown legacy restriction: ${legacy.restriction}`);
  }

  const result: RestrictionEffect = {
    type: "restriction",
    restriction: mappedRestriction,
    target: legacy.target
      ? (convertLegacyCardTarget(legacy.target) as CharacterTarget)
      : "SELF",
  };

  return result;
}

/**
 * Convert legacy lose lore effect
 */
function convertLoseLoreEffect(legacy: LegacyLoseLoreEffect): LoseLoreEffect {
  return {
    type: "lose-lore",
    amount: legacy.amount,
    target: legacy.target === "self" ? "CONTROLLER" : "OPPONENT",
  };
}

/**
 * Convert legacy gain lore effect
 */
function convertGainLoreEffect(legacy: LegacyGainLoreEffect): GainLoreEffect {
  return {
    type: "gain-lore",
    amount: legacy.amount,
    target: legacy.target === "self" ? "CONTROLLER" : "OPPONENT",
  };
}

// ============================================================================
// Target Conversion Helpers
// ============================================================================

/**
 * Convert legacy target to DamageEffectTarget (characters and locations only)
 */
function convertLegacyToDamageTarget(
  legacyTarget:
    | { type: "card" | "player"; value: number | "all"; filters?: unknown[] }
    | "self"
    | "opponent",
): DamageEffectTarget {
  // Handle simple string targets - return card references for effects
  if (legacyTarget === "self") {
    return { ref: "self" };
  }
  if (legacyTarget === "opponent") {
    return { ref: "opponent" };
  }

  // Handle player type targets
  if (typeof legacyTarget === "object" && legacyTarget.type === "player") {
    // For player-type targets, return a card reference
    if (legacyTarget.filters) {
      const ownerFilter = legacyTarget.filters.find(
        (f): f is { filter: string; value?: string } =>
          typeof f === "object" &&
          f !== null &&
          "filter" in f &&
          f.filter === "owner",
      );
      if (ownerFilter && "value" in ownerFilter) {
        return ownerFilter.value === "self"
          ? { ref: "controller" }
          : { ref: "opponent" };
      }
    }
    return { ref: "controller" };
  }

  // Handle card type targets - default to chosen character
  // (legacy format doesn't distinguish, so we default to character)
  if (legacyTarget.value === 1) {
    return "CHOSEN_CHARACTER";
  }

  return "CHOSEN_CHARACTER";
}

/**
 * Convert legacy target to EffectCardTarget (for effects that target cards)
 */
function convertLegacyCardTarget(
  legacyTarget:
    | { type: "card" | "player"; value: number | "all"; filters?: unknown[] }
    | "self"
    | "opponent",
): EffectCardTarget {
  // Handle simple string targets - return card references for effects
  if (legacyTarget === "self") {
    return { ref: "self" };
  }
  if (legacyTarget === "opponent") {
    return { ref: "opponent" };
  }

  // Handle player type targets
  if (typeof legacyTarget === "object" && legacyTarget.type === "player") {
    // For player-type targets, return a card reference
    if (legacyTarget.filters) {
      const ownerFilter = legacyTarget.filters.find(
        (f): f is { filter: string; value?: string } =>
          typeof f === "object" &&
          f !== null &&
          "filter" in f &&
          f.filter === "owner",
      );
      if (ownerFilter && "value" in ownerFilter) {
        return ownerFilter.value === "self"
          ? { ref: "controller" }
          : { ref: "opponent" };
      }
    }
    return { ref: "controller" };
  }

  // Handle card type targets - default to chosen character
  if (legacyTarget.value === 1) {
    return "CHOSEN_CHARACTER";
  }

  return "CHOSEN_CHARACTER";
}

/**
 * Convert legacy target to CharacterTarget (for effects that only target characters)
 */
function convertLegacyToCharacterTarget(
  legacyTarget:
    | { type: "card" | "player"; value: number | "all"; filters?: unknown[] }
    | "self"
    | "opponent",
): CharacterTarget {
  // Handle simple string targets
  if (legacyTarget === "self") {
    return "SELF";
  }
  if (legacyTarget === "opponent") {
    return "CHOSEN_OPPOSING_CHARACTER";
  }

  // Handle player type targets - convert to character targeting
  if (typeof legacyTarget === "object" && legacyTarget.type === "player") {
    if (legacyTarget.filters) {
      const ownerFilter = legacyTarget.filters.find(
        (f): f is { filter: string; value?: string } =>
          typeof f === "object" &&
          f !== null &&
          "filter" in f &&
          f.filter === "owner",
      );
      if (ownerFilter && "value" in ownerFilter) {
        return ownerFilter.value === "self"
          ? "CHOSEN_CHARACTER_OF_YOURS"
          : "CHOSEN_OPPOSING_CHARACTER";
      }
    }
    return "CHOSEN_CHARACTER_OF_YOURS";
  }

  // Handle card type targets
  if (legacyTarget.value === 1) {
    return "CHOSEN_CHARACTER";
  }

  return "CHOSEN_CHARACTER";
}

/**
 * Convert legacy player target to new format
 */
function convertLegacyPlayerTarget(
  legacyTarget:
    | { type: "card" | "player"; value: number | "all"; filters?: unknown[] }
    | "self"
    | "opponent",
): PlayerTarget {
  // Handle simple string targets
  if (legacyTarget === "self") {
    return "CONTROLLER";
  }
  if (legacyTarget === "opponent") {
    return "OPPONENT";
  }

  // Handle player type targets
  if (typeof legacyTarget === "object" && legacyTarget.type === "player") {
    // Check owner filter
    if (legacyTarget.filters) {
      const ownerFilter = legacyTarget.filters.find(
        (f): f is { filter: string; value?: string } =>
          typeof f === "object" &&
          f !== null &&
          "filter" in f &&
          f.filter === "owner",
      );
      if (ownerFilter && "value" in ownerFilter) {
        return ownerFilter.value === "self" ? "CONTROLLER" : "OPPONENT";
      }
    }
    return "CONTROLLER";
  }

  // Check if target filters specify owner (for card type targets that affect players)
  if (typeof legacyTarget === "object" && legacyTarget.filters) {
    const ownerFilter = legacyTarget.filters.find(
      (f): f is { filter: string; value?: string } =>
        typeof f === "object" &&
        f !== null &&
        "filter" in f &&
        f.filter === "owner",
    );
    if (ownerFilter && "value" in ownerFilter) {
      return ownerFilter.value === "self" ? "CONTROLLER" : "OPPONENT";
    }
  }

  return "CONTROLLER";
}

/**
 * Convert multiple legacy effects to a sequence effect
 *
 * Legacy abilities often have multiple effects in an array
 * These map to sequence effects in the new format
 */
export function convertLegacyEffectsToSequence(
  legacyEffects: LegacyEffect[],
): Effect | SequenceEffect {
  if (legacyEffects.length === 0) {
    throw new Error("Cannot convert empty effects array");
  }

  if (legacyEffects.length === 1) {
    return convertLegacyEffect(legacyEffects[0]);
  }

  const convertedEffects = legacyEffects.map(convertLegacyEffect);

  return {
    type: "sequence",
    steps: convertedEffects,
  };
}
