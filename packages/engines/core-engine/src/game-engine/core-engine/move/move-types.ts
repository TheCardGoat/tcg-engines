import type { FnContext } from "~/game-engine/core-engine/game-configuration";
import type { CoreCtx } from "~/game-engine/core-engine/state/context";
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

export type PlayerID = string;

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
    "type" in result &&
    (result as any).type === "INVALID_MOVE"
  );
}

export type MoveFn<
  G extends GameSpecificGameState,
  CardDefinition extends GameSpecificCardDefinition,
  PlayerState extends GameSpecificPlayerState,
  CardFilter extends GameSpecificCardFilter,
  CardInstance extends CoreCardInstance<CardDefinition>,
  GameEngine = unknown,
> = (
  context: FnContext<
    G,
    CardDefinition,
    PlayerState,
    CardFilter,
    CardInstance
  > & {
    playerID: PlayerID;
    gameOps: GameEngine;
  },
  ...args: unknown[]
) => undefined | G | InvalidMoveResult;

// For now we're not using this type, but it's here for future reference
export interface LongFormMove<
  G extends GameSpecificGameState,
  CardDefinition extends GameSpecificCardDefinition,
  PlayerState extends GameSpecificPlayerState,
  CardFilter extends GameSpecificCardFilter,
  CardInstance extends CoreCardInstance<CardDefinition>,
> {
  move: MoveFn<G, CardDefinition, PlayerState, CardFilter, CardInstance>;
  redact?: boolean | ((context: { G: G; ctx: CoreCtx }) => boolean);
  noLimit?: boolean;
  client?: boolean;
  undoable?: boolean | ((context: { G: G; ctx: CoreCtx }) => boolean);
  ignoreStaleStateID?: boolean;
}

export type Move<
  GameState extends GameSpecificGameState = DefaultGameState,
  CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition,
  PlayerState extends GameSpecificPlayerState = DefaultPlayerState,
  CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter,
  CardInstance extends
    CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>,
  GameEngine = unknown,
> = MoveFn<
  GameState,
  CardDefinition,
  PlayerState,
  CardFilter,
  CardInstance,
  GameEngine
>;
