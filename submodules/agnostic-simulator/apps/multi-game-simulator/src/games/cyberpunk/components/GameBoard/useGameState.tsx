import { useMemo, type ReactNode } from "react";
import { PLAYER_SIDE_TO_ID, useEngineOptional, type Side } from "../../engine";
import type { Phase } from "./gameStateTypes";
import { GameStateContext, type GameState } from "./gameStateContext";

const PLAYER_ID_TO_SIDE: Record<string, Side> = Object.fromEntries(
  Object.entries(PLAYER_SIDE_TO_ID).map(([side, id]) => [id, side as Side]),
) as Record<string, Side>;

const ENGINE_PHASE_TO_LOCAL: Record<string, Phase> = {
  setup: "SETUP",
  start: "START",
  main: "MAIN",
  end: "END",
};

/**
 * Layout-level game state. Reads from the engine when an EngineProvider is
 * present, otherwise falls back to a static stub so storybook / unit tests
 * keep working.
 */
export function GameStateProvider({ children }: { children: ReactNode }) {
  const engine = useEngineOptional();

  const value = useMemo<GameState>(() => {
    if (!engine) {
      return {
        activeSide: "player",
        prioritySide: "player",
        phase: "MAIN",
        gameEnded: false,
        winnerSide: null,
        winReason: null,
        turnNumber: 1,
        advancePhase: () => {},
      };
    }
    const matchState = engine.matchState;
    const turnNumber = matchState.G.turnMetadata.turnNumber;
    const phase = ENGINE_PHASE_TO_LOCAL[matchState.G.gamePhase] ?? "MAIN";
    const activeSide = engine.activeSide;
    const prioritySide = engine.prioritySide;
    const winnerId = matchState.G.winnerId;
    const winnerSide = winnerId ? (PLAYER_ID_TO_SIDE[winnerId] ?? null) : null;
    return {
      activeSide,
      prioritySide,
      phase,
      gameEnded: matchState.G.gameEnded,
      winnerSide,
      winReason: matchState.G.winReason,
      turnNumber,
      advancePhase: () => {
        const asPlayer = PLAYER_SIDE_TO_ID[activeSide];
        engine.dispatch({ type: "passPhase", as: asPlayer });
      },
    };
  }, [engine]);

  return <GameStateContext.Provider value={value}>{children}</GameStateContext.Provider>;
}
