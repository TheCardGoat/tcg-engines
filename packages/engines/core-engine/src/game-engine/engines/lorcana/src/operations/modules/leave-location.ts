import type { LorcanaCardInstance } from "../../cards/lorcana-card-instance";
import type { LorcanaCoreOperations } from "../lorcana-core-operations";

/**
 * Make a character leave its current location (Lorcana-specific mechanic)
 */
export function leaveLocation(
  this: LorcanaCoreOperations,
  char: LorcanaCardInstance,
): void {
  const location = char.location;
  if (!location) {
    return;
  }

  // Update character metadata to remove location reference
  if (this.state.G.metas[char.instanceId]) {
    this.state.G.metas[char.instanceId].location = undefined;
  }

  // Update location metadata to remove character from characters array
  if (this.state.G.metas[location.instanceId]?.characters) {
    this.state.G.metas[location.instanceId].characters = this.state.G.metas[
      location.instanceId
    ].characters.filter((card) => card !== char.instanceId);
  }
}
