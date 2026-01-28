/**
 * Test helper builders for Riftbound triggers
 *
 * Provides fluent builders for creating trigger objects in tests.
 * These match the types in @tcg/riftbound-types.
 */

import type {
  Condition,
  Trigger,
  TriggerEvent,
  TriggerRestriction,
  TriggerSubject,
} from "@tcg/riftbound-types";

/**
 * Trigger builder helpers for tests
 */
export const Triggers = {
  // Play triggers
  whenPlaySelf: (): Trigger => ({
    event: "play-self",
    timing: "when",
  }),

  whenPlayCard: (on?: TriggerSubject): Trigger => ({
    event: "play-card",
    on,
    timing: "when",
  }),

  whenPlayUnit: (on?: TriggerSubject): Trigger => ({
    event: "play-unit",
    on,
    timing: "when",
  }),

  whenPlaySpell: (on?: TriggerSubject): Trigger => ({
    event: "play-spell",
    on,
    timing: "when",
  }),

  whenPlayFromHidden: (): Trigger => ({
    event: "play-from-hidden",
    on: "self",
    timing: "when",
  }),

  // Combat triggers
  whenAttack: (on: TriggerSubject = "self"): Trigger => ({
    event: "attack",
    on,
    timing: "when",
  }),

  whenDefend: (on: TriggerSubject = "self"): Trigger => ({
    event: "defend",
    on,
    timing: "when",
  }),

  whenConquer: (on: TriggerSubject = "self"): Trigger => ({
    event: "conquer",
    on,
    timing: "when",
  }),

  whenHold: (on: TriggerSubject = "self"): Trigger => ({
    event: "hold",
    on,
    timing: "when",
  }),

  whenWinCombat: (on: TriggerSubject = "self"): Trigger => ({
    event: "win-combat",
    on,
    timing: "when",
  }),

  // Movement triggers
  whenMove: (on: TriggerSubject = "self"): Trigger => ({
    event: "move",
    on,
    timing: "when",
  }),

  whenMoveToBattlefield: (on: TriggerSubject = "self"): Trigger => ({
    event: "move-to-battlefield",
    on,
    timing: "when",
  }),

  whenMoveFromBattlefield: (on: TriggerSubject = "self"): Trigger => ({
    event: "move-from-battlefield",
    on,
    timing: "when",
  }),

  // State change triggers
  whenDie: (on: TriggerSubject = "self"): Trigger => ({
    event: "die",
    on,
    timing: "when",
  }),

  whenTakeDamage: (on: TriggerSubject = "self"): Trigger => ({
    event: "take-damage",
    on,
    timing: "when",
  }),

  whenBecomeMighty: (on: TriggerSubject = "self"): Trigger => ({
    event: "become-mighty",
    on,
    timing: "when",
  }),

  whenBuff: (on?: TriggerSubject): Trigger => ({
    event: "buff",
    on,
    timing: "when",
  }),

  whenSpendBuff: (on?: TriggerSubject): Trigger => ({
    event: "spend-buff",
    on,
    timing: "when",
  }),

  whenReady: (on?: TriggerSubject): Trigger => ({
    event: "ready",
    on,
    timing: "when",
  }),

  whenStun: (on?: TriggerSubject): Trigger => ({
    event: "stun",
    on,
    timing: "when",
  }),

  // Resource triggers
  whenDraw: (on: TriggerSubject = "controller"): Trigger => ({
    event: "draw",
    on,
    timing: "when",
  }),

  whenDiscard: (on: TriggerSubject = "controller"): Trigger => ({
    event: "discard",
    on,
    timing: "when",
  }),

  whenChannel: (on: TriggerSubject = "controller"): Trigger => ({
    event: "channel",
    on,
    timing: "when",
  }),

  whenRecycle: (on: TriggerSubject = "controller"): Trigger => ({
    event: "recycle",
    on,
    timing: "when",
  }),

  // Phase triggers
  atBeginningPhase: (on: TriggerSubject = "controller"): Trigger => ({
    event: "beginning-phase",
    on,
    timing: "at",
  }),

  atEndOfTurn: (on: TriggerSubject = "controller"): Trigger => ({
    event: "end-of-turn",
    on,
    timing: "at",
  }),

  atStartOfTurn: (on: TriggerSubject = "controller"): Trigger => ({
    event: "start-of-turn",
    on,
    timing: "at",
  }),

  // Targeting triggers
  whenChosen: (on: TriggerSubject = "self"): Trigger => ({
    event: "choose",
    on,
    timing: "when",
  }),

  whenAttachEquipment: (on?: TriggerSubject): Trigger => ({
    event: "attach-equipment",
    on,
    timing: "when",
  }),

  // Scoring triggers
  whenScore: (on: TriggerSubject = "controller"): Trigger => ({
    event: "score",
    on,
    timing: "when",
  }),

  // Custom trigger builder
  custom: (
    event: TriggerEvent,
    opts?: {
      on?: TriggerSubject;
      timing?: "when" | "whenever" | "at";
      restrictions?: TriggerRestriction[];
      condition?: Condition;
    },
  ): Trigger => ({
    event,
    ...opts,
  }),

  // Add restrictions to a trigger
  withRestriction: (
    trigger: Trigger,
    restriction: TriggerRestriction,
  ): Trigger => ({
    ...trigger,
    restrictions: [...(trigger.restrictions || []), restriction],
  }),

  oncePerTurn: (trigger: Trigger): Trigger =>
    Triggers.withRestriction(trigger, { type: "once-per-turn" }),

  firstTimeEachTurn: (trigger: Trigger): Trigger =>
    Triggers.withRestriction(trigger, { type: "first-time-each-turn" }),
};
