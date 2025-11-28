/**
 * Combat Types
 *
 * Types for quest and challenge mechanics in Lorcana.
 */

import type { CardId } from "../types/game-state";

/**
 * Quest move (Rule 4.3.5)
 */
export interface QuestMove {
  type: "quest";
  characterId: CardId;
}

/**
 * Challenge move (Rule 4.3.6)
 */
export interface ChallengeMove {
  type: "challenge";
  challengerId: CardId;
  targetId: CardId; // Character or Location
}

/**
 * Move to location (Rule 4.3.7)
 */
export interface MoveToLocationMove {
  type: "moveToLocation";
  characterId: CardId;
  locationId: CardId;
}

/**
 * Quest validation errors
 */
export type QuestValidationError =
  | { type: "NOT_A_CHARACTER" }
  | { type: "NOT_READY" }
  | { type: "NOT_DRY" }
  | { type: "HAS_RECKLESS" }
  | { type: "NOT_IN_PLAY" }
  | { type: "NOT_YOUR_CHARACTER" }
  | { type: "NOT_YOUR_TURN" }
  | { type: "NOT_MAIN_PHASE" };

/**
 * Challenge validation errors
 */
export type ChallengeValidationError =
  | { type: "NOT_A_CHARACTER" }
  | { type: "NOT_READY" }
  | { type: "NOT_DRY" }
  | { type: "TARGET_NOT_EXERTED" }
  | { type: "TARGET_HAS_EVASIVE"; targetId: CardId }
  | { type: "BODYGUARD_BLOCKING"; bodyguardId: CardId }
  | { type: "CANNOT_CHALLENGE_OWN" }
  | { type: "INVALID_TARGET" }
  | { type: "NOT_YOUR_TURN" }
  | { type: "NOT_MAIN_PHASE" }
  | { type: "TARGET_NOT_IN_PLAY" };

/**
 * Move to location validation errors
 */
export type MoveToLocationError =
  | { type: "NOT_A_CHARACTER" }
  | { type: "NOT_A_LOCATION" }
  | { type: "NOT_YOUR_CHARACTER" }
  | { type: "NOT_YOUR_LOCATION" }
  | { type: "INSUFFICIENT_INK"; required: number; available: number }
  | { type: "ALREADY_AT_LOCATION" }
  | { type: "NOT_YOUR_TURN" }
  | { type: "NOT_MAIN_PHASE" };

/**
 * Challenge state during resolution
 */
export interface ChallengeState {
  challengerId: CardId;
  targetId: CardId;
  phase: "declared" | "damage" | "resolved";
  challengerDamageDealt: number;
  targetDamageDealt: number;
}

/**
 * Damage calculation result
 */
export interface DamageCalculation {
  baseStrength: number;
  modifiers: DamageModifier[];
  totalDamage: number;
}

export interface DamageModifier {
  source: CardId | "keyword";
  type: "challenger" | "support" | "static" | "temporary";
  amount: number;
}
