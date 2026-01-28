/**
 * Riftbound Ability Type Definitions
 *
 * Base ability types for Riftbound TCG.
 * These types define the structure of card abilities.
 */

/**
 * Base ability type - all abilities extend from this
 */
export interface BaseAbility {
  /** Unique identifier for the ability */
  readonly id?: string;
  /** Display text for the ability */
  readonly text?: string;
}

/**
 * Keyword ability - simple abilities with no additional parameters
 */
export interface KeywordAbility extends BaseAbility {
  readonly type: "keyword";
  readonly keyword: string;
}

/**
 * Triggered ability - activates when a specific event occurs
 */
export interface TriggeredAbility extends BaseAbility {
  readonly type: "triggered";
  readonly trigger: unknown; // Will be refined with TriggerEvent
  readonly effect: unknown; // Will be refined with Effect
}

/**
 * Activated ability - requires a cost to activate
 */
export interface ActivatedAbility extends BaseAbility {
  readonly type: "activated";
  readonly cost: unknown; // Will be refined with Cost types
  readonly effect: unknown; // Will be refined with Effect
}

/**
 * Static ability - provides continuous effects
 */
export interface StaticAbility extends BaseAbility {
  readonly type: "static";
  readonly effect: unknown; // Will be refined with StaticEffect
}

/**
 * Union type for all ability types
 */
export type Ability =
  | KeywordAbility
  | TriggeredAbility
  | ActivatedAbility
  | StaticAbility;

/**
 * Type guard for keyword abilities
 */
export function isKeywordAbility(ability: Ability): ability is KeywordAbility {
  return ability.type === "keyword";
}

/**
 * Type guard for triggered abilities
 */
export function isTriggeredAbility(
  ability: Ability,
): ability is TriggeredAbility {
  return ability.type === "triggered";
}

/**
 * Type guard for activated abilities
 */
export function isActivatedAbility(
  ability: Ability,
): ability is ActivatedAbility {
  return ability.type === "activated";
}

/**
 * Type guard for static abilities
 */
export function isStaticAbility(ability: Ability): ability is StaticAbility {
  return ability.type === "static";
}
