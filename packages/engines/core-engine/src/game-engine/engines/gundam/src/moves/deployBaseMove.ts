import type { GundamMove } from "~/game-engine/engines/gundam/src/moves/types";

export const deployBaseMove: GundamMove = (
  { G, coreOps, playerID },
  cardInstanceId: string,
) => {
  coreOps.playCardFromHand(playerID, cardInstanceId, "baseSection");
  return G;
};
