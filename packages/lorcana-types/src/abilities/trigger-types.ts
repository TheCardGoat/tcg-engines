/**
 * Trigger Types for Lorcana Abilities
 *
 * Defines when triggered abilities activate. Lorcana uses three timing words:
 * - "When" - triggers once when event occurs
 * - "Whenever" - triggers each time event occurs
 * - "At" - triggers at a specific game phase
 *
 * The trigger system uses the same targeting DSL as the rest of the codebase
 * to filter what causes a trigger to fire.
 *
 * @example "When you play this character, draw 2 cards"
 * ```typescript
 * { event: "play", timing: "when", on: "SELF" }
 * ```
 *
 * @example "Whenever this character quests, gain 1 lore"
 * ```typescript
 * { event: "quest", timing: "whenever", on: "SELF" }
 * ```
 *
 * @example "Whenever you play a character, draw a card"
 * ```typescript
 * { event: "play", timing: "whenever", on: { controller: "you", cardType: "character" } }
 * ```
 */

import type { Condition } from "./condition-types";
import type {
  CardReference,
  CharacterFilter,
  ItemFilter,
  LocationFilter,
  TargetController,
} from "./target-types";

// ============================================================================
// Trigger Timing
// ============================================================================

/**
 * When the trigger activates relative to the event
 *
 * - "when" - typically one-time triggers
 * - "whenever" - repeatable triggers
 * - "at" - phase-based triggers
 */
export type TriggerTiming = "when" | "whenever" | "at";

// ============================================================================
// Trigger Events
// ============================================================================

/**
 * Base trigger events - what action occurred
 *
 * These are the fundamental game actions. Use the `on` field
 * to specify what entity triggered the event.
 */
export type TriggerEvent =
  // Card actions
  | "play" // A card is played
  | "banish" // A card is banished
  | "leave-play" // A card leaves play (any reason)

  // Character actions
  | "quest" // A character quests
  | "challenge" // A character challenges another
  | "challenged" // A character is challenged
  | "damage" // A card takes damage
  | "exert" // A card is exerted
  | "ready" // A card is readied
  | "move" // A character moves to a location
  | "sing" // A character sings a song
  | "be-chosen" // A card is chosen by an action or ability

  // Combat-specific
  | "banish-in-challenge" // Banished specifically during a challenge
  | "deal-damage" // Deals damage (as opposed to taking damage)

  // Resource events
  | "draw" // A card is drawn
  | "discard" // A card is discarded
  | "ink" // A card is put into inkwell
  | "gain-lore" // Lore is gained
  | "lose-lore" // Lore is lost

  // Turn phases
  | "start-turn" // Start of turn
  | "end-turn" // End of turn

  // Additional events for parser support
  | "remove-damage" // Damage is removed from a character
  | "return-to-hand" // A card is returned to hand
  // Event aliases for parser compatibility
  | "start-of-turn" // Alias for start-turn
  | "end-of-turn" // Alias for end-turn
  // Extended events for card text coverage
  | "put-into-inkwell" // A card is put into inkwell
  | "add-to-inkwell" // Alias for put-into-inkwell
  | "put-card-under" // A card is put under another card
  // Additional trigger events
  | "support" // Support ability triggers
  | "inkwell"; // Card put into inkwell

// ============================================================================
// Trigger Subject (what triggers the event)
// ============================================================================

/**
 * Card type filter for triggers
 */
export type TriggerCardType = "character" | "action" | "item" | "location" | "song" | "card"; // Any card type

/**
 * Simple trigger subject - common patterns as string literals
 */
