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
    type: "keyword",
    keyword: "Rush",
  },

  /**
   * Challenger +3
   */
  challengerPlus3: {
    type: "keyword",
    keyword: "Challenger",
    value: 3,
  },

  /**
   * Resist +2
   */
  resistPlus2: {
    type: "keyword",
    keyword: "Resist",
    value: 2,
  },

  /**
   * Shift 5 (can Shift onto any matching character)
   */
  shift5: {
    type: "keyword",
    keyword: "Shift",
    shiftCost: 5,
  },

  /**
   * "When you play this character, draw 2 cards"
   */
  drawOnPlay: {
    type: "triggered",
    trigger: { event: "play", timing: "when", on: "SELF" },
    effect: { type: "draw", amount: 2, target: "CONTROLLER" },
  },

  /**
   * "Whenever this character quests, gain 1 lore"
   */
  gainLoreOnQuest: {
    type: "triggered",
    trigger: { event: "quest", timing: "whenever", on: "SELF" },
    effect: { type: "gain-lore", amount: 1 },
  },

  /**
   * "{E} - Draw a card"
   */
  exertToDraw: {
    type: "activated",
    cost: { exert: true },
    effect: { type: "draw", amount: 1, target: "CONTROLLER" },
  },

  /**
   * "{E}, 2 {I} - Deal 3 damage to chosen character"
   */
  exertInkToDamage: {
    type: "activated",
    cost: { exert: true, ink: 2 },
    effect: { type: "deal-damage", amount: 3, target: "CHOSEN_CHARACTER" },
  },

  /**
   * "Your characters gain Ward"
   */
  yourCharactersGainWard: {
    type: "static",
    effect: {
      type: "gain-keyword",
      keyword: "Ward",
      target: "YOUR_CHARACTERS",
      duration: "while-condition",
    },
  },

  /**
   * "While this character has no damage, he gets +2 Strength"
   */
  bonusWhileNoDamage: {
    type: "static",
    condition: { type: "no-damage" },
    effect: {
      type: "modify-stat",
      stat: "strength",
      modifier: 2,
      target: "SELF",
      duration: "while-condition",
    },
  },
} as const;
