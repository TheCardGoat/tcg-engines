/**
 * Condition Helpers for Lorcana Abilities
 *
 * Provides a fluent API for building condition definitions.
 * These helpers make it easy to construct common condition patterns.
 *
 * @example
 * ```typescript
 * const condition = Conditions.HasAnotherCharacter();
 * const condition = Conditions.HasCharacterNamed("Elsa");
 * const condition = Conditions.WhileDamaged();
 * ```
 */

import type { Condition } from "../condition-types";

export const Conditions = {
  /**
   * "If you have another character in play"
   */
  HasAnotherCharacter: (): Condition => ({
    type: "has-another-character",
  }),

  /**
   * "If you have a character named X"
   */
  HasCharacterNamed: (name: string): Condition => ({
    controller: "you",
    name,
    type: "has-named-character",
  }),

  /**
   * "If you have a character with classification X"
   */
  HasCharacterWithClassification: (classification: string): Condition => ({
    classification,
    controller: "you",
    type: "has-character-with-classification",
  }),

  /**
   * "If you have a character with keyword X"
   */
  HasCharacterWithKeyword: (keyword: string): Condition => ({
    controller: "you",
    keyword,
    type: "has-character-with-keyword",
  }),

  /**
   * "While this character has damage"
   */
  WhileDamaged: (): Condition => ({
    type: "has-any-damage",
  }),

  /**
   * "While this character has no damage"
   */
  WhileNoDamage: (): Condition => ({
    type: "has-no-damage",
  }),

  /**
   * "While this character is exerted"
   */
  WhileExerted: (): Condition => ({
    type: "is-exerted",
  }),

  /**
   * "While this character is ready"
   */
  WhileReady: (): Condition => ({
    type: "is-ready",
  }),

  /**
   * "While in a challenge"
   */
  InChallenge: (): Condition => ({
    type: "in-challenge",
  }),

  /**
   * "If you have X or more cards in hand"
   */
  HandSizeAtLeast: (amount: number): Condition => ({
    comparison: "greater-or-equal",
    controller: "you",
    type: "resource-count",
    value: amount,
    what: "cards-in-hand",
  }),

  /**
   * "If you have X or fewer cards in hand"
   */
  HandSizeAtMost: (amount: number): Condition => ({
    comparison: "less-or-equal",
    controller: "you",
    type: "resource-count",
    value: amount,
    what: "cards-in-hand",
  }),

  /**
   * "If you have no cards in hand"
   */
  HandIsEmpty: (): Condition => ({
    comparison: "equal",
    controller: "you",
    type: "resource-count",
    value: 0,
    what: "cards-in-hand",
  }),

  /**
   * "If you have X or more lore"
   */
  LoreAtLeast: (amount: number): Condition => ({
    comparison: "greater-or-equal",
    type: "lore-comparison",
    value: amount,
  }),

  /**
   * "If you have X or fewer lore"
   */
  LoreAtMost: (amount: number): Condition => ({
    comparison: "less-or-equal",
    type: "lore-comparison",
    value: amount,
  }),

  /**
   * "If you have a card under this character"
   */
  HasCardUnder: (): Condition => ({
    type: "has-card-under",
  }),

  /**
   * "If this is the first time this turn"
   */
  FirstTimeThisTurn: (): Condition => ({
    event: "action",
    type: "first-this-turn",
  }),

  /**
   * "If you used Shift this turn"
   */
  UsedShiftThisTurn: (): Condition => ({
    type: "used-shift",
  }),

  /**
   * "If you have a character in play"
   */
  HaveCharacterInPlay: (): Condition => ({
    controller: "you",
    type: "has-named-character",
  }),

  /**
   * "If you have an item in play"
   */
  HaveItemInPlay: (): Condition => ({
    controller: "you",
    name: "",
    type: "has-named-item",
  }),

  /**
   * "If you have a location in play"
   */
  HaveLocationInPlay: (): Condition => ({
    controller: "you",
    name: "",
    type: "has-named-location",
  }),

  /**
   * "If you have a card with classification X in play"
   */
  HaveClassificationInPlay: (classification: string): Condition => ({
    classification,
    controller: "you",
    type: "has-character-with-classification",
  }),

  /**
   * "If you have a card with keyword X in play"
   */
  HaveKeywordInPlay: (keyword: string): Condition => ({
    controller: "you",
    keyword,
    type: "has-character-with-keyword",
  }),

  /**
   * "If you have a card named X in play"
   */
  HaveNamedInPlay: (name: string): Condition => ({
    controller: "you",
    name,
    type: "has-named-character",
  }),

  /**
   * "If you have X or more characters in play"
   */
  CharacterCountAtLeast: (amount: number): Condition => ({
    comparison: "greater-or-equal",
    controller: "you",
    count: amount,
    type: "has-character-count",
  }),

  /**
   * "If you have X or fewer characters in play"
   */
  CharacterCountAtMost: (amount: number): Condition => ({
    comparison: "less-or-equal",
    controller: "you",
    count: amount,
    type: "has-character-count",
  }),

  /**
   * "If you have exactly X characters in play"
   */
  CharacterCountExactly: (amount: number): Condition => ({
    comparison: "equal",
    controller: "you",
    count: amount,
    type: "has-character-count",
  }),

  /**
   * Logical AND - all conditions must be true
   */
  And: (...conditions: Condition[]): Condition => ({
    conditions,
    type: "and",
  }),

  /**
   * Logical OR - any condition must be true
   */
  Or: (...conditions: Condition[]): Condition => ({
    conditions,
    type: "or",
  }),

  /**
   * Logical NOT - negate a condition
   */
  Not: (condition: Condition): Condition => ({
    condition,
    type: "not",
  }),
};
