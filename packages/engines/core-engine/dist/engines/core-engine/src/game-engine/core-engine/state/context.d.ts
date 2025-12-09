import type { GameCards } from "~/game-engine/core-engine/types";
import type { Zone } from "../engine/zone-operation";
import type { PlayerID, PlayerId } from "~/game-engine/core-engine/types/core-types";
export type PlayerState<PlayerTurnHistory = unknown> = {
    id: string;
    name: string;
    lore?: number;
    turnHistory?: PlayerTurnHistory[];
};
export interface CoreCtx<TurnHistory = unknown> {
    playerOrder: Array<PlayerID>;
    turnPlayerPos: number;
    priorityPlayerPos: number;
    gameId: string;
    matchId: string;
    otp?: PlayerID;
    choosingFirstPlayer?: PlayerId;
    pendingMulligan?: Set<PlayerId>;
    pendingChampionSelection?: Set<PlayerId>;
    gameOver?: unknown;
    winner?: PlayerID;
    manualMode?: boolean;
    numTurns: number;
    numMoves?: number;
    numTurnMoves: number;
    currentSegment?: string;
    currentTurn?: string;
    currentPhase?: string;
    currentStep?: string;
    cards: GameCards;
    cardZones?: Record<string, Zone>;
    moveHistory: GameMoveHistoryEntry[];
    players: {
        [id: PlayerID]: PlayerState<TurnHistory>;
    };
    seed?: string | number;
}
export type GameMoveHistoryEntry = {
    id: string;
    playerId: string;
    timestamp: number;
    type: string;
    data: Record<string, any>;
};
export declare function createCtx<TurnHistory = unknown>({ playerOrder, initialSegment, initialPhase, initialStep, cards, cardZones, players, seed, gameId, matchId, }: {
    playerOrder?: Array<PlayerID>;
    initialSegment?: string;
    initialPhase?: string;
    initialStep?: string;
    cards: GameCards;
    cardZones?: Record<string, Zone>;
    players: Record<string, PlayerState<TurnHistory>>;
    gameId?: string;
    matchId?: string;
    seed?: number | string;
}): CoreCtx;
/**
 * Legacy function with shallow copying - use for backward compatibility
 * For new code, prefer using ImmutableContextManager directly
 */
export declare function setNextTurnPlayer(ctx: CoreCtx): CoreCtx;
/**
 * Enhanced version using immutable context manager
 * Provides deep immutability and change tracking
 */
export declare function getCurrentTurnPlayer(ctx: CoreCtx): PlayerID | null;
export declare function getCurrentPriorityPlayer(ctx: CoreCtx): PlayerID | null;
export declare function hasPriorityPlayer(ctx: CoreCtx, playerId: PlayerID): boolean;
/**
 * Legacy function with shallow copying - use for backward compatibility
 * For new code, prefer using ImmutableContextManager directly
 */
export declare function setPriorityPlayer(ctx: CoreCtx, player: PlayerID): CoreCtx;
/**
 * Legacy function with shallow copying - use for backward compatibility
 * For new code, prefer using ImmutableContextManager directly
 */
export declare function setTurnPlayer(ctx: CoreCtx, player: PlayerID): CoreCtx;
//# sourceMappingURL=context.d.ts.map