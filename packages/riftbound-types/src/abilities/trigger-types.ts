/**
 * Riftbound Trigger Type Definitions
 *
 * Types for defining events that can trigger abilities.
 * Riftbound uses three timing words:
 * - "when" - triggers once when event occurs
 * - "whenever" - triggers each time event occurs
 * - "at" - triggers at a specific game phase
 */

import type { AnyTarget, Target } from "../targeting";
import type { Condition } from "./condition-types";

// ============================================================================
// Trigger Events
// ============================================================================

/**
 * All possible trigger events in Riftbound
 */
export type TriggerEvent =
  // Play events
  | "play-self" // When you play this card
  | "play-card" // When any card is played
  | "play-unit" // When a unit is played
  | "play-spell" // When a spell is played
  | "play-gear" // When a gear is played
  | "play-from-hidden" // When played from hidden

  // Combat events
  | "attack" // When attacking
  | "defend" // When defending
  | "win-combat" // When winning a combat
  | "lose-combat" // When losing a combat
  | "conquer" // When conquering a battlefield
  | "hold" // When holding a battlefield (scoring)

  // Movement events
  | "move" // When moving
  | "move-to-battlefield" // When moving to a battlefield
  | "move-from-battlefield" // When moving from a battlefield
  | "move-to-base" // When moving to base
  | "recall" // When recalled to base

  // State change events
  | "die" // When killed/destroyed
  | "take-damage" // When taking damage
  | "deal-damage" // When dealing damage
  | "become-mighty" // When becoming Mighty (5+ Might)
  | "buff" // When buffed
  | "spend-buff" // When buff is spent
  | "ready" // When readied
  | "exhaust" // When exhausted
  | "stun" // When stunned
  | "heal" // When healed

  // Resource events
  | "draw" // When drawing cards
  | "discard" // When discarding cards
  | "channel" // When channeling runes
  | "recycle" // When recycling cards
  | "add-resource" // When adding resources

  // Phase events
  | "beginning-phase" // At beginning phase
  | "channel-phase" // At channel phase
  | "main-phase" // At main phase
  | "end-of-turn" // At end of turn
  | "start-of-turn" // At start of turn (alias)

  // Targeting events
  | "choose" // When chosen by spell/ability
  | "attach-equipment" // When equipment is attached
  | "detach-equipment" // When equipment is detached

  // Scoring events
  | "score" // When scoring a point
  | "opponent-score" // When opponent scores

  // Special events
  | "reveal" // When revealed from deck
  | "enter-play" // When entering play (any method)
  | "leave-play"; // When leaving play (any method)

// ============================================================================
// Trigger Subject
// ============================================================================

/**
 * Simple trigger subjects (string literals)
 */
export type TriggerSubjectEnum =
  | "self" // This card
  | "friendly-units" // Your units
  | "friendly-other-units" // Your other units
  | "enemy-units" // Enemy units
  | "any-unit" // Any unit
  | "friendly-gear" // Your gear
  | "enemy-gear" // Enemy gear
  | "controller" // The controller (for player events)
  | "opponent" // The opponent
  | "any-player"; // Any player

/**
 * Query-based trigger subject for complex filtering
 */
export interface TriggerSubjectQuery {
  /** Whose card triggers this */
  readonly controller?: "friendly" | "enemy" | "any";

  /** What type of card */
  readonly cardType?: "unit" | "gear" | "spell" | "card";

  /** Additional filters */
  readonly filter?: string | string[];

  /** Exclude self from matching */
  readonly excludeSelf?: boolean;

  /** Tag filter (e.g., "Mech", "Dragon") */
  readonly tag?: string;

  /** Location filter */
  readonly location?: string;
}

/**
 * What entity triggers the event
 */
export type TriggerSubject = TriggerSubjectEnum | TriggerSubjectQuery;

// ============================================================================
// Trigger Restrictions
// ============================================================================

/**
 * Restrictions on when a trigger fires
 */
export type TriggerRestriction =
  | { readonly type: "once-per-turn" }
  | { readonly type: "first-time-each-turn" }
  | { readonly type: "once-per-game" }
  | { readonly type: "during-turn"; readonly whose: "your" | "opponent" }
  | { readonly type: "in-combat" }
  | { readonly type: "not-in-combat" };

// ============================================================================
// Trigger Definition
// ============================================================================

/**
 * Complete trigger definition
 *
 * @example "When you play this card"
 * { event: "play-self" }
 *
 * @example "Whenever this unit attacks"
 * { event: "attack", on: "self", timing: "whenever" }
 *
 * @example "When a friendly unit dies"
 * { event: "die", on: "friendly-units" }
 *
 * @example "At the start of your turn"
 * { event: "start-of-turn", on: "controller", timing: "at" }
 */
export interface Trigger {
  /** The event that causes this trigger to fire */
  readonly event: TriggerEvent;

  /** What entity triggers this event */
  readonly on?: TriggerSubject;

  /** Timing word (when/whenever/at) */
  readonly timing?: "when" | "whenever" | "at";

  /** Restrictions on when this trigger fires */
  readonly restrictions?: TriggerRestriction[];

  /** Additional condition that must be true */
  readonly condition?: Condition;
}

/**
 * Multiple events trigger (for "When X and when Y" patterns)
 */
export interface MultiEventTrigger {
  /** Multiple events that can trigger this */
  readonly events: TriggerEvent[];

