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
  const characterMeta = this.getCardMeta(char.instanceId);
  this.setCardMeta(char.instanceId, {
    ...characterMeta,
    location: undefined,
  });

  // Update location metadata to remove character from characters array
  const locationMeta = this.getCardMeta(location.instanceId);
  if (Array.isArray(locationMeta.characters)) {
    const updatedCharacters = locationMeta.characters.filter(
      (cardId) => cardId !== char.instanceId,
    );
    this.setCardMeta(location.instanceId, {
      ...locationMeta,
      characters: updatedCharacters,
    });
  }
}
