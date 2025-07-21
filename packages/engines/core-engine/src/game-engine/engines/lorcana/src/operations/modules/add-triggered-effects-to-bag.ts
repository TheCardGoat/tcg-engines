import type { LorcanaCoreOperations } from "../lorcana-core-operations";

/**
 * Add triggered effects to the bag for processing
 * This is a Lorcana-specific mechanism for handling card triggers
 */
export function addTriggeredEffectsToTheBag(
  this: LorcanaCoreOperations,
  timing: string,
  cardInstanceId: string,
): void {
  const card = this.getCardInstance(cardInstanceId);
  if (!card) return;

  const locationId = this.state.G.metas[cardInstanceId]?.location;

  // Ensure triggerEvents is initialized
  if (!this.state.G.triggerEvents) {
    this.state.G.triggerEvents = [];
  }

  // Handle move-related triggers
  if (timing === "onMove" && locationId) {
    const location = this.getCardInstance(locationId);

    if (location) {
      // For the location
      this.state.G.triggerEvents.push({
        type: "locationTrigger",
        timing,
        locationId,
        characterId: cardInstanceId,
        timestamp: Date.now(),
      });

      // For the character
      this.state.G.triggerEvents.push({
        type: "characterTrigger",
        timing,
        locationId,
        characterId: cardInstanceId,
        timestamp: Date.now(),
      });
    }
  } else if (timing === "onPutIntoInkwell") {
    // Handle inkwell-related triggers
    this.state.G.triggerEvents.push({
      type: "inkwellTrigger",
      timing,
      characterId: cardInstanceId,
      timestamp: Date.now(),
    });
  }
}
