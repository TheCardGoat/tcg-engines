/**
 * Shared types for Gundam engine to break circular dependencies
 *
 * This file contains core types that are used across multiple Gundam engine modules
 * to prevent circular import dependencies.
 */

/**
 * Card colors as defined in the Gundam rules
 */
export type CardColor = "blue" | "white" | "green" | "red" | "token";

/**
 * Card rarities
 */
export type CardRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "super_rare"
  | "legendary";

/**
 * Card zones on the board
 */
export type CardZones = "space" | "earth";

/**
 * Board zones where cards can be placed
 */
export type BoardZones =
  | "hand"
  | "deck"
  | "trash"
  | "base"
  | "battle"
  | "shield"
  | "resourceDeck"
  | "resource";

/**
 * Card traits
 */
export type Traits =
  | "earth Federation"
  | "stronghold"
  | "white base team"
  | "earth alliance"
  | "operation meteor"
  | "earth federation"
  | "newtype"
  | "academy"
  | "civilian"
  | "zeon"
  | "neo zeon"
  | "maganac corps"
  | "warship";

/**
 * Static abilities
 */
export type Abilities = "repair" | "blocker" | "breach";

/**
 * Card types
 */
export type GundamitoCardType =
  | "pilot"
  | "unit"
  | "command"
  | "base"
  | "resource";

/**
 * Card sets
 */
export type GundamitoCardSet =
  | "ST01"
  | "ST02"
  | "ST03"
  | "ST04"
  | "ST05"
  | "ST06"
  | "GD01"
  | "GD02"
  | "EXBP";
