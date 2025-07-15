import type { Move } from "~/game-engine/core-engine/move/move-types";

import type { LorcanaCardInstance } from "../cards/lorcana-card-instance";
import type { LorcanaEngine } from "../lorcana-engine";
import type { LorcanaGameState } from "../lorcana-engine-types";
import type {
  LorcanaCardDefinition,
  LorcanaCardFilter,
  LorcanaPlayerState,
} from "../lorcana-generic-types";

// Standard Move type for Lorcana
export type LorcanaMove = Move<
  LorcanaGameState,
  LorcanaCardDefinition,
  LorcanaPlayerState,
  LorcanaCardFilter,
  LorcanaCardInstance,
  LorcanaEngine
>;

export type ValidMoves = keyof typeof import("./moves").lorcanaMoves;
