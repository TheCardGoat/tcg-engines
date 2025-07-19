import type { CoreOperation } from "~/game-engine/core-engine/engine/core-operation";
import type { FnContext } from "~/game-engine/core-engine/game-configuration";
import type { Move } from "~/game-engine/core-engine/move/move-types";

import type { LorcanaCardInstance } from "../cards/lorcana-card-instance";
import type { LorcanaGameState } from "../lorcana-engine-types";
import type {
  LorcanaCardDefinition,
  LorcanaCardFilter,
  LorcanaPlayerState,
} from "../lorcana-generic-types";
import type { LorcanaCoreOperations } from "../operations/lorcana-core-operations";

// Standard Move type
export type LorcanaMove = Move<
  LorcanaGameState,
  LorcanaCardDefinition,
  LorcanaPlayerState,
  LorcanaCardFilter,
  LorcanaCardInstance
>;

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

/**
 * Helper function to safely cast CoreOperation to LorcanaCoreOperations
 * In LorcanaEngine, we set the coreOperationClass to LorcanaCoreOperations,
 * so all CoreOperation instances are actually LorcanaCoreOperations
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
