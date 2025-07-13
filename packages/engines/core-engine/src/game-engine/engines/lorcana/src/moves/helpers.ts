import { createEnumerableMove } from "../../../../core-engine/move/helpers";
import type { EnumerableMove } from "../../../../core-engine/move/move-types";
import type { LorcanaCardInstance } from "../cards/lorcana-card-instance";
import type { LorcanaEngine } from "../lorcana-engine";
import type { LorcanaGameState } from "../lorcana-engine-types";
import type {
  LorcanaCardDefinition,
  LorcanaCardFilter,
  LorcanaPlayerState,
} from "../lorcana-generic-types";

/**
 * Standard game operations interface for Lorcana moves
 */
export interface LorcanaGameOps {
  getCardById: (cardId: string) => any;
  getCardsInZone: (zone: string, playerId: string) => any[];
  moveCard: (params: {
    playerId: string;
    instanceId: string;
    from: string;
    to: string;
    destination: string;
  }) => void;
}

/**
 * Helper function to create Lorcana moves with proper type definitions.
 *
 * This simplifies the creation of enumerable moves by providing all the Lorcana-specific types.
 *
 * Usage:
 * 1. For object-style enumerable moves that need the full move interface (with getConstraints,
 *    getTargetSpecs, getPriority, etc.), use this helper:
 *    ```
 *    export const myMove = createLorcanaMove({
 *      execute: (context, ...args) => { ... },
 *      getConstraints: (context) => [ ... ],
 *      getTargetSpecs: (context) => [ ... ],
 *      // etc.
 *    });
 *    ```
 *
 * 2. For simple function-style moves, use the LorcanaMove type directly:
 *    ```
 *    export const mySimpleMove: LorcanaMove = (context, ...args) => { ... };
 *    ```
 *
 * @param moveDefinition The move definition object with execute, getConstraints, etc.
 * @returns A properly typed EnumerableMove for Lorcana
 */
export function createLorcanaMove<GE = LorcanaGameOps>(
  moveDefinition: EnumerableMove<
    LorcanaGameState,
    LorcanaCardDefinition,
    LorcanaPlayerState,
    LorcanaCardFilter,
    LorcanaCardInstance,
    GE
  >,
): EnumerableMove<
  LorcanaGameState,
  LorcanaCardDefinition,
  LorcanaPlayerState,
  LorcanaCardFilter,
  LorcanaCardInstance,
  GE
> {
  return createEnumerableMove<
    LorcanaGameState,
    LorcanaCardDefinition,
    LorcanaPlayerState,
    LorcanaCardFilter,
    LorcanaCardInstance,
    GE
  >(moveDefinition);
}
