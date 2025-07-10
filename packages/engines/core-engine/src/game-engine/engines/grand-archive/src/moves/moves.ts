/**
 * Grand Archive Move Registry
 *
 * Central registry for all Grand Archive moves and player actions
 */

import type { Move } from "~/game-engine/core-engine/move/move-types";
import type { GrandArchiveGameState } from "../../grand-archive-engine-types";

// Base move type for Grand Archive
export type GrandArchiveMove = Move<GrandArchiveGameState>;

// Placeholder moves - will be implemented in next phase
export const grandArchiveMoves = {
  // Setup moves
  chooseFirstPlayer: {} as GrandArchiveMove,
  chooseChampion: {} as GrandArchiveMove,
  mulligan: {} as GrandArchiveMove,
  keepHand: {} as GrandArchiveMove,

  // Core gameplay moves
  activateCard: {} as GrandArchiveMove,
  materializeCard: {} as GrandArchiveMove,
  activateAbility: {} as GrandArchiveMove,
  pass: {} as GrandArchiveMove,

  // Combat moves
  declareAttack: {} as GrandArchiveMove,
  declareRetaliation: {} as GrandArchiveMove,

  // Champion moves
  levelUpChampion: {} as GrandArchiveMove,

  // Turn control
  skipMaterialization: {} as GrandArchiveMove,
  endTurn: {} as GrandArchiveMove,
};
