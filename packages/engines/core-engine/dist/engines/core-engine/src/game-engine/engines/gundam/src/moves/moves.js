import { chooseFirstPlayer } from "./chooseFirstPlayer";
import { concede } from "./concede";
import { drawCardMove } from "./drawCard";
import { playResourceMove } from "./playResource";
import { redrawHandMove } from "./redrawHand";
/**
 * Gundam Card Game moves collection
 * These are the actions players can take during the game
 */
export const gundamMoves = {
    // Setup and game management moves
    chooseFirstPlayer,
    redrawHand: redrawHandMove,
    concede,
    // Start Phase moves
    activateCards: ({ G }) => G,
    // Draw Phase moves
    drawCard: drawCardMove,
    // Resource Phase moves
    playResource: playResourceMove,
    // Main Phase moves
    deployUnit: ({ G }) => G,
    deployBase: ({ G }) => G,
    pairPilot: ({ G }) => G,
    playCommand: ({ G }) => G,
    activateMain: ({ G }) => G,
    attackWithUnit: ({ G }) => G,
    endMainPhase: ({ G }) => G,
    // End Phase moves
    activateAction: ({ G }) => G,
    playActionCommand: ({ G }) => G,
    pass: ({ G }) => G,
    discardToHandSize: ({ G }) => G,
};
//# sourceMappingURL=moves.js.map