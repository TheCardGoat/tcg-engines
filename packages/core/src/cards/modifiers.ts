import type { CardId } from "../types";

/**
 * Modifier type definitions
 * - stat: Modifies numerical stats (power, toughness, cost, etc.)
 * - ability: Grants or removes abilities
 * - type: Changes card types or subtypes
 * - keyword: Grants keywords (flying, haste, trample, etc.)
 */
export type ModifierType = "stat" | "ability" | "type" | "keyword";

/**
 * Modifier duration options
 * - permanent: Lasts indefinitely
 * - until-end-of-turn: Expires at end of turn
 * - while-condition: Active only while condition is true
 */
export type ModifierDuration = "permanent" | "until-end-of-turn" | "while-condition";

/**
 * Modifier represents a temporary or permanent change to a card's properties
 * @template TGameState - Game state type for condition evaluation (defaults to unknown)
 */
export interface Modifier<TGameState = unknown> {
  /** Unique identifier for this modifier */
  id: string;

  /** Type of modification */
  type: ModifierType;

  /** Which property to modify (e.g., 'power', 'toughness', 'flying') */
  property: string;

  /** The modification value (can be number, string, or boolean) */
  value: number | string | boolean;

  /** How long this modifier lasts */
  duration: ModifierDuration;

  /** Optional condition function - modifier only applies when this returns true */
  condition?: (state: TGameState) => boolean;

  /** Card that created this modifier */
  source: CardId;

  /** Optional layer for complex modifier interactions (e.g., MTG layer system) */
  layer?: number;
}
