import { CoreOperation } from "~/game-engine/core-engine/engine/core-operation";
import type { LorcanaCardInstance } from "./cards/lorcana-card-instance";
import type { LorcanaEngine } from "./lorcana-engine";
import type { LorcanaGameState } from "./lorcana-engine-types";
import type {
  LorcanaCardDefinition,
  LorcanaCardFilter,
  LorcanaPlayerState,
} from "./lorcana-generic-types";

export class LorcanaCoreOperation extends CoreOperation<
  LorcanaGameState,
  LorcanaCardDefinition,
  LorcanaPlayerState,
  LorcanaCardFilter,
  LorcanaCardInstance
> {
  // Add Lorcana-specific methods here
  // Example:
  getLorcanaSpecialCards(): LorcanaCardInstance[] {
    // Custom logic for Lorcana
    return this.queryCards({
      /* ...Lorcana-specific filter... */
    } as LorcanaCardFilter);
  }
}
