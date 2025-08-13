import type { GundamMove } from "./types";

/**
 * Implementation of the Gundam Card Game rule to choose first player:
 *
 * 6-2-1-4. Both players determine Player One and Player Two using a method such as rock paper scissors.
 * The winner decides who becomes Player One.
 */
export const chooseFirstPlayer: GundamMove = (
  { G, coreOps },
  targetPlayerId: string,
) => {
  console.log(
    `chooseFirstPlayer: Called with targetPlayerId=${targetPlayerId}`,
  );
  console.log("chooseFirstPlayer: coreOps available:", !!coreOps);
  console.log(
    "chooseFirstPlayer: setOTP method available:",
    typeof coreOps?.setOTP,
  );

  // Set one-time player (the player who goes first)
  coreOps.setOTP(targetPlayerId);
  console.log("chooseFirstPlayer: After setOTP, otp is:", coreOps.getCtx().otp);

  // Set the priority player to the chosen first player
  coreOps.setPriorityPlayer(targetPlayerId);

  // Also set the turn player for phases that need it
  coreOps.setTurnPlayer(targetPlayerId);

  coreOps.setPendingMulligan(coreOps.getPlayers());

  console.log("chooseFirstPlayer: Move completed successfully");
  return G;
};
