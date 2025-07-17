import type { LorcanaGameState } from "../lorcana-engine-types";

/**
 * Creates an empty LorcanaGameState with additional properties needed for testing
 */
export function createEmptyLorcanaGameState(
  matchId = "",
  gameId = "",
  randomSeed = "",
  firstPlayer = "",
  playerIds: string[] = [],
): LorcanaGameState {
  return {
    effects: [],
    bag: [],
    metas: {},
    turnActions: undefined, // Explicitly set to undefined to start fresh
  };
}
