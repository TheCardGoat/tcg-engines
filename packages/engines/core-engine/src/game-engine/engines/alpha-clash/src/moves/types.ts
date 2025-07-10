/**
 * Move type definitions for Alpha Clash TCG
 *
 * Defines all possible player actions and their argument types
 */

import type { Move } from "~/game-engine/core-engine/move/move-types";
import type { AlphaClashGameState } from "../../alpha-clash-engine-types";

/**
 * Base move type for Alpha Clash
 */
export type AlphaClashMove = Move<AlphaClashGameState>;

/**
 * Choose first player arguments
 */
export type ChooseFirstPlayerArgs = {
  playerId: string;
};

/**
 * Mulligan arguments
 */
export type MulliganArgs = {
  keepHand?: boolean;
  cardsToMulligan?: string[];
};

/**
 * Play card arguments
 */
export type PlayCardArgs = {
  cardInstanceId: string;
  targetInstanceId?: string;
  position?: number;
  paymentCards?: string[]; // Resource cards to engage for payment
};

/**
 * Set trap arguments
 */
export type SetTrapArgs = {
  trapInstanceId: string;
  position?: number;
};

/**
 * Activate trap arguments
 */
export type ActivateTrapArgs = {
  trapInstanceId: string;
  targets?: string[];
};

/**
 * Attach weapon arguments
 */
export type AttachWeaponArgs = {
  weaponInstanceId: string;
  targetInstanceId: string;
  paymentCards?: string[];
};

/**
 * Declare attackers arguments
 */
export type DeclareAttackersArgs = {
  attackerInstanceIds: string[];
};

/**
 * Declare obstructors arguments
 */
export type DeclareObstructorsArgs = {
  obstructions: Array<{
    attackerInstanceId: string;
    obstructorInstanceId: string;
  }>;
};

/**
 * Play clash buff arguments
 */
export type PlayClashBuffArgs = {
  clashBuffInstanceId: string;
  targets?: string[];
  paymentCards?: string[];
};

/**
 * Activate ability arguments
 */
export type ActivateAbilityArgs = {
  cardInstanceId: string;
  abilityIndex: number;
  targets?: string[];
  paymentCards?: string[];
};

/**
 * Pass priority arguments
 */
export type PassPriorityArgs = {
  // No arguments needed - just pass priority
};

/**
 * End turn arguments
 */
export type EndTurnArgs = {
  // No arguments needed - end current turn
};

/**
 * End phase arguments
 */
export type EndPhaseArgs = {
  // No arguments needed - end current phase
};

/**
 * Place card in resource zone arguments
 */
export type PlaceResourceArgs = {
  cardInstanceId: string;
};

/**
 * Initiate clash arguments
 */
export type InitiateClashArgs = {
  // Clash is initiated automatically when attackers are declared
  // This move transitions to clash phase
};

/**
 * Counter-play response arguments
 */
export type CounterPlayArgs = {
  cardInstanceId?: string;
  targets?: string[];
  pass?: boolean;
};

/**
 * Counter-attack response arguments
 */
export type CounterAttackArgs = {
  cardInstanceId?: string;
  targets?: string[];
  pass?: boolean;
};

/**
 * Counter-trap response arguments
 */
export type CounterTrapArgs = {
  cardInstanceId?: string;
  targets?: string[];
  pass?: boolean;
};

/**
 * Sacrifice card arguments
 */
export type SacrificeCardArgs = {
  cardInstanceId: string;
};

/**
 * Discard card arguments
 */
export type DiscardCardArgs = {
  cardInstanceId: string;
  reason?: string;
};

/**
 * Draw card arguments
 */
export type DrawCardArgs = {
  count?: number;
};

/**
 * Search library arguments
 */
export type SearchLibraryArgs = {
  cardFilter?: any;
  maxCards?: number;
  zone?: string; // Where to put found cards
};

/**
 * Modal choice arguments (for cards with multiple options)
 */
export type ModalChoiceArgs = {
  cardInstanceId: string;
  choiceIndex: number;
  targets?: string[];
};

/**
 * Pay cost arguments
 */
export type PayCostArgs = {
  resourceCards?: string[]; // Cards to engage for resource cost
  sacrificeCards?: string[]; // Cards to sacrifice
  lifePayment?: number; // Life to pay
  additionalCosts?: Array<{
    type: string;
    value: any;
  }>;
};
