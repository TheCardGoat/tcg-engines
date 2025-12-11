/**
 * Keyword Effect Types
 *
 * Extended types for keyword effects and contexts.
 */

import type { CardId, PlayerId } from "../types/game-state";

/**
 * Events that can trigger keyword effects
 */
export type KeywordEvent =
  | "onChallenge" // When this character challenges
  | "onBeingChallenged" // When this character is challenged
  | "onQuest" // When this character quests
  | "onEnterPlay" // When this character enters play
  | "onLeavePlay" // When this character leaves play
  | "onDamageDealt" // When this character deals damage
  | "onDamageReceived" // When this character receives damage
  | "onTargeted" // When this character is targeted by ability
  | "onExerted"; // When this character is exerted

/**
 * Context for keyword effect application
 */
export interface KeywordContext {
  event: KeywordEvent;
  sourceCardId: CardId;
  targetCardId?: CardId;
  playerId: PlayerId;
  opponentId: PlayerId;
}

/**
 * Result of stacking keyword calculation
 */
export interface StackingKeywordTotal {
  keyword: "Challenger" | "Resist";
  baseValue: number;
  modifiers: Array<{
    source: CardId | "ability" | "effect";
    amount: number;
  }>;
  totalValue: number;
}

/**
 * Support effect context
 */
export interface SupportContext {
  supporterId: CardId;
  targetId: CardId;
  bonusAmount: number;
  expiresAtEndOfTurn: boolean;
}

/**
 * Vanish destination override
 */
export interface VanishRedirect {
  originalDestination: "hand" | "deck";
  actualDestination: "discard";
  cardId: CardId;
}

/**
 * Ward protection check result
 */
export interface WardCheckResult {
  protected: boolean;
  reason?: "ward" | "none";
  byPlayerId?: PlayerId;
}

/**
 * Shift stack info
 */
export interface ShiftStackInfo {
  topCardId: CardId;
  underneathCardId: CardId;
  inheritedDamage: number;
  isReady: boolean;
}

/**
 * Singer payment info
 */
export interface SingerPayment {
  type: "single" | "sing_together";
  singerIds: CardId[];
  totalValue: number;
  songCost: number;
}
