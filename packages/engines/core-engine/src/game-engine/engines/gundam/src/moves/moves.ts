import { deployBaseMove } from "~/game-engine/engines/gundam/src/moves/deployBaseMove";
import { deployUnitMove } from "~/game-engine/engines/gundam/src/moves/deployUnitMove";
import { endMainPhaseMove } from "~/game-engine/engines/gundam/src/moves/endMainPhase";
import type { GundamGameState } from "../gundam-engine-types";
import { chooseFirstPlayer } from "./chooseFirstPlayer";
import { concede } from "./concede";
import { playResourceMove } from "./playResource";
import { redrawHandMove } from "./redrawHand";

/**
 * Gundam Card Game moves collection
 * These are the actions players can take during the game
 */
export const gundamMoves = {
  // Setup and game management moves
  chooseFirstPlayer,
  redrawHand: redrawHandMove,
  concede,

  // Start Phase moves
  activateCards: ({ G }: { G: GundamGameState }) => G,

  // Draw Phase moves
  // this should be a core operation, but we keep it here for clarity
  drawCard: ({ G }: { G: GundamGameState }) => G,

  // Resource Phase moves
  playResource: playResourceMove,

  // Main Phase moves
  deployUnit: deployUnitMove,
  deployBase: deployBaseMove,
  pairPilot: ({ G }: { G: GundamGameState }) => G,
  playCommand: ({ G }: { G: GundamGameState }) => G,
  activateMain: ({ G }: { G: GundamGameState }) => G,
  attackWithUnit: ({ G }: { G: GundamGameState }) => G,
  endMainPhase: endMainPhaseMove,

  // End Phase moves
  activateAction: ({ G }: { G: GundamGameState }) => G,
  playActionCommand: ({ G }: { G: GundamGameState }) => G,
  pass: ({ G }: { G: GundamGameState }) => G,
  discardToHandSize: ({ G }: { G: GundamGameState }) => G,
};
