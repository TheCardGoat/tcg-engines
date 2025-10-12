/**
 * Lorcana Game Definition
 *
 * Public exports for game definition components
 */

// Main game definition
export { lorcanaGameDefinition } from "./definition";
export { lorcanaFlow } from "./flow/turn-flow";
export { lorcanaMoves } from "./moves";
export { setupLorcanaGame } from "./setup/game-setup";
export { trackerConfig } from "./trackers/tracker-config";
export { checkLoreVictory } from "./win-conditions/lore-victory";
// Legacy exports (for backward compatibility)
export * from "./zone-operations";
export type {
  LorcanaZoneConfig,
  LorcanaZoneId,
  LorcanaZoneVisibility,
} from "./zones";
export {
  getZoneConfig,
  isFacedownZone,
  isLorcanaZoneId,
  isOrderedZone,
  isPrivateZone,
  isPublicZone,
  lorcanaZones as legacyLorcanaZones,
} from "./zones";
// Modular components (for testing and advanced use)
export { lorcanaZones } from "./zones/zone-configs";
