/**
 * Trigger Helpers for Lorcana Abilities
 *
 * Provides a fluent API for building trigger definitions.
 * These helpers make it easy to construct common trigger patterns.
 *
 * @example
 * ```typescript
 * const trigger = Triggers.WhenYouPlay();
 * const trigger = Triggers.WheneverThisQuests();
 * const trigger = Triggers.AtStartOfYourTurn();
 * ```
 */

import type { Trigger, TriggerSubject, TriggerTiming } from "../trigger-types";

export const Triggers = {
  /**
   * "When you play this character"
   */
  WhenYouPlay: (on: TriggerSubject = "SELF"): Trigger => ({
    event: "play",
    timing: "when",
    on,
  }),

  /**
   * "Whenever this character quests"
   */
  WheneverThisQuests: (): Trigger => ({
    event: "quest",
    timing: "whenever",
    on: "SELF",
  }),

  /**
   * "When this character is banished"
   */
  WhenBanished: (on: TriggerSubject = "SELF"): Trigger => ({
    event: "banish",
    timing: "when",
    on,
  }),

  /**
   * "When this character is banished in a challenge"
   */
  BanishInChallenge: (params: {
    timing: TriggerTiming;
    on: TriggerSubject;
  }): Trigger => ({
    event: "banish-in-challenge",
    ...params,
  }),

  /**
   * "At the start of your turn"
   */
  AtStartOfYourTurn: (): Trigger => ({
    event: "start-turn",
    timing: "at",
    on: "YOU",
  }),

  /**
   * "At the end of your turn"
   */
  AtEndOfYourTurn: (): Trigger => ({
    event: "end-turn",
    timing: "at",
    on: "YOU",
  }),

  /**
   * "Whenever you play a character"
   */
  WheneverYouPlayCharacter: (): Trigger => ({
    event: "play",
    timing: "whenever",
    on: { controller: "you", cardType: "character" },
  }),

  /**
   * "Whenever you play a song"
   */
  WheneverYouPlaySong: (): Trigger => ({
    event: "play",
    timing: "whenever",
    on: { controller: "you", cardType: "song" },
  }),

  /**
   * "Whenever you play a Floodborn character"
   */
  WheneverYouPlayFloodborn: (): Trigger => ({
    event: "play",
    timing: "whenever",
    on: {
      controller: "you",
      cardType: "character",
      classification: "Floodborn",
    },
  }),

  /**
   * "When this character leaves play"
   */
  WhenLeavePlay: (): Trigger => ({
    event: "leave-play",
    timing: "when",
    on: "SELF",
  }),

  /**
   * "Whenever one of your other characters is banished"
   */
  WheneverYourOtherCharacterBanished: (): Trigger => ({
    event: "banish",
    timing: "whenever",
    on: "YOUR_OTHER_CHARACTERS",
  }),

  /**
   * "Whenever an opposing character is banished"
   */
  WheneverOpponentCharacterBanished: (): Trigger => ({
    event: "banish",
    timing: "whenever",
    on: "OPPONENT_CHARACTERS",
  }),

  /**
   * "Whenever you draw a card"
   */
  WheneverYouDraw: (): Trigger => ({
    event: "draw",
    timing: "whenever",
    on: "YOU",
  }),

  /**
   * "Whenever you gain lore"
   */
  WheneverYouGainLore: (): Trigger => ({
    event: "gain-lore",
    timing: "whenever",
    on: "YOU",
  }),

  /**
   * "Whenever this character challenges"
   */
  WheneverThisChallenges: (): Trigger => ({
    event: "challenge",
    timing: "whenever",
    on: "SELF",
  }),

  /**
   * "Whenever this character is challenged"
   */
  WheneverThisChallenged: (): Trigger => ({
    event: "challenged",
    timing: "whenever",
    on: "SELF",
  }),
};
