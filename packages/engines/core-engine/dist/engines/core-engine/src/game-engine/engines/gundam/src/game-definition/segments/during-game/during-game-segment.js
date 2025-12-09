import { gundamMoves } from "~/game-engine/engines/gundam/src/moves/moves";
export const duringGameSegment = {
    next: "endGame",
    endIf: ({ G }) => {
        return G.winner !== undefined;
    },
    turn: {
        phases: {
            startPhase: {
                start: true,
                next: "drawPhase",
                steps: {
                    active: {
                    // Set all cards to active (Rule 6-2-2)
                    },
                    start: {
                    // Activate "at the start of the turn" effects (Rule 6-2-3)
                    },
                },
            },
            drawPhase: {
                next: "resourcePhase",
                // Draw 1 card (Rule 6-3-1)
                moves: {
                    drawCard: gundamMoves.drawCard,
                },
            },
            resourcePhase: {
                next: "mainPhase",
                // Play 1 resource (Rule 6-4-1)
                moves: {
                    playResource: gundamMoves.playResource,
                },
            },
            mainPhase: {
                next: "endPhase",
                // Main phase actions (Rule 6-5)
                moves: {
                    deployUnit: gundamMoves.deployUnit,
                    deployBase: gundamMoves.deployBase,
                    pairPilot: gundamMoves.pairPilot,
                    playCommand: gundamMoves.playCommand,
                    activateMain: gundamMoves.activateMain,
                    attackWithUnit: gundamMoves.attackWithUnit,
                    endMainPhase: gundamMoves.endMainPhase,
                },
                steps: {
                    attack: {
                        // Attack steps (Rule 7-2)
                        onBegin: ({ G }) => G,
                        onEnd: ({ G }) => G,
                    },
                },
            },
            endPhase: {
                next: "startPhase",
                // End phase steps (Rule 6-6)
                steps: {
                    actionStep: {
                        moves: {
                            activateAction: gundamMoves.activateAction,
                            playActionCommand: gundamMoves.playActionCommand,
                            pass: gundamMoves.pass,
                        },
                    },
                    endStep: {
                    // Activate "at the end of the turn" effects (Rule 6-6-3)
                    },
                    handStep: {
                        // Discard down to 10 cards if needed (Rule 6-6-4)
                        moves: {
                            discardToHandSize: gundamMoves.discardToHandSize,
                        },
                    },
                    cleanupStep: {
                    // End "during this turn" effects (Rule 6-6-5)
                    },
                },
            },
        },
    },
};
//# sourceMappingURL=during-game-segment.js.map