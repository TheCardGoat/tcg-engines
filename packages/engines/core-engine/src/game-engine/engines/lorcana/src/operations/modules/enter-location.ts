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
  if (!this.state.G.metas[characterInstanceId]) {
    this.state.G.metas[characterInstanceId] = {};
  }
  this.state.G.metas[characterInstanceId].location = locationInstanceId;

  // Track characters at location by adding to location's characters array
  if (!this.state.G.metas[locationInstanceId]) {
    this.state.G.metas[locationInstanceId] = {};
  }
  // Always initialize as array for locations
  if (!Array.isArray(this.state.G.metas[locationInstanceId].characters)) {
    this.state.G.metas[locationInstanceId].characters = [];
  }
  const currentCharactersAtLocation =
    this.state.G.metas[locationInstanceId].characters;
  if (!currentCharactersAtLocation.includes(characterInstanceId)) {
    currentCharactersAtLocation.push(characterInstanceId);
  }

  // Add triggered effects to the bag (rule 4.3.7.5)
  this.addTriggeredEffectsToTheBag("onMove", characterInstanceId);
}
