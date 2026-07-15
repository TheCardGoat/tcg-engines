/**
 * Lorcana Ability System
 *
 * Provides a comprehensive, serializable type system for representing
 * all Lorcana card abilities.
 *
 * ## Overview
 *
 * Lorcana abilities are composed of:
 * - **Effects**: Atomic game actions (draw, damage, gain lore, etc.)
 * - **Triggers**: Events that cause abilities to fire
 * - **Conditions**: Requirements that must be met
 * - **Costs**: What must be paid to activate abilities
 * - **Targets**: Who/what is affected
 *
 * ## Ability Types
 *
 * - **Keyword**: Simple abilities like Rush, Ward, Challenger +X
 * - **Triggered**: Fire when events occur (When/Whenever/At)
 * - **Activated**: Player chooses to use by paying cost
 * - **Static**: Always active, modify game state
 *
 * ## Usage
 *
 * ```typescript
 * import {
 *   Ability,
 *   keyword,
 *   triggered,
 *   COMMON_TRIGGERS,
 * } from "@lorcana/cards/abilities";
 *
 * // Simple keyword
 * const rush: Ability = keyword("Rush");
 *
 * // Challenger +3
 * const challengerAbility: Ability = challenger(3);
 *
 * // "When you play this character, draw 2 cards"
 * const drawOnPlay: Ability = triggered(
 *   COMMON_TRIGGERS.WHEN_PLAY_SELF,
 *   { type: "draw", amount: 2, target: "CONTROLLER" }
 * );
 * ```
 *
 * ## Design Principles
 *
 * 1. **Serializable**: All types can be serialized to JSON
 * 2. **Composable**: Effects combine into complex abilities
 * 3. **Type-safe**: Discriminated unions with type guards
 * 4. **Executable**: Structure is directly usable by game engine
 *
 * @module abilities
 */

// Re-export all types from lorcana-types
export * from "@tcg/lorcana-types/abilities";

// ============================================================================
// Version Info
// ============================================================================

/**
 * Version of the ability type system
 * Increment when making breaking changes
 */
export const ABILITY_TYPES_VERSION = "1.0.0";

// ============================================================================
// Quick Reference: Common Ability Patterns
// ============================================================================

/**
 * Example abilities for reference and testing
 */
export const EXAMPLE_ABILITIES = {
  /**
   * Simple Rush keyword
   */
  rush: {
    keyword: "Rush",
    type: "keyword",
  },

  /**
   * Challenger +3
   */
  challengerPlus3: {
    keyword: "Challenger",
    type: "keyword",
    value: 3,
  },

  /**
   * Resist +2
   */
  resistPlus2: {
    keyword: "Resist",
    type: "keyword",
    value: 2,
  },

  /**
   * Shift 5 (can Shift onto any matching character)
   */
  shift5: {
    keyword: "Shift",
    shiftCost: 5,
    type: "keyword",
  },

  /**
   * "When you play this character, draw 2 cards"
   */
  drawOnPlay: {
    effect: { amount: 2, target: "CONTROLLER", type: "draw" },
    trigger: { event: "play", on: "SELF", timing: "when" },
    type: "triggered",
  },

  /**
   * "Whenever this character quests, gain 1 lore"
   */
  gainLoreOnQuest: {
    effect: { amount: 1, type: "gain-lore" },
    trigger: { event: "quest", on: "SELF", timing: "whenever" },
    type: "triggered",
  },

  /**
   * "{E} - Draw a card"
   */
  exertToDraw: {
    cost: { exert: true },
    effect: { amount: 1, target: "CONTROLLER", type: "draw" },
    type: "activated",
  },

  /**
   * "{E}, 2 {I} - Deal 3 damage to chosen character"
   */
  exertInkToDamage: {
    cost: { exert: true, ink: 2 },
    effect: { amount: 3, target: "CHOSEN_CHARACTER", type: "deal-damage" },
    type: "activated",
  },

  /**
   * "Your characters gain Ward"
   */
  yourCharactersGainWard: {
    effect: {
      duration: "while-condition",
      keyword: "Ward",
      target: "YOUR_CHARACTERS",
      type: "gain-keyword",
    },
    type: "static",
  },

  /**
   * "While this character has no damage, he gets +2 Strength"
   */
  bonusWhileNoDamage: {
    condition: { type: "no-damage" },
    effect: {
      duration: "while-condition",
      modifier: 2,
      stat: "strength",
      target: "SELF",
      type: "modify-stat",
    },
    type: "static",
  },
} as const;
