/**
 * Mulligan move for Alpha Clash
 *
 * Allows players to shuffle their opening hand back into their deck
 * and draw a new hand. This follows standard TCG mulligan rules.
 */
import { createInvalidMove } from "~/game-engine/core-engine/move/move-types";
import { logger } from "~/game-engine/core-engine/utils/logger";
export const mulligan = ({ G, playerID, coreOps, ctx }, keepHand = false) => {
    if (!playerID) {
        logger.warn("Mulligan: No player ID provided");
        return createInvalidMove("NO_PLAYER_ID", "moves.mulligan.errors.noPlayerId");
    }
    // Check if player has pending mulligan
    if (!ctx.pendingMulligan?.has(playerID)) {
        logger.warn(`Mulligan: Player ${playerID} does not have pending mulligan`);
        return createInvalidMove("NO_PENDING_MULLIGAN", "moves.mulligan.errors.noPendingMulligan", { playerId: playerID });
    }
    if (keepHand) {
        logger.info(`Mulligan: ${playerID} kept their opening hand`);
    }
    else {
        // Get current hand
        const handZone = coreOps.getZone("hand", playerID);
        const handCards = handZone.cards;
        if (handCards.length > 0) {
            // Shuffle hand back into deck
            for (const cardInstanceId of handCards) {
                coreOps.moveCard({
                    playerId: playerID,
                    instanceId: cardInstanceId,
                    from: "hand",
                    to: "deck",
                    destination: "end",
                });
            }
            // Shuffle deck
            coreOps.shuffleZone("deck", playerID);
            // Draw new hand (7 cards standard)
            const handSize = 7;
            for (let i = 0; i < handSize; i++) {
                coreOps.moveCard({
                    playerId: playerID,
                    from: "deck",
                    to: "hand",
                    destination: "end",
                });
            }
            logger.info(`Mulligan: ${playerID} mulliganed their hand`);
        }
    }
    // Remove player from pending mulligan
    coreOps.playerHasMulliganed(playerID);
    return G;
};
//# sourceMappingURL=mulligan.js.map