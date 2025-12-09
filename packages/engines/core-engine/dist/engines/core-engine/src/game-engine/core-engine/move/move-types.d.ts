import type { FnContext } from "~/game-engine/core-engine/game-configuration";
import type { CoreCtx } from "~/game-engine/core-engine/state/context";
import type { CoreCardInstance } from "../card/core-card-instance";
import type { BaseCoreCardFilter, DefaultCardDefinition, DefaultGameState, DefaultPlayerState, GameSpecificCardDefinition, GameSpecificCardFilter, GameSpecificGameState, GameSpecificPlayerState } from "../types/game-specific-types";
import type { PlayerID } from "~/game-engine/core-engine/types/core-types";
/**
 * Structured invalid move result with reason and human-readable message key
 */
export interface InvalidMoveResult {
    type: "INVALID_MOVE";
    reason: string;
    messageKey: string;
    context?: Record<string, unknown>;
}
/**
 * Game-specific constraint that can be checked for a move
 */
export interface GameMoveConstraint<Context = FnContext<DefaultGameState, DefaultCardDefinition, DefaultPlayerState, BaseCoreCardFilter, CoreCardInstance<DefaultCardDefinition>>> {
    readonly id: string;
    readonly check: (context: Context) => boolean;
    readonly failureReason: string;
    readonly messageKey: string;
    readonly context?: Record<string, unknown>;
}
/**
 * Constraint failure information
 */
export interface MoveConstraintFailure {
    readonly constraintId: string;
    readonly reason: string;
    readonly messageKey: string;
    readonly context?: Record<string, unknown>;
}
/**
 * Target specification for a move parameter
 */
export interface TargetSpec<Context = FnContext<DefaultGameState, DefaultCardDefinition, DefaultPlayerState, BaseCoreCardFilter, CoreCardInstance<DefaultCardDefinition>>, CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter> {
    readonly id: string;
    readonly parameterIndex: number;
    readonly required: boolean;
    readonly targetType: "card" | "player" | "zone" | "choice";
    readonly cardFilter?: CardFilter;
    readonly playerFilter?: (context: Context, playerId: PlayerID) => boolean;
    readonly zoneFilter?: (context: Context, zoneId: string, playerId?: PlayerID) => boolean;
    readonly choices?: readonly string[];
    readonly description: string;
    readonly messageKey: string;
}
/**
 * Legacy function type for backward compatibility
 * This will be removed in Phase 2 when all moves are converted to EnumerableMove
 */
export type MoveFn<G extends GameSpecificGameState = DefaultGameState, CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition, PlayerState extends GameSpecificPlayerState = DefaultPlayerState, CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter, CardInstance extends CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>, GameEngine = unknown> = (context: FnContext<G, CardDefinition, PlayerState, CardFilter, CardInstance> & {
    playerID: PlayerID;
    gameOps: GameEngine;
}, ...args: unknown[]) => undefined | G | InvalidMoveResult;
/**
 * Enumerable move object that provides execution, constraints, targets, and priority
 */
export interface EnumerableMove<G extends GameSpecificGameState = DefaultGameState, CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition, PlayerState extends GameSpecificPlayerState = DefaultPlayerState, CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter, CardInstance extends CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>, GameEngine = unknown> {
    readonly execute: (context: FnContext<G, CardDefinition, PlayerState, CardFilter, CardInstance> & {
        playerID: PlayerID;
        gameOps: GameEngine;
    }, ...args: unknown[]) => undefined | G | InvalidMoveResult;
    readonly getConstraints?: (context: FnContext<G, CardDefinition, PlayerState, CardFilter, CardInstance> & {
        playerID: PlayerID;
        gameOps: GameEngine;
    }) => GameMoveConstraint<typeof context>[];
    readonly getTargetSpecs?: (context: FnContext<G, CardDefinition, PlayerState, CardFilter, CardInstance> & {
        playerID: PlayerID;
        gameOps: GameEngine;
    }, ...args: unknown[]) => TargetSpec<typeof context, CardFilter>[];
    readonly getPriority?: (context: FnContext<G, CardDefinition, PlayerState, CardFilter, CardInstance> & {
        playerID: PlayerID;
        gameOps: GameEngine;
    }) => number;
}
/**
 * Move type - temporarily supports both function and object moves
 * Will be restricted to only EnumerableMove in Phase 2
 */
