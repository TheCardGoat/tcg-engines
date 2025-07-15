/**
 * Shared types for Alpha Clash engine to break circular dependencies
 *
 * This file contains core types that are used across multiple Alpha Clash engine modules
 * to prevent circular import dependencies.
 */

/**
 * Alpha Clash game zones
 */
export type AlphaClashZoneType =
  | "deck"
  | "hand"
  | "contender"
  | "clash"
  | "clashground"
  | "accessory"
  | "resource"
  | "oblivion"
  | "standby";

/**
 * Alpha Clash card types
 */
export type AlphaClashCardType =
  | "contender"
  | "clash"
  | "accessory"
  | "action"
  | "clashground";

/**
 * Alpha Clash card subtypes
 */
export type AlphaClashSubtype =
  | "trap"
  | "weapon"
  | "basic"
  | "quick"
  | "clash-buff";

/**
 * Alpha Clash colors
 */
export type AlphaClashColor =
  | "white"
  | "blue"
  | "black"
  | "red"
  | "green"
  | "colorless";

/**
 * Alpha Clash affiliations
 */
export type AlphaClashAffiliation =
  | "alpha"
  | "alpha-hunter"
  | "rogue"
  | "discarded"
  | "harbinger"
  | "progenitor";

/**
 * Alpha Clash card rarities
 */
export type AlphaClashRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "mythic"
  | "legendary";

/**
 * Alpha Clash card status
 */
export type AlphaClashCardStatus =
  | "ready"
  | "engaged"
  | "face-up"
  | "face-down";

/**
 * Alpha Clash game phases
 */
export type AlphaClashGamePhase =
  | "startOfTurn"
  | "expansion"
  | "primary"
  | "clash"
  | "endOfTurn";

/**
 * Alpha Clash expansion phase steps
 */
export type AlphaClashExpansionStep = "ready" | "draw" | "resource";

/**
 * Alpha Clash clash phase steps
 */
export type AlphaClashClashStep =
  | "attack"
  | "counter"
  | "obstruct"
  | "attackerClashBuff"
  | "defenderClashBuff"
  | "damage";

/**
 * Alpha Clash priority window types
 */
export type AlphaClashPriorityWindow =
  | "counter-play"
  | "counter-attack"
  | "counter-trap";

/**
 * Alpha Clash damage types
 */
export type AlphaClashDamageType = "clash" | "non-clash";

/**
 * Alpha Clash keyword abilities
 */
export type AlphaClashKeyword =
  | "awe-factor"
  | "barrage"
  | "breakthrough"
  | "close-combat"
  | "enrage"
  | "flight"
  | "interception"
  | "necrotic"
  | "superspeed"
  | "undisputed"
  | "unrivaled";
