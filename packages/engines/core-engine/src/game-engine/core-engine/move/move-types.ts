import type { FnContext } from "~/game-engine/core-engine/game-configuration";
import type { CoreCtx } from "~/game-engine/core-engine/state/context";
import type { PlayerID } from "~/game-engine/core-engine/types/core-types";
import type { CoreCardInstance } from "../card/core-card-instance";
import type {
  BaseCoreCardFilter,
  DefaultCardDefinition,
  DefaultGameState,
  DefaultPlayerState,
  GameSpecificCardDefinition,
  GameSpecificCardFilter,
  GameSpecificGameState,
  GameSpecificPlayerState,
} from "../types/game-specific-types";

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
 * @deprecated use EnumerableMove instead
 * Function style move definition (for backward compatibility)
 * This represents the previous function-based move API
 */
export type MoveFn<
  G extends GameSpecificGameState = DefaultGameState,
  CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition,
  PlayerState extends GameSpecificPlayerState = DefaultPlayerState,
  CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter,
  CardInstance extends
    CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>,
> = (
  context: FnContext<
    G,
    CardDefinition,
    PlayerState,
    CardFilter,
    CardInstance
  > & { playerID: PlayerID },
  ...args: unknown[]
) => undefined | G | InvalidMoveResult;

/**
 * Game-specific constraint that can be checked for a move
 */
export interface GameMoveConstraint<
  Context = FnContext<
    DefaultGameState,
    DefaultCardDefinition,
    DefaultPlayerState,
    BaseCoreCardFilter,
    CoreCardInstance<DefaultCardDefinition>
  >,
