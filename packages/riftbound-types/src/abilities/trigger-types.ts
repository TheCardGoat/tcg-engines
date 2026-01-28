/**
 * Riftbound Trigger Type Definitions
 *
 * Types for defining events that can trigger abilities.
 */

/**
 * Base trigger type
 */
export interface BaseTrigger {
  readonly type: string;
}

/**
 * When a card enters play trigger
 */
export interface EntersPlayTrigger extends BaseTrigger {
  readonly type: "entersPlay";
  readonly subject?: "self" | "any" | "other";
}

/**
 * When a card leaves play trigger
 */
export interface LeavesPlayTrigger extends BaseTrigger {
  readonly type: "leavesPlay";
  readonly subject?: "self" | "any" | "other";
}

/**
 * When damage is dealt trigger
 */
export interface DamageDealtTrigger extends BaseTrigger {
  readonly type: "damageDealt";
  readonly subject?: "self" | "any" | "other";
}

/**
 * Phase-based trigger
 */
export interface PhaseTrigger extends BaseTrigger {
  readonly type: "phase";
  readonly phase: string;
  readonly timing: "start" | "end";
}

/**
 * Turn-based trigger
 */
export interface TurnTrigger extends BaseTrigger {
  readonly type: "turn";
  readonly timing: "start" | "end";
  readonly whose?: "yours" | "opponents" | "any";
}

/**
 * When a card is played trigger
 */
export interface CardPlayedTrigger extends BaseTrigger {
  readonly type: "cardPlayed";
  readonly subject?: "self" | "any" | "other";
  readonly cardType?: string;
}

/**
 * Union type for all trigger types
 */
export type Trigger =
  | EntersPlayTrigger
  | LeavesPlayTrigger
  | DamageDealtTrigger
  | PhaseTrigger
  | TurnTrigger
  | CardPlayedTrigger;

/**
 * Type guard for phase triggers
 */
export function isPhaseTrigger(trigger: Trigger): trigger is PhaseTrigger {
  return trigger.type === "phase";
}

/**
 * Type guard for turn triggers
 */
export function isTurnTrigger(trigger: Trigger): trigger is TurnTrigger {
  return trigger.type === "turn";
}

/**
 * Type guard for self-referencing triggers
 */
export function isSelfTrigger(
  trigger: Trigger,
): trigger is EntersPlayTrigger | LeavesPlayTrigger | DamageDealtTrigger {
  return "subject" in trigger && trigger.subject === "self";
}
