import type { GundamMove } from "~/game-engine/engines/gundam/src/moves/types";

export const deployUnitMove: GundamMove = (
  { G, coreOps, playerID },
  cardInstanceId: string,
) => {
  coreOps.playCardFromHand(playerID, cardInstanceId, "battleArea");
  return G;
};
