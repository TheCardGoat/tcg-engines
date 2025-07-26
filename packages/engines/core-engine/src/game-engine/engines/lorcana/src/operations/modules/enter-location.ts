import type { LorcanaCardInstance } from "../../cards/lorcana-card-instance";
import type { LorcanaCoreOperations } from "../lorcana-core-operations";
import { leaveLocation } from "./leave-location";

/**
 * Make a character enter a location (Lorcana-specific mechanic)
 */
export function enterLocation(
  this: LorcanaCoreOperations,
  char: LorcanaCardInstance,
  location: LorcanaCardInstance,
): void {
  const characterInstanceId = char.instanceId;
  const locationInstanceId = location.instanceId;

  // First leave current location if any
  leaveLocation.call(this, char);

  // Track character-location relationship by setting character's location metadata
  const characterMeta = this.getCardMeta(characterInstanceId);
  this.setCardMeta(characterInstanceId, {
    ...characterMeta,
    location: locationInstanceId,
  });

  // Track characters at location by adding to location's characters array
  const locationMeta = this.getCardMeta(locationInstanceId);
  const currentCharactersAtLocation = Array.isArray(locationMeta.characters)
    ? locationMeta.characters
    : [];

  if (!currentCharactersAtLocation.includes(characterInstanceId)) {
    currentCharactersAtLocation.push(characterInstanceId);
  }

  this.setCardMeta(locationInstanceId, {
    ...locationMeta,
    characters: currentCharactersAtLocation,
  });

  // Rule 4.3.7.5: Add any effects that would happen as a result of the character moving to the bag
  this.addTriggeredEffectsToTheBag("onMove", characterInstanceId);
}
