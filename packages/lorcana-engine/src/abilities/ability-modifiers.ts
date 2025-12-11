/**
 * Ability Modifiers (Rule 7.8)
 *
 * Modifiers that grant, remove, or restrict abilities and actions:
 * - "gain" adds an ability or keyword
 * - "lose" removes an ability or keyword
 * - "can't" prevents an action (prohibition beats permission)
 * - "must" forces an action
 */

import type { CardId } from "../types/game-state";
import type { Keyword } from "../types/keywords";
import type {
  AbilityModifier,
  Duration,
  ExtendedAbilityDefinition,
  ModifierType,
} from "./ability-types";

/**
 * Create a "gain" modifier
 */
export function createGainModifier(
  sourceCardId: CardId,
  targetCardId: CardId,
  ability: ExtendedAbilityDefinition | Keyword,
  duration: Duration,
): AbilityModifier {
  return {
    id: `gain-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    type: "gain",
    sourceCardId,
    targetCardId,
    ability,
    duration,
  };
}

/**
 * Create a "lose" modifier
 */
export function createLoseModifier(
  sourceCardId: CardId,
  targetCardId: CardId,
  ability: ExtendedAbilityDefinition | Keyword,
  duration: Duration,
): AbilityModifier {
  return {
    id: `lose-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    type: "lose",
    sourceCardId,
    targetCardId,
    ability,
    duration,
  };
}

/**
 * Create a "can't" modifier (prohibition)
 */
export function createCantModifier(
  sourceCardId: CardId,
  targetCardId: CardId,
  action: string,
  duration: Duration,
): AbilityModifier {
  return {
    id: `cant-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    type: "cant",
    sourceCardId,
    targetCardId,
    action,
    duration,
  };
}

/**
 * Create a "must" modifier (requirement)
 */
export function createMustModifier(
  sourceCardId: CardId,
  targetCardId: CardId,
  action: string,
  duration: Duration,
): AbilityModifier {
  return {
    id: `must-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    type: "must",
    sourceCardId,
    targetCardId,
    action,
    duration,
  };
}

/**
 * Check if card has a "can't" modifier for an action
 * Prohibition beats permission (Rule 7.8)
 */
export function hasCantModifier(
  modifiers: AbilityModifier[],
  cardId: CardId,
  action: string,
): boolean {
  return modifiers.some(
    (m) =>
      m.type === "cant" && m.targetCardId === cardId && m.action === action,
  );
}

/**
 * Check if card has a "must" modifier for an action
 */
export function hasMustModifier(
  modifiers: AbilityModifier[],
  cardId: CardId,
  action: string,
): boolean {
  return modifiers.some(
    (m) =>
      m.type === "must" && m.targetCardId === cardId && m.action === action,
  );
}

/**
 * Get all "gain" modifiers for a card
 */
export function getGainModifiers(
  modifiers: AbilityModifier[],
  cardId: CardId,
): AbilityModifier[] {
  return modifiers.filter(
    (m) => m.type === "gain" && m.targetCardId === cardId,
  );
}

/**
 * Get all "lose" modifiers for a card
 */
export function getLoseModifiers(
  modifiers: AbilityModifier[],
  cardId: CardId,
): AbilityModifier[] {
  return modifiers.filter(
    (m) => m.type === "lose" && m.targetCardId === cardId,
  );
}

/**
 * Check if an action is allowed after considering all modifiers
 * Can't always beats can (prohibition beats permission)
 */
export function isActionAllowed(
  modifiers: AbilityModifier[],
  cardId: CardId,
  action: string,
  baseAllowed: boolean,
): boolean {
  // Can't always prevents the action
  if (hasCantModifier(modifiers, cardId, action)) {
    return false;
  }

  return baseAllowed;
}

/**
 * Get effective keywords for a card after modifiers
 */
export function getEffectiveKeywords(
  baseKeywords: Keyword[],
  gainModifiers: AbilityModifier[],
  loseModifiers: AbilityModifier[],
): Keyword[] {
  const keywords = [...baseKeywords];

  // Add gained keywords
  for (const modifier of gainModifiers) {
    if (modifier.ability) {
      // Only add if it's a keyword (not an ability definition)
      if (typeof modifier.ability === "string" || "type" in modifier.ability) {
        const keyword = modifier.ability as Keyword;
        // Avoid duplicates for simple keywords
        if (typeof keyword === "string") {
          if (!keywords.includes(keyword)) {
            keywords.push(keyword);
          }
        } else {
          keywords.push(keyword);
        }
      }
    }
  }

  // Remove lost keywords
  for (const modifier of loseModifiers) {
    if (modifier.ability) {
      const keywordToRemove = modifier.ability;
      const index = keywords.findIndex((k) => {
        if (typeof k === "string" && typeof keywordToRemove === "string") {
          return k === keywordToRemove;
        }
        if (
          typeof k === "object" &&
          "type" in k &&
          typeof keywordToRemove === "object" &&
          "type" in keywordToRemove
        ) {
          // Both are KeywordAbilityDefinition objects, compare by type
          return k.type === keywordToRemove.type;
        }
        return false;
      });
      if (index !== -1) {
        keywords.splice(index, 1);
      }
    }
  }

  return keywords;
}

/**
 * Common action types for can't/must modifiers
 */
export const ActionTypes = {
  QUEST: "quest",
  CHALLENGE: "challenge",
  USE_ABILITY: "useAbility",
  BE_CHALLENGED: "beChallenged",
  TAKE_DAMAGE: "takeDamage",
  BE_BANISHED: "beBanished",
  BE_CHOSEN: "beChosen",
  READY: "ready",
  EXERT: "exert",
} as const;