> {
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
export interface TargetSpec<
  Context = FnContext<
    DefaultGameState,
    DefaultCardDefinition,
    DefaultPlayerState,
    BaseCoreCardFilter,
    CoreCardInstance<DefaultCardDefinition>
  >,
  CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter,
> {
  readonly id: string;
  readonly parameterIndex: number; // Which argument position this target corresponds to
  readonly required: boolean;
  readonly targetType: "card" | "player" | "zone" | "choice";
  readonly cardFilter?: CardFilter; // For card targets
  readonly playerFilter?: (context: Context, playerId: PlayerID) => boolean; // For player targets
  readonly zoneFilter?: (
    context: Context,
    zoneId: string,
    playerId?: PlayerID,
  ) => boolean; // For zone targets
  readonly choices?: readonly string[]; // For choice targets
  readonly description: string;
  readonly messageKey: string;
}

/**
 * Enumerable move object that provides execution, constraints, targets, and priority
 */
export interface EnumerableMove<
  G extends GameSpecificGameState = DefaultGameState,
  CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition,
  PlayerState extends GameSpecificPlayerState = DefaultPlayerState,
  CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter,
  CardInstance extends
    CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>,
> {
  // Execute the move (core logic)
  readonly execute: (
    context: FnContext<
      G,
      CardDefinition,
      PlayerState,
      CardFilter,
      CardInstance
    > & {
      playerID: PlayerID;
    },
    ...args: unknown[]
  ) => undefined | G | InvalidMoveResult;

  // Game-specific constraints (framework handles phase/segment/step/priority)
  readonly getConstraints?: (
    context: FnContext<
      G,
      CardDefinition,
      PlayerState,
      CardFilter,
      CardInstance
    > & {
      playerID: PlayerID;
    },
  ) => GameMoveConstraint<typeof context>[];

  // Target specifications
  readonly getTargetSpecs?: (
    context: FnContext<
      G,
      CardDefinition,
      PlayerState,
      CardFilter,
      CardInstance
    > & {
      playerID: PlayerID;
    },
    ...args: unknown[]
  ) => TargetSpec<typeof context, CardFilter>[];

  // Priority calculation (optional)
  readonly getPriority?: (
    context: FnContext<
      G,
      CardDefinition,
      PlayerState,
      CardFilter,
      CardInstance
    > & {
      playerID: PlayerID;
    },
  ) => number;
}

/**
 * Move type - now supports both EnumerableMove and legacy MoveFn
 */
export type Move<
  G extends GameSpecificGameState = DefaultGameState,
  CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition,
  PlayerState extends GameSpecificPlayerState = DefaultPlayerState,
  CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter,
  CardInstance extends
    CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>,
> =
  | EnumerableMove<G, CardDefinition, PlayerState, CardFilter, CardInstance>
  | MoveFn<G, CardDefinition, PlayerState, CardFilter, CardInstance>;

/**
 * Type guard to check if a move is an EnumerableMove
 */
export function isEnumerableMove<
  G extends GameSpecificGameState = DefaultGameState,
  CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition,
  PlayerState extends GameSpecificPlayerState = DefaultPlayerState,
  CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter,
  CardInstance extends
    CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>,
>(
  move: Move<G, CardDefinition, PlayerState, CardFilter, CardInstance>,
): move is EnumerableMove<
  G,
  CardDefinition,
  PlayerState,
  CardFilter,
  CardInstance
> {
  return typeof move === "object" && move !== null && "execute" in move;
}

/**
 * Helper function to create an invalid move result
 */
export function createInvalidMove(
  reason: string,
  messageKey: string,
  context?: Record<string, unknown>,
): InvalidMoveResult {
  return {
    type: "INVALID_MOVE",
    reason,
    messageKey,
    context,
  };
}

/**
 * Type guard to check if a result is an invalid move
 */
export function isInvalidMove(result: unknown): result is InvalidMoveResult {
  return (
    typeof result === "object" &&
    result !== null &&
    (result as InvalidMoveResult).type === "INVALID_MOVE"
  );
}

/**
 * Helper function to adapt legacy function moves to EnumerableMove objects
 * This is temporary for Phase 1 and will be removed in Phase 2
 */
export function adaptLegacyMove<
  G extends GameSpecificGameState = DefaultGameState,
  CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition,
  PlayerState extends GameSpecificPlayerState = DefaultPlayerState,
  CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter,
  CardInstance extends
    CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>,
>(
  legacyMoveFn: MoveFn<
    G,
    CardDefinition,
    PlayerState,
    CardFilter,
    CardInstance
  >,
): EnumerableMove<G, CardDefinition, PlayerState, CardFilter, CardInstance> {
  return {
    execute: legacyMoveFn,
  };
}

/**
 * Helper function to get the execution function from any move type
 */
export function getExecuteFunction<
  G extends GameSpecificGameState = DefaultGameState,
  CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition,
  PlayerState extends GameSpecificPlayerState = DefaultPlayerState,
  CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter,
  CardInstance extends
    CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>,
>(
  move: Move<G, CardDefinition, PlayerState, CardFilter, CardInstance>,
): MoveFn<G, CardDefinition, PlayerState, CardFilter, CardInstance> {
  if (isEnumerableMove(move)) {
    return move.execute;
  }
  return move;
}

/**
 * Type guard to check if a move is a function-style move (backward compatibility)
 */
export function isMoveFn<
  G extends GameSpecificGameState = DefaultGameState,
  CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition,
  PlayerState extends GameSpecificPlayerState = DefaultPlayerState,
  CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter,
  CardInstance extends
    CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>,
>(
  move:
    | Move<G, CardDefinition, PlayerState, CardFilter, CardInstance>
    | MoveFn<G, CardDefinition, PlayerState, CardFilter, CardInstance>,
): move is MoveFn<G, CardDefinition, PlayerState, CardFilter, CardInstance> {
  return typeof move === "function";
}

/**
 * Helper function to create an EnumerableMove from a MoveFn or an object with configuration
 */
export function createEnumerableMove<
  G extends GameSpecificGameState = DefaultGameState,
  CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition,
  PlayerState extends GameSpecificPlayerState = DefaultPlayerState,
  CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter,
  CardInstance extends
    CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>,
>(
  moveFnOrConfig:
    | MoveFn<G, CardDefinition, PlayerState, CardFilter, CardInstance>
    | {
        execute: MoveFn<
          G,
          CardDefinition,
          PlayerState,
          CardFilter,
          CardInstance
        >;
        getConstraints?: EnumerableMove<
          G,
          CardDefinition,
          PlayerState,
          CardFilter,
          CardInstance
        >["getConstraints"];
        getTargetSpecs?: EnumerableMove<
          G,
          CardDefinition,
          PlayerState,
          CardFilter,
          CardInstance
        >["getTargetSpecs"];
        getPriority?: EnumerableMove<
          G,
          CardDefinition,
          PlayerState,
          CardFilter,
          CardInstance
        >["getPriority"];
      },
): EnumerableMove<G, CardDefinition, PlayerState, CardFilter, CardInstance> {
  if (typeof moveFnOrConfig === "function") {
    return {
      execute: moveFnOrConfig,
    };
  }

  return moveFnOrConfig;
}