  /** What entity triggers these events */
  readonly on?: TriggerSubject;

  /** Timing word */
  readonly timing?: "when" | "whenever" | "at";
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if trigger subject is a query object
 */
export function isTriggerSubjectQuery(subject: TriggerSubject): subject is TriggerSubjectQuery {
  return typeof subject === "object" && subject !== null;
}

/**
 * Check if trigger is self-referential
 */
export function isSelfTrigger(trigger: Trigger): boolean {
  return trigger.on === "self" || trigger.event === "play-self";
}

/**
 * Check if trigger is phase-based
 */
export function isPhaseTrigger(trigger: Trigger): boolean {
  return (
    trigger.event === "beginning-phase" ||
    trigger.event === "channel-phase" ||
    trigger.event === "main-phase" ||
    trigger.event === "end-of-turn" ||
    trigger.event === "start-of-turn"
  );
}

/**
 * Check if trigger is combat-related
 */
export function isCombatTrigger(trigger: Trigger): boolean {
  return (
    trigger.event === "attack" ||
    trigger.event === "defend" ||
    trigger.event === "win-combat" ||
    trigger.event === "lose-combat" ||
    trigger.event === "conquer" ||
    trigger.event === "hold"
  );
}

/**
 * Check if trigger has a restriction
 */
export function hasRestriction(trigger: Trigger, type: TriggerRestriction["type"]): boolean {
  return trigger.restrictions?.some((r) => r.type === type) ?? false;
}

// ============================================================================
// Common Trigger Patterns
// ============================================================================

/**
 * Pre-built common trigger patterns
 */
export const COMMON_TRIGGERS = {
  /** "When you play this card" */
  WHEN_PLAY_SELF: {
    event: "play-self",
    timing: "when",
  } as const satisfies Trigger,

  /** "When this unit attacks" */
  WHEN_ATTACK: {
    event: "attack",
    on: "self",
    timing: "when",
  } as const satisfies Trigger,

  /** "When this unit defends" */
  WHEN_DEFEND: {
    event: "defend",
    on: "self",
    timing: "when",
  } as const satisfies Trigger,

  /** "When this unit conquers" */
  WHEN_CONQUER: {
    event: "conquer",
    on: "self",
    timing: "when",
  } as const satisfies Trigger,

  /** "When this unit holds" */
  WHEN_HOLD: {
    event: "hold",
    on: "self",
    timing: "when",
  } as const satisfies Trigger,

  /** "When this card dies" */
  WHEN_DIE: {
    event: "die",
    on: "self",
    timing: "when",
  } as const satisfies Trigger,

  /** "When this unit moves" */
  WHEN_MOVE: {
    event: "move",
    on: "self",
    timing: "when",
  } as const satisfies Trigger,

  /** "When this unit moves to a battlefield" */
  WHEN_MOVE_TO_BATTLEFIELD: {
    event: "move-to-battlefield",
    on: "self",
    timing: "when",
  } as const satisfies Trigger,

  /** "At the start of your turn" */
  AT_START_OF_TURN: {
    event: "start-of-turn",
    on: "controller",
    timing: "at",
  } as const satisfies Trigger,

  /** "At the end of your turn" */
  AT_END_OF_TURN: {
    event: "end-of-turn",
    on: "controller",
    timing: "at",
  } as const satisfies Trigger,

  /** "Whenever you draw a card" */
  WHENEVER_DRAW: {
    event: "draw",
    on: "controller",
    timing: "whenever",
  } as const satisfies Trigger,

  /** "Whenever you discard a card" */
  WHENEVER_DISCARD: {
    event: "discard",
    on: "controller",
    timing: "whenever",
  } as const satisfies Trigger,

  /** "Whenever a friendly unit dies" */
  WHENEVER_FRIENDLY_UNIT_DIES: {
    event: "die",
    on: "friendly-units",
    timing: "whenever",
  } as const satisfies Trigger,

  /** "Whenever an enemy unit dies" */
  WHENEVER_ENEMY_UNIT_DIES: {
    event: "die",
    on: "enemy-units",
    timing: "whenever",
  } as const satisfies Trigger,
} as const;

// ============================================================================
// Builder Functions
// ============================================================================

/**
 * Create a trigger for when this card is played
 */
export function whenPlaySelf(): Trigger {
  return { event: "play-self", timing: "when" };
}

/**
 * Create a trigger for when this unit attacks
 */
export function whenAttack(): Trigger {
  return { event: "attack", on: "self", timing: "when" };
}

/**
 * Create a trigger for when this unit defends
 */
export function whenDefend(): Trigger {
  return { event: "defend", on: "self", timing: "when" };
}

/**
 * Create a trigger for when this unit conquers
 */
export function whenConquer(): Trigger {
  return { event: "conquer", on: "self", timing: "when" };
}

/**
 * Create a trigger for when this unit holds
 */
export function whenHold(): Trigger {
  return { event: "hold", on: "self", timing: "when" };
}

/**
 * Create a trigger for when this card dies
 */
export function whenDie(): Trigger {
  return { event: "die", on: "self", timing: "when" };
}

/**
 * Create a trigger for when this unit moves
 */
export function whenMove(): Trigger {
  return { event: "move", on: "self", timing: "when" };
}

/**
 * Create a custom trigger
 */
export function trigger(event: TriggerEvent, options?: Partial<Omit<Trigger, "event">>): Trigger {
  return { event, ...options };
}
