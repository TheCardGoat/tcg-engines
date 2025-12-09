/**
 * Alpha Clash Game Definition
 *
 * Main game configuration that defines the complete Alpha Clash game flow,
 * win conditions, and overall game structure.
 */
import { logger } from "~/game-engine/core-engine/utils/logger";
import { alphaClashMoves } from "../moves/moves";
import { duringGameSegment } from "./segments/during-game/during-game-segment";
import { endGameSegment } from "./segments/end-game/end-game-segment";
import { startingAGameSegment } from "./segments/starting-a-game/starting-a-game-segment";
export const alphaClashGameDefinition = {
    name: "AlphaClash",
    // Define game segments and their flow
    segments: {
        startingAGame: startingAGameSegment,
        duringGame: duringGameSegment,
        endGame: endGameSegment,
    },
    // Global moves available across all segments
    moves: alphaClashMoves,
    // Win condition checker - runs after each move/phase
    endIf: ({ G, ctx }) => {
        logger.debug("Checking win conditions");
        // Check for players who have lost
        let activePlayers = 0;
        for (const playerId of ctx.playerOrder) {
            let playerLost = false;
            // Loss condition 1: Contender health 0 or below
            const contenderZone = ctx.cardZones?.[`${playerId}-contender`];
            if (!contenderZone || contenderZone.cards.length === 0) {
                // No contender in zone = player lost
                logger.info(`${playerId} lost: No contender in play`);
                playerLost = true;
            }
            // Loss condition 2: Drawing from empty deck (would be handled in specific move)
            if (!playerLost) {
                activePlayers++;
            }
        }
        // Game ends when only one or zero players remain
        return activePlayers <= 1;
    },
};
//# sourceMappingURL=alpha-clash-game-definition.js.map