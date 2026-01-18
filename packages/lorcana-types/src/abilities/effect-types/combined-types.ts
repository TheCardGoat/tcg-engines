/**
 * Combined Effect Types
 *
 * Aggregates all effect types into the main Effect union type,
 * and provides shared type guards.
 */

// Import all effect types
import type {
  BanishEffect,
  DealDamageEffect,
  DiscardEffect,
  DrawEffect,
  ExertEffect,
  GainLoreEffect,
  LoseLoreEffect,
  MoveDamageEffect,
  PutDamageEffect,
  ReadyEffect,
  RemoveDamageEffect,
} from "./basic-effects";
import type {
  ChoiceEffect,
  ConditionalEffect,
  ForEachEffect,
  OptionalEffect,
  RepeatEffect,
  SequenceEffect,
} from "./control-flow";
import type {
  CostReductionEffect,
  DrawUntilHandSizeEffect,
  EntersPlayEffect,
  GainKeywordEffect,
  GrantAbilityEffect,
  LoseKeywordEffect,
  ModifyStatEffect,
  NameACardEffect,
  PropertyModificationEffect,
  PutOnTopEffect,
  RestrictionEffect,
  RevealHandEffect,
  RevealTopCardEffect,
  SearchDeckEffect,
  SetStatEffect,
  WinConditionEffect,
} from "./modifier-effects";
import type {
  EnablePlayFromUnderEffect,
  MoveCardsEffect,
  MoveToLocationEffect,
  PlayCardEffect,
  PutIntoInkwellEffect,
  PutOnBottomEffect,
  PutUnderEffect,
  ReturnFromDiscardEffect,
  ReturnToHandEffect,
  ShuffleIntoDeckEffect,
} from "./movement-effects";
import type { ScryEffect } from "./scry-effects";

// ============================================================================
// Combined Effect Type
// ============================================================================

/**
 * All possible effects
 */
export type Effect =
  // Draw/Discard
  | DrawEffect
  | DiscardEffect
  | ScryEffect
  // Damage
  | DealDamageEffect
  | PutDamageEffect
  | RemoveDamageEffect
  | MoveDamageEffect
  // Lore
  | GainLoreEffect
  | LoseLoreEffect
  // Card State
  | ExertEffect
  | ReadyEffect
  | BanishEffect
  // Zone Movement
  | MoveCardsEffect
  | ReturnToHandEffect
  | ReturnFromDiscardEffect
  | PutIntoInkwellEffect
  | PutUnderEffect
  | ShuffleIntoDeckEffect
  | PutOnBottomEffect
  // Play Card
  | PlayCardEffect
  | EnablePlayFromUnderEffect
  // Location Movement
  | MoveToLocationEffect
  // Stat Modification
  | ModifyStatEffect
  | SetStatEffect
  // Keywords
  | GainKeywordEffect
  | LoseKeywordEffect
  // Restrictions
  | RestrictionEffect
  | GrantAbilityEffect
  | CostReductionEffect
  | NameACardEffect
  | RevealTopCardEffect
  | PutOnTopEffect
  | DrawUntilHandSizeEffect
  // Control Flow
  | SequenceEffect
  | ChoiceEffect
  | ConditionalEffect
  | OptionalEffect
  | ForEachEffect
  | RepeatEffect
  // Reveal/Search
  | RevealHandEffect
  | SearchDeckEffect
  // Special State Modifications
  | EntersPlayEffect
  | WinConditionEffect
  | PropertyModificationEffect;

/**
 * Static effects (always active, used in static abilities)
 * These don't "happen" - they modify the game state
 */
export type StaticEffect =
  | ModifyStatEffect
  | GainKeywordEffect
  | RestrictionEffect
  | GrantAbilityEffect
  | EntersPlayEffect
  | WinConditionEffect
  | PropertyModificationEffect
  | CostReductionEffect;

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if effect is a control flow effect
 */
export function isControlFlowEffect(
  effect: Effect,
): effect is
  | SequenceEffect
  | ChoiceEffect
  | ConditionalEffect
  | OptionalEffect
  | ForEachEffect
  | RepeatEffect {
  return (
    effect.type === "sequence" ||
    effect.type === "choice" ||
    effect.type === "conditional" ||
    effect.type === "optional" ||
    effect.type === "for-each" ||
    effect.type === "repeat"
  );
}

/**
 * Check if effect targets characters
 *
 * Handles both string character targets and query-based character targets.
 * Query objects can be identified by character-specific properties like
 * `owner` (yours/opponent) or the presence of character filters.
 */
export function targetsCharacters(effect: Effect): boolean {
  if (!("target" in effect)) {
    return false;
  }

  const target = effect.target;

  // String character targets
  if (typeof target === "string") {
    return (
      target.includes("CHARACTER") ||
      target === "SELF" ||
      target === "THIS_CHARACTER"
    );
  }

  // Query-based character targets - check for character-specific properties
  // Character queries have 'owner' property or character filters
  if (typeof target === "object" && target !== null) {
    // Check for character query indicators
    return (
      "owner" in target || ("filter" in target && Array.isArray(target.filter))
    );
  }

  return false;
}

/**
 * Check if effect is a scry effect
 */
export function isScryEffect(effect: Effect): effect is ScryEffect {
  return effect.type === "scry";
}
