import type { CoreOperation } from "~/game-engine/core-engine/engine/core-operation";
import type { FnContext } from "~/game-engine/core-engine/game-configuration";
import type {
  EnumerableMove,
  Move,
  MoveFn,
} from "~/game-engine/core-engine/move/move-types";
import type { PlayerID } from "~/game-engine/core-engine/types/core-types";

import type { LorcanaCardInstance } from "../cards/lorcana-card-instance";
import type { LorcanaGameState } from "../lorcana-engine-types";
import type {
  LorcanaCardDefinition,
  LorcanaCardFilter,
  LorcanaPlayerState,
} from "../lorcana-generic-types";
import type { LorcanaCoreOperations } from "../operations/lorcana-core-operations";

// Typed FnContext with LorcanaCoreOperations for moves
export type LorcanaFnContext = Omit<
  FnContext<
    LorcanaGameState,
    LorcanaCardDefinition,
    LorcanaPlayerState,
    LorcanaCardFilter,
    LorcanaCardInstance
  >,
  "coreOps"
> & {
  coreOps: LorcanaCoreOperations;
};

// Lorcana-specific move function type with properly typed context
export type LorcanaMoveFn = (
  context: LorcanaFnContext & { playerID: PlayerID },
  ...args: unknown[]
) =>
  | undefined
  | LorcanaGameState
  | import("~/game-engine/core-engine/move/move-types").InvalidMoveResult;

// Lorcana-specific enumerable move type with properly typed context
export type LorcanaEnumerableMove = Omit<
  EnumerableMove<
    LorcanaGameState,
    LorcanaCardDefinition,
    LorcanaPlayerState,
    LorcanaCardFilter,
    LorcanaCardInstance
  >,
  "execute" | "getConstraints" | "getTargetSpecs" | "getPriority"
> & {
  readonly execute: LorcanaMoveFn;
  readonly getConstraints?: (
    context: LorcanaFnContext & { playerID: PlayerID },
  ) => import("~/game-engine/core-engine/move/move-types").GameMoveConstraint<
    typeof context
  >[];
  readonly getTargetSpecs?: (
    context: LorcanaFnContext & { playerID: PlayerID },
    ...args: unknown[]
  ) => import("~/game-engine/core-engine/move/move-types").TargetSpec<
    typeof context,
    LorcanaCardFilter
  >[];
  readonly getPriority?: (
    context: LorcanaFnContext & { playerID: PlayerID },
  ) => number;
};

// Properly typed LorcanaMove that uses LorcanaFnContext
export type LorcanaMove = LorcanaMoveFn | LorcanaEnumerableMove;

/**
 * Helper function to safely cast CoreOperation to LorcanaCoreOperations
 * In LorcanaEngine, we set the coreOperationClass to LorcanaCoreOperations,
 * so all CoreOperation instances are actually LorcanaCoreOperations
 * @deprecated Use the properly typed LorcanaMove instead which provides correctly typed coreOps
 */
export function toLorcanaCoreOps(
  coreOps: CoreOperation<
    LorcanaGameState,
    LorcanaCardDefinition,
    LorcanaPlayerState,
    LorcanaCardFilter,
    LorcanaCardInstance
  >,
): LorcanaCoreOperations {
  return coreOps as LorcanaCoreOperations;
}
