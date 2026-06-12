/**
 * Available Moves API
 *
 * Provides a structured, 2-layer API for the UI to discover what moves
 * the current player can make, without the UI needing to enumerate
 * card combinations or evaluate game rules.
 *
 * Layer 1: getAvailableMoves() — what moves are available and which cards can start them
 * Layer 2: getMoveOptions() — given a first selection, what are the next choices
 */

import type { CardInstanceId } from "#core";

// ============================================================================
// Layer 1: Available Moves
// ============================================================================

/**
 * UI-facing move category IDs.
 * Note: "singCard" and "shiftCard" map to engine's "playCard" with different cost types.
 */
export type AvailableMoveId =
  | "playCard"
  | "singCard"
  | "shiftCard"
  | "putCardIntoInkwell"
  | "quest"
  | "challenge"
  | "moveCharacterToLocation"
  | "activateAbility"
  | "passTurn"
  | "questWithAll"
  | "chooseWhoGoesFirst"
  | "concede";

export type AvailableMove = {
  moveId: AvailableMoveId;
  /**
   * Card IDs the player can select to start this move.
   * Empty array means the move requires no card selection (e.g., passTurn).
   */
  selectableCardIds: CardInstanceId[];
};

// ============================================================================
// Layer 2: Move Options (second-layer selection)
// ============================================================================

export type MoveOptionTarget = {
  kind: "card";
  cardId: CardInstanceId;
  selectableCosts?: MoveOptionSelectableCost[];
};

export type MoveOptionSingTogetherSinger = {
  cardId: CardInstanceId;
  value: number;
};

export type MoveOptionSingTogether = {
  kind: "singTogether";
  requiredTotal: number;
  singers: MoveOptionSingTogetherSinger[];
};

export type MoveOptionAbility = {
  kind: "ability";
  abilityIndex: number;
  abilityLabel: string;
  selectableCosts?: MoveOptionSelectableCost[];
};

export type MoveOptionSelectableCostKind =
  | "discardCards"
  | "exertCharacters"
  | "exertItems"
  | "banishCharacters"
  | "banishItems"
  | "putOnDeckBottom";

export type MoveOptionSelectableCost = {
  kind: MoveOptionSelectableCostKind;
  count: number;
  candidateCardIds: CardInstanceId[];
  zone: "hand" | "play" | "discard";
  cardType?: string;
  cardName?: string;
  classification?: string;
};

export type MoveOption = MoveOptionTarget | MoveOptionAbility | MoveOptionSingTogether;

// ============================================================================
// Layer 3: Valid Targets for Effect Resolution
// ============================================================================

export type EffectTargetInfo = {
  cardCandidates: CardInstanceId[];
  minSelections: number;
  maxSelections: number;
};
