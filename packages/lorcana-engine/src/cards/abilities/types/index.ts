/**
 * Ability Types Index
 *
 * Re-exports all ability-related types from @tcg/lorcana-types for backwards compatibility.
 * This file maintains the existing API while delegating to the new types package.
 *
 * @example
 * ```typescript
 * import {
 *   Ability,
 *   Effect,
 *   Trigger,
 *   Condition,
 *   CharacterTarget,
 * } from "./types";
 * ```
 */

// Re-export everything from @tcg/lorcana-types
export * from "@tcg/lorcana-types";

// Local extensions (types not in @tcg/lorcana-types)
export type {
  Amount,
  CardTypeFilter,
  ForEachCounter,
  GrantAbilityEffect,
  LookAtCardsEffect,
  LookAtFollowUp,
  ModifyStatEffect,
  MoveDamageEffect,
  PlayCardEffect,
  PutDamageEffect,
  PutOnBottomEffect,
  PutUnderEffect,
  RemoveDamageEffect,
  RestrictionEffect,
  ReturnFromDiscardEffect,
  RevealHandEffect,
  SearchDeckEffect,
  VariableAmount,
} from "./effect-types";

export {
  isControlFlowEffect,
  isVariableAmount,
  targetsCharacters,
} from "./effect-types";
