import type { GundamGameState } from "../gundam-engine-types";

/**
 * Concede move for Gundam Card Game
 * When a player concedes, they immediately lose the game (Rule 1-2-3)
 */
export const concede = ({
  G,
  playerID,
}: {
  G: GundamGameState;
  playerID: string;
}) => {
  // Get the opponent's player ID
  const opponentID = Object.keys(G.players).find((id) => id !== playerID);

  // Set the winner to the opponent
  return {
    ...G,
    winner: opponentID,
  };
};
