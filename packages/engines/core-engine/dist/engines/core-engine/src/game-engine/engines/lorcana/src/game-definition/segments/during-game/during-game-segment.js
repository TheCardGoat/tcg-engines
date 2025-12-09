import { lorcanaMoves } from "~/game-engine/engines/lorcana/src/moves/moves";
export const duringGameSegment = {
    next: "endGame",
    endIf: () => {
        return false;
    },
    turn: {
        phases: {
            beginningPhase: {
                start: true,
                next: "mainPhase",
                endIf: () => {
                    return true;
                },
                steps: {
                    ready: {},
                    set: {},
                    draw: {},
                },
            },
            mainPhase: {
                next: "endOfTurnPhase",
                steps: {
                    idle: {
                        start: true,
                        moves: {
                            putACardIntoTheInkwell: lorcanaMoves.putACardIntoTheInkwell,
                            passTurn: lorcanaMoves.passTurn,
                            playCard: ({ G }) => {
                                return G;
                            },
                            quest: ({ G }) => {
                                return G;
                            },
                            challenge: ({ G }) => {
                                return G;
                            },
                            moveCharacter: ({ G }) => {
                                return G;
                            },
                            activateAbility: ({ G }) => {
                                return G;
                            },
                        },
                    },
                    bag: {
                        moves: {
                            resolveBag: ({ G }) => {
                                return G;
                            },
                        },
                    },
                    challenge: {
                        moves: {},
                    },
                },
            },
            endOfTurnPhase: {
                next: "beginningPhase",
            },
        },
    },
};
//# sourceMappingURL=during-game-segment.js.map