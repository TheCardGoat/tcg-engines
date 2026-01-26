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
    type: "has-named-character",
    name,
    controller: "you",
  }),

  /**
   * "If you have a character with classification X"
   */
  HasCharacterWithClassification: (classification: string): Condition => ({
    type: "has-character-with-classification",
    classification,
    controller: "you",
  }),

  /**
   * "If you have a character with keyword X"
   */
  HasCharacterWithKeyword: (keyword: string): Condition => ({
    type: "has-character-with-keyword",
    keyword,
    controller: "you",
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
    type: "resource-count",
    what: "cards-in-hand",
    controller: "you",
    comparison: "greater-or-equal",
    value: amount,
  }),

  /**
   * "If you have X or fewer cards in hand"
   */
  HandSizeAtMost: (amount: number): Condition => ({
    type: "resource-count",
    what: "cards-in-hand",
    controller: "you",
    comparison: "less-or-equal",
    value: amount,
  }),

  /**
   * "If you have no cards in hand"
   */
  HandIsEmpty: (): Condition => ({
    type: "resource-count",
    what: "cards-in-hand",
    controller: "you",
    comparison: "equal",
    value: 0,
  }),

  /**
   * "If you have X or more lore"
   */
  LoreAtLeast: (amount: number): Condition => ({
    type: "lore-comparison",
    comparison: "greater-or-equal",
    value: amount,
  }),

  /**
   * "If you have X or fewer lore"
   */
  LoreAtMost: (amount: number): Condition => ({
    type: "lore-comparison",
    comparison: "less-or-equal",
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
    type: "first-this-turn",
    event: "action",
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
    type: "has-named-character",
    controller: "you",
  }),

  /**
   * "If you have an item in play"
   */
  HaveItemInPlay: (): Condition => ({
    type: "has-named-item",
    name: "",
    controller: "you",
  }),

  /**
   * "If you have a location in play"
   */
  HaveLocationInPlay: (): Condition => ({
    type: "has-named-location",
    name: "",
    controller: "you",
  }),

  /**
   * "If you have a card with classification X in play"
   */
  HaveClassificationInPlay: (classification: string): Condition => ({
    type: "has-character-with-classification",
    classification,
    controller: "you",
  }),

  /**
   * "If you have a card with keyword X in play"
   */
  HaveKeywordInPlay: (keyword: string): Condition => ({
    type: "has-character-with-keyword",
    keyword,
    controller: "you",
  }),

  /**
   * "If you have a card named X in play"
   */
  HaveNamedInPlay: (name: string): Condition => ({
    type: "has-named-character",
    name,
    controller: "you",
  }),

  /**
   * "If you have X or more characters in play"
   */
  CharacterCountAtLeast: (amount: number): Condition => ({
    type: "has-character-count",
    controller: "you",
    comparison: "greater-or-equal",
    count: amount,
  }),

  /**
   * "If you have X or fewer characters in play"
   */
  CharacterCountAtMost: (amount: number): Condition => ({
    type: "has-character-count",
    controller: "you",
    comparison: "less-or-equal",
    count: amount,
  }),

  /**
   * "If you have exactly X characters in play"
   */
  CharacterCountExactly: (amount: number): Condition => ({
    type: "has-character-count",
    controller: "you",
    comparison: "equal",
    count: amount,
  }),

  /**
   * Logical AND - all conditions must be true
   */
  And: (...conditions: Condition[]): Condition => ({
    type: "and",
    conditions,
  }),

  /**
   * Logical OR - any condition must be true
   */
  Or: (...conditions: Condition[]): Condition => ({
    type: "or",
    conditions,
  }),

  /**
   * Logical NOT - negate a condition
   */
  Not: (condition: Condition): Condition => ({
    type: "not",
    condition,
  }),
};
