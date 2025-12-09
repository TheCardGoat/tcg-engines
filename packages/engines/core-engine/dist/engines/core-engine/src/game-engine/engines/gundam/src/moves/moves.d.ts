import type { GundamGameState } from "../gundam-engine-types";
/**
 * Gundam Card Game moves collection
 * These are the actions players can take during the game
 */
export declare const gundamMoves: {
    chooseFirstPlayer: import("./types").GundamMove;
    redrawHand: import("./types").GundamMove;
    concede: ({ G, playerID, }: {
        G: GundamGameState;
        playerID: string;
    }) => {
        winner: string;
        gameId?: string;
        matchId?: string;
        numPlayers?: number;
        choosingFirstPlayer?: string;
        firstPlayer?: string;
        createdAt?: number;
        randomSeed?: string;
        manualMode?: boolean;
        turn?: string;
        priority?: string;
        phase?: import("../gundam-engine-types").GamePhase;
        players?: Record<string, import("../gundam-engine-types").PlayerState>;
        actionHistory?: string[];
    };
    activateCards: ({ G }: {
        G: GundamGameState;
    }) => GundamGameState;
    drawCard: import("./types").GundamMove;
    playResource: import("./types").GundamMove;
    deployUnit: ({ G }: {
        G: GundamGameState;
    }) => GundamGameState;
    deployBase: ({ G }: {
        G: GundamGameState;
    }) => GundamGameState;
    pairPilot: ({ G }: {
        G: GundamGameState;
    }) => GundamGameState;
    playCommand: ({ G }: {
        G: GundamGameState;
    }) => GundamGameState;
    activateMain: ({ G }: {
        G: GundamGameState;
    }) => GundamGameState;
    attackWithUnit: ({ G }: {
        G: GundamGameState;
    }) => GundamGameState;
    endMainPhase: ({ G }: {
        G: GundamGameState;
    }) => GundamGameState;
    activateAction: ({ G }: {
        G: GundamGameState;
    }) => GundamGameState;
    playActionCommand: ({ G }: {
        G: GundamGameState;
    }) => GundamGameState;
    pass: ({ G }: {
        G: GundamGameState;
    }) => GundamGameState;
    discardToHandSize: ({ G }: {
        G: GundamGameState;
    }) => GundamGameState;
};
//# sourceMappingURL=moves.d.ts.map