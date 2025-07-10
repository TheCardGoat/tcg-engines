import type { LorcanaMove } from "./types";

export const chooseWhoGoesFirstMove: LorcanaMove = (
  { G, coreOps },
  playerId: string,
) => {
  coreOps.setOTP(playerId);
  coreOps.setPendingMulligan(coreOps.getPlayers());
  coreOps.setPriorityPlayer(playerId);

  return G;
};