export type TriggerSubjectEnum =
  | "SELF" // This card
  | "YOUR_CHARACTERS" // Any of your characters
  | "YOUR_OTHER_CHARACTERS" // Your characters except this one
  | "OPPONENT_CHARACTERS" // Opponent's characters
  | "OPPOSING_CHARACTERS" // Alias for OPPONENT_CHARACTERS
  | "OTHER_CHARACTERS" // Any character except this one
  | "ANY_CHARACTER" // Any character
  | "YOUR_ITEMS" // Any of your items
  | "YOUR_OTHER_ITEMS" // Your items except this one
  | "YOUR_LOCATIONS" // Any of your locations
  | "YOUR_ACTIONS" // Any of your actions
  | "YOUR_SONGS" // Any of your songs
  | "YOU" // The controller (for lore/draw events)
  | "OPPONENT" // The opponent (for lore/draw events)
  | "ANY_PLAYER" // Any player
  // Classification-based triggers
  | "FLOODBORN_CHARACTERS" // Floodborn characters you play
  | "SELF_OR_SEVEN_DWARFS_CHARACTERS" // This character or Seven Dwarfs
  | "CINDERELLA_CHARACTERS" // Characters named Cinderella
  | "YOUR_CHARACTERS_COST_4_OR_MORE" // Your characters with cost 4+
  // Extended trigger subjects for card text coverage
  | "SONGS" // Songs (for song-related triggers)
  | "YOUR_BROOM_CHARACTERS" // Your Broom characters
  | "YOUR_MUSKETEER_CHARACTERS" // Your Musketeer characters
  | "YOUR_BODYGUARD_CHARACTERS" // Your Bodyguard characters
  | "CONTROLLER" // The controller of this card
  | "CHARACTERS_HERE" // Characters at this location
  | "YOUR_OTHER_STEEL_CHARACTERS" // Your other Steel characters
  // Additional trigger subjects for more card coverage
  | "CHARACTERS_AT_LOCATION" // Characters at a location
  | "CHARACTERS_MOVED_HERE" // Characters that moved here
  | "OPPONENTS_CARDS" // Opponent's cards
  | "YOUR_PIRATE_CHARACTERS" // Your Pirate characters
  | "CHARACTER_HERE" // Character at this location (singular)
  | "SONG" // Song (singular)
  | "YOUR_CHARACTERS_OR_LOCATIONS" // Your characters or locations
  | "YOUR_OTHER_AMETHYST_CHARACTERS" // Your other Amethyst characters
  | "YOUR_CHARACTERS_OR_LOCATIONS_WITH_CARD_UNDER"; // Your characters or locations with card under

/**
 * Query-based trigger subject for complex filtering
 *
 * Uses the same DSL patterns as targeting
 */
export interface TriggerSubjectQuery {
  /** Whose card triggers this */
  controller?: TargetController;

  /** What type of card */
  cardType?: TriggerCardType;

  /** Additional filters (e.g., damaged, has keyword) - supports all card types */
  filters?: (CharacterFilter | ItemFilter | LocationFilter)[];

  /** Exclude self from matching */
  excludeSelf?: boolean;

  /** Classification filter (e.g., "Floodborn", "Princess") */
  classification?: string;

  /** Name filter */
  name?: string;

  /** Has specific keyword */
  hasKeyword?: string;
}

/**
 * Challenge-specific trigger context
 *
 * Used for triggers that fire during challenges to specify
 * whether we're interested in the attacker or defender role
 */
export interface ChallengeTriggerContext {
  /** Which role in the challenge triggers this */
  role: "attacker" | "defender" | "either";

  /** Additional filters for the character in that role */
  filters?: CharacterFilter[];
}

/**
 * Extended trigger for challenge events with combat context
 *
 * @example "Whenever this character challenges a damaged character"
 * ```typescript
 * {
 *   event: "challenge",
 *   timing: "whenever",
 *   on: "SELF",
 *   defender: { filters: [{ type: "damaged" }] }
 * }
 * ```
 */
export interface ChallengeTrigger extends BaseTrigger {
  event: "challenge" | "challenged" | "banish-in-challenge";

  /** Filter/context for the defender in the challenge */
  defender?: {
    filters?: CharacterFilter[];
    controller?: TargetController;
  };

