/**
 * Abilities Module
 *
 * Complete ability system for Lorcana including:
 * - Triggered abilities (Rule 7.4)
 * - Activated abilities (Rule 7.5)
 * - Static abilities (Rule 7.6)
 * - Replacement effects (Rule 7.7)
 * - Ability modifiers (Rule 7.8)
 */

// Ability modifiers
export {
  ActionTypes,
  createCantModifier,
  createGainModifier,
  createLoseModifier,
  createMustModifier,
  getEffectiveKeywords,
  getGainModifiers,
  getLoseModifiers,
  hasCantModifier,
  hasMustModifier,
  isActionAllowed,
} from "./ability-modifiers";
// Ability types
export type {
  AbilityCost,
  AbilityModifier,
  AbilityParams,
  ActivatedAbilityDefinition,
  ActiveContinuousEffect,
  CardFilter,
  Duration,
  EffectDefinition,
  EffectType,
  ExtendedAbilityDefinition,
  GameEvent,
  GameEventType,
  ModifierType,
  ReplacementEffect,
  StaticAbilityDefinition,
  StaticEffectDefinition,
  StaticEffectType,
  TargetDefinition,
  TriggerCondition,
  TriggeredAbilityDefinition,
  TriggeredAbilityInstance,
} from "./ability-types";

// Activated abilities
export {
  type ActivatedAbilityError,
  canPayDiscardCost,
  canPayExertCost,
  canPayInkCost,
  canUseActivatedAbility,
  findActivatedAbility,
  getAbilityInkCost,
  getActivatedAbilities,
  isAbilityFree,
  requiresExert,
  validateActivatedAbility,
} from "./activated";
// Replacement effects
export {
  applyReplacementToEvent,
  CommonReplacements,
  canReplaceEvent,
  createReplacementEffect,
  findApplicableReplacement,
  getReplacementEffect,
  isSkipEffect,
} from "./replacement";
// Static abilities
export {
  calculateCostModifier,
  calculateLoreModifier,
  calculateStrengthModifier,
  calculateWillpowerModifier,
  createContinuousEffect,
  getGrantedKeywords,
  getStaticAbilities,
  isActionPrevented,
  isActionRequired,
  isDurationExpired,
  isStaticAbilityActive,
  matchesCardFilter,
} from "./static";
// Triggered abilities
export {
  createTriggeredInstance,
  getMatchingTriggers,
  getTriggeredAbilities,
  isFloatingTrigger,
  isOptionalTrigger,
  isWheneverTrigger,
  matchesTrigger,
} from "./triggered";
