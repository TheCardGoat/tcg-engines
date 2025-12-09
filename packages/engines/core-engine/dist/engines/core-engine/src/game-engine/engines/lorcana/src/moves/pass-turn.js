import { createInvalidMove } from "~/game-engine/core-engine/move/move-types";
import { getCurrentTurnPlayer } from "~/game-engine/core-engine/state/context";
import { logger } from "~/game-engine/core-engine/utils/logger";
// **4.4.1.** To end a turn, there must be no abilities currently waiting to resolve. The active player declares the end of their turn.
// This creates the start of the End of Turn Phase (see 4.1.4).
// **4.4.1.4.** The turn ends for the active player, and the next player begins their turn.
export const passTurnMove = ({ G, ctx, coreOps, gameOps, playerID, }) => {
    try {
        // Ensure it's the active player's turn
        const currentTurnPlayer = getCurrentTurnPlayer(ctx);
        if (currentTurnPlayer !== playerID && ctx.otp !== playerID) {
            logger.error(`Player ${playerID} cannot pass turn - not their turn`);
            return createInvalidMove("NOT_YOUR_TURN", "moves.passTurn.errors.notYourTurn", { playerId: playerID, currentTurnPlayer });
        }
        // Rule 4.4.1: There must be no abilities currently waiting to resolve
        // Check if the bag has any pending effects that need to be resolved
        if (G.bag && G.bag.length > 0) {
            logger.error(`Cannot pass turn while abilities are waiting to resolve (${G.bag.length} effects in bag)`);
            return createInvalidMove("ABILITIES_PENDING", "moves.passTurn.errors.abilitiesPending", { pendingEffects: G.bag.length, playerId: playerID });
        }
        // Clear turn actions for the next turn
        // Turn actions like putCardIntoInkwell are limited to once per turn
        G.turnActions = undefined;
        // The actual turn transition will be handled by the flow manager
        // when it detects that the main phase should end
        // We don't directly change the turn player here - that's the flow manager's job
        logger.info(`Player ${playerID} passed their turn`);
        // Add any "end of turn" effects to the bag (rule 4.4.1.1)
        // This is a placeholder - in a full implementation, we would:
        // 1. Check for cards/effects that trigger "at the end of the turn"
        // 2. Add them to the bag for resolution
        // 3. Let the flow manager handle the actual turn transition
        // For now, we just log that the turn is ending - the actual triggered effects
        // would need to be implemented per-card basis
        logger.debug(`End of turn effects would be processed for player ${playerID}`);
        return G;
    }
    catch (error) {
        logger.error(`Unexpected error in passTurnMove: ${error}`);
        return createInvalidMove("UNEXPECTED_ERROR", "moves.passTurn.errors.unexpectedError", { error: String(error), playerId: playerID });
    }
};
//# sourceMappingURL=pass-turn.js.map