  /** Filter/context for the attacker in the challenge */
  attacker?: {
    filters?: CharacterFilter[];
    controller?: TargetController;
  };
}

/**
 * Type guard to check if a trigger is a challenge trigger
 */
export function isChallengeTrigger(trigger: Trigger): trigger is ChallengeTrigger {
  return (
    trigger.event === "challenge" ||
    trigger.event === "challenged" ||
    trigger.event === "banish-in-challenge"
  );
}

/**
 * Helper type for effects that need to reference the trigger source
 *
 * @example "Whenever a character is banished, draw a card for each damage on IT"
 * Here "IT" refers to the trigger source (the banished character)
 */
export type TriggerSourceReference = CardReference & { ref: "trigger-source" };

/**
 * What entity triggers the event
 */
export type TriggerSubject = TriggerSubjectEnum | TriggerSubjectQuery;

// ============================================================================
// Trigger Definition
// ============================================================================

/**
 * Complete trigger definition
 *
 * @example "When you play this character"
 * ```typescript
 * { event: "play", timing: "when", on: "SELF" }
 * ```
 *
 * @example "Whenever one of your characters quests"
 * ```typescript
 * { event: "quest", timing: "whenever", on: "YOUR_CHARACTERS" }
 * ```
 *
 * @example "Whenever you play a Floodborn character"
 * ```typescript
 * {
 *   event: "play",
 *   timing: "whenever",
 *   on: { controller: "you", cardType: "character", classification: "Floodborn" }
 * }
 * ```
 *
 * @example "Whenever an opposing damaged character is banished"
 * ```typescript
 * {
 *   event: "banish",
 *   timing: "whenever",
 *   on: { controller: "opponent", cardType: "character", filters: [{ type: "damaged" }] }
 * }
 * ```
 *
 * @example "At the start of your turn"
 * ```typescript
 * { event: "start-turn", timing: "at", on: "YOU" }
 * ```
 *
 * @example "The first time each turn this character quests"
 * ```typescript
 * {
 *   event: "quest",
 *   timing: "whenever",
 *   on: "SELF",
 *   restrictions: [{ type: "first-time-each-turn" }]
 * }
 * ```
 */

export interface BaseTrigger {
  /** The event that causes this trigger to fire */
  event?: TriggerEvent;

  /**
   * Multiple events that can cause this trigger to fire
   * Used for "When you play this character and when he leaves play"
   */
  events?: TriggerEvent[] | Array<{ event: string; on: string }>;

  /** Timing word (when/whenever/at) - optional for parser compatibility */
  timing?: TriggerTiming | "when-or-whenever";

  /**
   * What entity triggers this event
   * - For card events: which card (SELF, query, etc.)
   * - For player events: which player (YOU, OPPONENT, etc.)
   * - For turn events: whose turn (YOU, OPPONENT)
   */
  on?: TriggerSubject;

  /**
   * Additional restrictions on when this trigger fires
   * Uses the shared Restriction type from ability-types
   */
  restrictions?: TriggerRestriction[];

  /**
   * Challenge context - alternative to defender/attacker for challenge events
   * Used by parser for simpler challenge-related triggers
   */
  challengeContext?: ChallengeTriggerContext;

  /**
   * Condition that must be true for the trigger to fire
   * Used by parser for conditional triggers
   */
  condition?: Condition;
}

export type Trigger = BaseTrigger | ChallengeTrigger;

/**
 * Restrictions specific to triggers
 * Note: This is a subset of the full Restriction type, kept separate
 * to avoid circular imports. The types are compatible.
 */
export type TriggerRestriction =
  // Usage tracking
  | { type: "once-per-turn" }
  | { type: "first-time-each-turn" }

  // Turn phase
  | { type: "during-turn"; whose: "your" | "opponent" }

  // Context
  | { type: "in-challenge" };

// ============================================================================
// Pre-built Trigger Patterns
// ============================================================================

/**
 * Common trigger patterns for convenience
 */
