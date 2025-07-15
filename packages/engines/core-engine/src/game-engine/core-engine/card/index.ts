// Export card abstraction patterns

// Export card filtering utilities
export {
  type CardFilterDSL,
  filterCards,
  filterCoreCardInstances,
  filterGameCards,
} from "./card-filtering";
// Export card operations
export {
  type CardOperations,
  getCardZoneUnified,
  moveCardToZone,
  withCoreCardOperation,
  withGameCardOperation,
} from "./card-operations";
export {
  CardRepository,
  createCardRepository,
} from "./card-repository-factory";
export { CoreCardCtxProvider } from "./core-card-ctx-provider";
// Legacy exports for backward compatibility
export { type CoreCardFilterDSL, getCardsByFilter } from "./core-card-filter";
export { CoreCardInstance } from "./core-card-instance";
// Export card stores and repositories
export {
  type CoreCardDefinition,
  CoreCardInstanceStore,
} from "./core-card-instance-store";
export { type CardData, GameCard, type GameContext } from "./game-card";
