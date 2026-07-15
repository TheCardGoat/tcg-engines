/**
 * Lorcana Runtime Moves
 *
 * All move definitions for the MatchRuntime architecture.
 */

import type { LorcanaMoveDefinition, LorcanaRuntimeMoveInputs } from "../types";
import { activateAbility } from "./moves/abilities";
import {
  challenge,
  moveCharacterToLocation,
  playCard,
  putCardIntoInkwell,
  quest,
  questWithAll,
} from "./moves/core";
import { alterHand, chooseWhoGoesFirst } from "./moves/setup";
import { concede, forfeitGame, passTurn } from "./moves/turn";
import { resolveBag, resolveEffect } from "./resolution";
import {
  manualDryCard,
  manualExertCard,
  manualMoveCard,
  manualPassTurn,
  manualReadyCard,
  manualSetDamage,
  manualSetLore,
  manualShuffleDeck,
} from "./debug";

/**
 * All Lorcana runtime moves
 */
type LorcanaRuntimeMoveRegistry = {
  [K in keyof LorcanaRuntimeMoveInputs]: LorcanaMoveDefinition<K>;
};

const createUnimplementedRuntimeMove = <TInput extends keyof LorcanaRuntimeMoveInputs>(
  moveName: TInput,
): LorcanaMoveDefinition<TInput> => ({
  serverOnly: true,
  validate: () => ({
    valid: false,
    error: `${moveName} is not yet implemented`,
    errorCode: "MOVE_NOT_IMPLEMENTED",
  }),
  execute: () => {
    throw new Error(`Move '${moveName}' is not yet implemented`);
  },
});

const sing = createUnimplementedRuntimeMove("sing");
const singTogether = createUnimplementedRuntimeMove("singTogether");
export const lorcanaRuntimeMoves = {
  // Setup
  chooseWhoGoesFirst,
  alterHand,

  // Resources
  putCardIntoInkwell,

  // Core
  playCard,
  quest,
  questWithAll,
  challenge,

  // Songs (TODO: implement properly)
  sing,
  singTogether,

  // Location
  moveCharacterToLocation,

  // Abilities
  activateAbility,

  // Effect resolution
  resolveBag,
  resolveEffect,

  // Standard
  passTurn,
  concede,

  // Server-only
  forfeitGame,

  // Debug
  manualMoveCard,
  manualExertCard,
  manualReadyCard,
  manualDryCard,
  manualSetDamage,
  manualSetLore,
  manualShuffleDeck,
  manualPassTurn,
} satisfies LorcanaRuntimeMoveRegistry;

// Re-export individual moves
export { activateAbility } from "./moves/abilities";
export {
  challenge,
  moveCharacterToLocation,
  playCard,
  putCardIntoInkwell,
  quest,
  questWithAll,
} from "./moves/core";
export { alterHand, chooseWhoGoesFirst } from "./moves/setup";
export { concede, forfeitGame, passTurn } from "./moves/turn";
export { resolveBag, resolveEffect } from "./resolution";
export {
  manualExertCard,
  manualMoveCard,
  manualDryCard,
  manualPassTurn,
  manualReadyCard,
  manualSetDamage,
  manualSetLore,
  manualShuffleDeck,
} from "./debug";
export type { LorcanaCardDerived } from "./state";