export const COMMON_TRIGGERS = {
  /** "When you play this character" */
  WHEN_PLAY_SELF: {
    event: "play",
    on: "SELF",
    timing: "when",
  } as const satisfies Trigger,

  /** "Whenever this character quests" */
  WHENEVER_QUEST_SELF: {
    event: "quest",
    on: "SELF",
    timing: "whenever",
  } as const satisfies Trigger,

  /** "Whenever this character challenges" */
  WHENEVER_CHALLENGE_SELF: {
    event: "challenge",
    on: "SELF",
    timing: "whenever",
  } as const satisfies Trigger,

  /** "Whenever this character is challenged" */
  WHENEVER_CHALLENGED_SELF: {
    event: "challenged",
    on: "SELF",
    timing: "whenever",
  } as const satisfies Trigger,

  /** "When this character is banished" */
  WHEN_BANISH_SELF: {
    event: "banish",
    on: "SELF",
    timing: "when",
  } as const satisfies Trigger,

  /** "When this character is banished in a challenge" */
  WHEN_BANISH_IN_CHALLENGE: {
    event: "banish-in-challenge",
    on: "SELF",
    timing: "when",
  } as const satisfies Trigger,

  /** "At the start of your turn" */
  AT_START_OF_TURN: {
    event: "start-turn",
    on: "YOU",
    timing: "at",
  } as const satisfies Trigger,

  /** "At the end of your turn" */
  AT_END_OF_TURN: {
    event: "end-turn",
    on: "YOU",
    timing: "at",
  } as const satisfies Trigger,

  /** "Whenever you play a character" */
  WHENEVER_PLAY_CHARACTER: {
    event: "play",
    on: { controller: "you", cardType: "character" },
    timing: "whenever",
  } as const satisfies Trigger,

  /** "Whenever you play a song" */
  WHENEVER_PLAY_SONG: {
    event: "play",
    on: { controller: "you", cardType: "song" },
    timing: "whenever",
  } as const satisfies Trigger,

  /** "Whenever you play a Floodborn character" */
  WHENEVER_PLAY_FLOODBORN: {
    event: "play",
    on: {
      controller: "you",
      cardType: "character",
      classification: "Floodborn",
    },
    timing: "whenever",
  } as const satisfies Trigger,

  /** "When this character leaves play" */
  WHEN_LEAVE_PLAY: {
    event: "leave-play",
    on: "SELF",
    timing: "when",
  } as const satisfies Trigger,

  /** "Whenever one of your other characters is banished" */
  WHENEVER_YOUR_OTHER_CHARACTER_BANISHED: {
    event: "banish",
    on: "YOUR_OTHER_CHARACTERS",
    timing: "whenever",
  } as const satisfies Trigger,

  /** "Whenever an opposing character is banished" */
  WHENEVER_OPPONENT_CHARACTER_BANISHED: {
    event: "banish",
    on: "OPPONENT_CHARACTERS",
    timing: "whenever",
  } as const satisfies Trigger,

  /** "Whenever you draw a card" */
  WHENEVER_YOU_DRAW: {
    event: "draw",
    on: "YOU",
    timing: "whenever",
  } as const satisfies Trigger,

  /** "Whenever you gain lore" */
  WHENEVER_YOU_GAIN_LORE: {
    event: "gain-lore",
    on: "YOU",
    timing: "whenever",
  } as const satisfies Trigger,
} as const;

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
 * Check if a trigger is a self-referential trigger
 */
export function isSelfTrigger(trigger: Trigger): boolean {
  return trigger.on === "SELF";
}

/**
 * Check if a trigger is phase-based (at start/end of turn)
 */
export function isPhaseTrigger(trigger: Trigger): boolean {
  return trigger.event === "start-turn" || trigger.event === "end-turn";
}

/**
 * Check if trigger has a specific restriction
 */
export function hasRestriction(trigger: Trigger, type: TriggerRestriction["type"]): boolean {
  return trigger.restrictions?.some((r) => r.type === type) ?? false;
}
