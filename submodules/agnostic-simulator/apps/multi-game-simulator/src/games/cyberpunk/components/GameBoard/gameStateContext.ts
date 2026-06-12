import { createContext, useContext } from "react";
import type { Side } from "../../engine";
import type { Phase } from "./gameStateTypes";

export interface GameState {
  activeSide: Side;
  prioritySide: Side;
  phase: Phase;
  gameEnded: boolean;
  /** Engine-reported winner side, mapped to "player" | "opponent". Null when the game is still running or ended in a draw. */
  winnerSide: Side | null;
  /** Free-form reason string from the engine (e.g. "gig_victory"). */
  winReason: string | null;
  turnNumber: number;
  advancePhase: () => void;
}

export const GameStateContext = createContext<GameState | null>(null);

export function useGameState() {
  const ctx = useContext(GameStateContext);
  if (!ctx) {
    throw new Error("useGameState must be used inside GameStateProvider");
  }
  return ctx;
}
