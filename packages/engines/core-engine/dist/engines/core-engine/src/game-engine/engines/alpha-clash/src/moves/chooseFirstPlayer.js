/**
 * Choose First Player move for Alpha Clash
 *
 * Allows a player to choose who goes first in the game.
 * This move is only available during the setup phase.
 */
import { createInvalidMove } from "~/game-engine/core-engine/move/move-types";
import { logger } from "~/game-engine/core-engine/utils/logger";
export const chooseFirstPlayer = ({ G, playerID, coreOps }, chosenPlayerId) => {
    if (!playerID) {
        logger.warn("ChooseFirstPlayer: No player ID provided");
        return createInvalidMove("NO_PLAYER_ID", "moves.chooseFirstPlayer.errors.noPlayerId");
    }
    // Validate the chosen player exists
    const players = coreOps.getPlayers();
    if (!players.includes(chosenPlayerId)) {
        logger.warn(`ChooseFirstPlayer: Invalid player ID ${chosenPlayerId}`);
        return createInvalidMove("INVALID_PLAYER_ID", "moves.chooseFirstPlayer.errors.invalidPlayerId", { chosenPlayerId, availablePlayers: players });
    }
    // Can only choose first player once
    if (G.firstPlayerChosen) {
        logger.warn("ChooseFirstPlayer: First player already chosen");
        return createInvalidMove("FIRST_PLAYER_ALREADY_CHOSEN", "moves.chooseFirstPlayer.errors.firstPlayerAlreadyChosen");
    }
    // Set the first player
    coreOps.setOTP(chosenPlayerId);
    // Mark that first player has been chosen
    const newGameState = {
        ...G,
        firstPlayerChosen: true,
    };
    logger.info(`ChooseFirstPlayer: ${playerID} chose ${chosenPlayerId} to go first`);
    return newGameState;
};
//# sourceMappingURL=chooseFirstPlayer.js.map