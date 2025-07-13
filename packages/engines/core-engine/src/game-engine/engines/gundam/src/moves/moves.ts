import type { Move } from "~/game-engine/core-engine/move/move-types";
import type { GundamGameState } from "../gundam-engine-types";
import { chooseFirstPlayer } from "./chooseFirstPlayer";
import { concede } from "./concede";
import { drawCardMove } from "./drawCard";
import { playResourceMove } from "./playResource";
import { redrawHandMove, redrawHandMoveFn } from "./redrawHand";

/**
 * Gundam Card Game moves collection
 * These are the actions players can take during the game
 */
export const gundamMoves: Record<string, Move<GundamGameState>> = {
  // Game Setup Moves
  chooseFirstPlayer,
  redrawHand: redrawHandMove,
  redrawHandFn: redrawHandMoveFn,
  concede,

  // Start Phase moves
  activateCards: ({ G }: { G: GundamGameState }) => G,

  // Draw Phase moves
  drawCard: drawCardMove,

  // Resource Phase moves
  playResource: playResourceMove,

  // Main Phase moves
  deployUnit: ({ G }: { G: GundamGameState }) => G,
  deployBase: ({ G }: { G: GundamGameState }) => G,
  pairPilot: ({ G }: { G: GundamGameState }) => G,
  playCommand: ({ G }: { G: GundamGameState }) => G,
  activateMain: ({ G }: { G: GundamGameState }) => G,
  attackWithUnit: ({ G }: { G: GundamGameState }) => G,
  endMainPhase: ({ G }: { G: GundamGameState }) => G,

  // End Phase moves
  activateAction: ({ G }: { G: GundamGameState }) => G,
  playActionCommand: ({ G }: { G: GundamGameState }) => G,
  pass: ({ G }: { G: GundamGameState }) => G,
  discardToHandSize: ({ G }: { G: GundamGameState }) => G,
};
