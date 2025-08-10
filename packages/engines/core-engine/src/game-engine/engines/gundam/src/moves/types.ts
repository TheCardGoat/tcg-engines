import type { FnContext, PlayerID } from "~/game-engine/core-engine";
import type { EnumerableMove } from "~/game-engine/core-engine/move/move-types";
import type {
  GundamCardFilter,
  GundamPlayerState,
} from "~/game-engine/engines/gundam/src/gundam-generic-types";
import type { GundamCoreOperations } from "~/game-engine/engines/gundam/src/operations/gundam-core-operations";
import type {
  GundamCardDefinition,
  GundamGameState,
  GundamModel,
} from "../gundam-engine-types";

// Typed FnContext with GundamCoreOperations for moves
export type GundamFnContext = Omit<
  FnContext<
    GundamGameState,
    GundamCardDefinition,
    GundamPlayerState,
    GundamCardFilter,
    GundamModel
  >,
  "coreOps"
> & {
  coreOps: GundamCoreOperations;
};

// Gundam-specific move function type with properly typed context
export type GundamMoveFn = (
  context: GundamFnContext & { playerID: PlayerID },
  ...args: unknown[]
) =>
  | undefined
  | GundamGameState
  | import("~/game-engine/core-engine/move/move-types").InvalidMoveResult;

// Gundam-specific enumerable move type with properly typed context
export type GundamEnumerableMove = Omit<
  EnumerableMove<
    GundamGameState,
    GundamCardDefinition,
    GundamPlayerState,
    GundamCardFilter,
    GundamModel
  >,
  "execute" | "getConstraints" | "getTargetSpecs" | "getPriority"
> & {
  readonly execute: GundamMoveFn;
  readonly getConstraints?: (
    context: GundamFnContext & { playerID: PlayerID },
  ) => import("~/game-engine/core-engine/move/move-types").GameMoveConstraint<
    typeof context
  >[];
  readonly getTargetSpecs?: (
    context: GundamFnContext & { playerID: PlayerID },
    ...args: unknown[]
  ) => import("~/game-engine/core-engine/move/move-types").TargetSpec<
    typeof context,
    GundamCardFilter
  >[];
  readonly getPriority?: (
    context: GundamFnContext & { playerID: PlayerID },
  ) => number;
};

export type GundamMove = GundamMoveFn | GundamEnumerableMove;
