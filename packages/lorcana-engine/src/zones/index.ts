/**
 * Zones Module
 *
 * Zone configuration and card state management for Lorcana.
 */

// Card state
export {
  addDamage,
  type CardInstanceState,
  type CardReadyState,
  clearDrying,
  createCardInstanceState,
  createStack,
  exertCard,
  getDamage,
  getStackCardIds,
  isDamaged,
  isDry,
  isDrying,
  isExerted,
  isInStack,
  isReady,
  isTopOfStack,
  isUnderCard,
  readyCard,
  removeDamage,
  type StackPosition,
  setAtLocation,
  setDamage,
  setDrying,
} from "./card-state";
// Zone configuration
export {
  areCardsVisibleIn,
  getZoneConfig,
  isLorcanaZoneId,
  isZoneVisibleTo,
  LORCANA_ZONES,
  type LorcanaZoneId,
  ZONE_IDS,
  type ZoneConfig,
  type ZoneVisibility,
} from "./zone-config";
