import type { GundamGameState } from "../gundam-engine-types";
/**
 * Concede move for Gundam Card Game
 * When a player concedes, they immediately lose the game (Rule 1-2-3)
 */
export declare const concede: ({ G, playerID, }: {
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
//# sourceMappingURL=concede.d.ts.map