export type Move<G extends GameSpecificGameState = DefaultGameState, CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition, PlayerState extends GameSpecificPlayerState = DefaultPlayerState, CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter, CardInstance extends CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>, GameEngine = unknown> = MoveFn<G, CardDefinition, PlayerState, CardFilter, CardInstance, GameEngine> | EnumerableMove<G, CardDefinition, PlayerState, CardFilter, CardInstance, GameEngine>;
/**
 * LongFormMove interface for backward compatibility
 */
export interface LongFormMove<G extends GameSpecificGameState, CardDefinition extends GameSpecificCardDefinition, PlayerState extends GameSpecificPlayerState, CardFilter extends GameSpecificCardFilter, CardInstance extends CoreCardInstance<CardDefinition>> {
    move: MoveFn<G, CardDefinition, PlayerState, CardFilter, CardInstance>;
    redact?: boolean | ((context: {
        G: G;
        ctx: CoreCtx;
    }) => boolean);
    noLimit?: boolean;
    client?: boolean;
    undoable?: boolean | ((context: {
        G: G;
        ctx: CoreCtx;
    }) => boolean);
    ignoreStaleStateID?: boolean;
}
/**
 * Type guard to check if a move is an enumerable move
 */
export declare function isEnumerableMove<G extends GameSpecificGameState = DefaultGameState, CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition, PlayerState extends GameSpecificPlayerState = DefaultPlayerState, CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter, CardInstance extends CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>, GameEngine = unknown>(move: Move<G, CardDefinition, PlayerState, CardFilter, CardInstance, GameEngine>): move is EnumerableMove<G, CardDefinition, PlayerState, CardFilter, CardInstance, GameEngine>;
/**
 * Type guard to check if a move is a function move
 */
export declare function isMoveFn<G extends GameSpecificGameState = DefaultGameState, CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition, PlayerState extends GameSpecificPlayerState = DefaultPlayerState, CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter, CardInstance extends CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>, GameEngine = unknown>(move: Move<G, CardDefinition, PlayerState, CardFilter, CardInstance, GameEngine>): move is MoveFn<G, CardDefinition, PlayerState, CardFilter, CardInstance, GameEngine>;
/**
 * Helper function to create an enumerable move
 */
export declare function createEnumerableMove<G extends GameSpecificGameState = DefaultGameState, CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition, PlayerState extends GameSpecificPlayerState = DefaultPlayerState, CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter, CardInstance extends CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>, GameEngine = unknown>(move: EnumerableMove<G, CardDefinition, PlayerState, CardFilter, CardInstance, GameEngine>): EnumerableMove<G, CardDefinition, PlayerState, CardFilter, CardInstance, GameEngine>;
/**
 * Helper function to create an invalid move result
 */
export declare function createInvalidMove(reason: string, messageKey: string, context?: Record<string, unknown>): InvalidMoveResult;
/**
 * Type guard to check if a result is an invalid move
 */
export declare function isInvalidMove(result: unknown): result is InvalidMoveResult;
/**
 * Helper function to adapt legacy function moves to EnumerableMove objects
 * This is temporary for Phase 1 and will be removed in Phase 2
 */
export declare function adaptLegacyMove<G extends GameSpecificGameState = DefaultGameState, CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition, PlayerState extends GameSpecificPlayerState = DefaultPlayerState, CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter, CardInstance extends CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>, GameEngine = unknown>(legacyMoveFn: MoveFn<G, CardDefinition, PlayerState, CardFilter, CardInstance, GameEngine>): EnumerableMove<G, CardDefinition, PlayerState, CardFilter, CardInstance, GameEngine>;
/**
 * Helper function to get the execution function from any move type
 */
export declare function getExecuteFunction<G extends GameSpecificGameState = DefaultGameState, CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition, PlayerState extends GameSpecificPlayerState = DefaultPlayerState, CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter, CardInstance extends CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>, GameEngine = unknown>(move: Move<G, CardDefinition, PlayerState, CardFilter, CardInstance, GameEngine>): MoveFn<G, CardDefinition, PlayerState, CardFilter, CardInstance, GameEngine>;
//# sourceMappingURL=move-types.d.ts.map