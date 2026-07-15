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
    on,
    timing: "when",
  }),

  /**
   * "Whenever this character quests"
   */
  WheneverThisQuests: (): Trigger => ({
    event: "quest",
    on: "SELF",
    timing: "whenever",
  }),

  /**
   * "When this character is banished"
   */
  WhenBanished: (on: TriggerSubject = "SELF"): Trigger => ({
    event: "banish",
    on,
    timing: "when",
  }),

  /**
   * "When this character is banished in a challenge"
   */
  BanishInChallenge: (params: { timing: TriggerTiming; on: TriggerSubject }): Trigger => ({
    event: "banish-in-challenge",
    ...params,
  }),

  /**
   * "At the start of your turn"
   */
  AtStartOfYourTurn: (): Trigger => ({
    event: "start-turn",
    on: "YOU",
    timing: "at",
  }),

  /**
   * "At the end of your turn"
   */
  AtEndOfYourTurn: (): Trigger => ({
    event: "end-turn",
    on: "YOU",
    timing: "at",
  }),

  /**
   * "Whenever you play a character"
   */
  WheneverYouPlayCharacter: (): Trigger => ({
    event: "play",
    on: { cardType: "character", controller: "you" },
    timing: "whenever",
  }),

  /**
   * "Whenever you play a song"
   */
  WheneverYouPlaySong: (): Trigger => ({
    event: "play",
    on: { cardType: "song", controller: "you" },
    timing: "whenever",
  }),

  /**
   * "Whenever you play a Floodborn character"
   */
  WheneverYouPlayFloodborn: (): Trigger => ({
    event: "play",
    on: {
      cardType: "character",
      classification: "Floodborn",
      controller: "you",
    },
    timing: "whenever",
  }),

  /**
   * "When this character leaves play"
   */
  WhenLeavePlay: (): Trigger => ({
    event: "leave-play",
    on: "SELF",
    timing: "when",
  }),

  /**
   * "Whenever one of your other characters is banished"
   */
  WheneverYourOtherCharacterBanished: (): Trigger => ({
    event: "banish",
    on: "YOUR_OTHER_CHARACTERS",
    timing: "whenever",
  }),

  /**
   * "Whenever an opposing character is banished"
   */
  WheneverOpponentCharacterBanished: (): Trigger => ({
    event: "banish",
    on: "OPPONENT_CHARACTERS",
    timing: "whenever",
  }),

  /**
   * "Whenever you draw a card"
   */
  WheneverYouDraw: (): Trigger => ({
    event: "draw",
    on: "YOU",
    timing: "whenever",
  }),

  /**
   * "Whenever you gain lore"
   */
  WheneverYouGainLore: (): Trigger => ({
    event: "gain-lore",
    on: "YOU",
    timing: "whenever",
  }),

  /**
   * "Whenever this character challenges"
   */
  WheneverThisChallenges: (): Trigger => ({
    event: "challenge",
    on: "SELF",
    timing: "whenever",
  }),

  /**
   * "Whenever this character is challenged"
   */
  WheneverThisChallenged: (): Trigger => ({
    event: "challenged",
    on: "SELF",
    timing: "whenever",
  }),
};
