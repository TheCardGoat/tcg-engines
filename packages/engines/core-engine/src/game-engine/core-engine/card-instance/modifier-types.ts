/**
 * Modifier System Types
 *
 * Defines the modifier system for dynamically changing card properties.
 * Modifiers can temporarily or permanently affect card stats, abilities,
 * types, and keywords.
 */

import type { CardId } from "../types/branded-types";

/**
 * Type of modification being applied
 */
export type ModifierType = "stat" | "ability" | "type" | "keyword";

/**
 * Duration of the modifier effect
 */
export type ModifierDuration =
  | "permanent"
  | "until-end-of-turn"
  | "while-condition";

/**
 * Modifier that can be applied to a card instance.
 *
 * Modifiers dynamically change card properties without mutating the base definition.
 * They support conditional application based on game state.
 *
 * @template TGameState - The game state type for condition evaluation
 *
 * @example
 * // Permanent stat buff
 * const powerBuff: Modifier = {
 *   id: "giants-growth",
 *   type: "stat",
 *   property: "power",
 *   value: 3,
 *   duration: "until-end-of-turn",
 *   source: createCardId("spell-card"),
 * };
 *
 * @example
 * // Conditional stat buff
 * const conditionalBuff: Modifier<GameState> = {
 *   id: "landfall-trigger",
 *   type: "stat",
 *   property: "power",
 *   value: 2,
 *   duration: "while-condition",
 *   condition: (state) => state.landsControlled >= 5,
 *   source: createCardId("creature-card"),
 * };
 */
export type Modifier<TGameState = unknown> = {
  /** Unique identifier for this modifier */
  id: string;

  /** Type of modification (stat, ability, type, keyword) */
  type: ModifierType;

  /** Which property to modify (e.g., 'power', 'toughness', 'flying') */
  property: string;

  /** Value to apply (number for stats, string for types, boolean for abilities) */
  value: number | string | boolean;

  /** How long the modifier lasts */
  duration: ModifierDuration;

  /**
   * Optional condition that must be true for the modifier to apply.
   * Only evaluated when duration is "while-condition".
   */
  condition?: (state: TGameState) => boolean;

  /** Card that created this modifier */
  source: CardId;

  /**
   * Optional layer for complex interactions.
   * Lower layer numbers are applied first.
   * Useful for implementing MTG-style layer system.
   */
  layer?: number;
};
