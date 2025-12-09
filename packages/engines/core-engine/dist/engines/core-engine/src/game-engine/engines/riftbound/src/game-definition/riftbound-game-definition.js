import { riftboundMoves } from "../moves/moves";
export const RiftboundGame = {
    name: "riftbound",
    numPlayers: 2,
    deltaState: false,
    disableUndo: true,
    endIf: ({ G, ctx }) => {
        // Game ends when a player reaches victory score
        // Winner is determined through CoreEngine context
        return false; // Let CoreEngine handle win conditions
    },
    onEnd: ({ G }) => {
        return G;
    },
    playerView: ({ G }) => {
        return G;
    },
    moves: {
        concede: riftboundMoves.concede,
        endTurn: riftboundMoves.endTurn,
        drawCard: riftboundMoves.drawCard,
        chooseFirstPlayer: riftboundMoves.chooseFirstPlayer,
    },
    segments: {
        setup: {
            next: "gamePlay",
            turn: {
                phases: {
                    setup: {
                        start: true,
                        next: "setup",
                    },
                },
            },
            onBegin: ({ G, coreOps }) => {
                // Initialize setup phase - domain selection, first player, etc.
                return G;
            },
        },
        gamePlay: {
            next: "endGame",
            turn: {
                phases: {
                    action: {
                        start: true,
                        next: "ending",
                    },
                    ending: {
                        next: "action",
                    },
                },
            },
            onBegin: ({ G, coreOps }) => {
                // Initialize main game phase
                return G;
            },
        },
        endGame: {
            next: undefined,
            turn: {
                phases: {
                    end: {
                        start: true,
                        next: "end",
                    },
                },
            },
            onBegin: ({ G, coreOps }) => {
                // Handle game end
                return G;
            },
        },
    },
};
//# sourceMappingURL=riftbound-game-definition.js.map