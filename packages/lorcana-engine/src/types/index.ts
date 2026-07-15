/**
 * Lorcana Type Definitions
 *
 * Public exports for all Lorcana-specific types
 */

// Card types and classifications - re-export from lorcana-types
// Game state types - re-export from lorcana-types
export type {
  AbilityDefinition,
  ActionAbilityDefinition,
  ActionCard,
  ActionSubtype,
  ActivatedAbilityDefinition,
  BaseAbilityDefinition,
  BaseCardProperties,
  CardType,
  ChallengeState,
  CharacterCard,
  CharacterState,
  Classification,
  DeckStats,
  DeckValidationError,
  DeckValidationResult,
  InkType,
  ItemCard,
  KeywordAbilityDefinition,
  LocationCard,
  LorcanaCard,
  LorcanaCardDefinition,
  LorcanaPhase,
  LorcanaState,
  PermanentState,
  ReplacementAbilityDefinition,
  StaticAbilityDefinition,
  TooFewCardsError,
  TooManyCopiesError,
  TooManyInkTypesError,
  TriggeredAbilityDefinition,
  TurnMetadata,
} from "@tcg/lorcana-types";

export {
  CARD_TYPES,
  CLASSIFICATIONS,
  getFullName,
  getInkColor,
  getInkTypes,
  INK_COLORS,
  INK_TYPES,
  isActionCard,
  isCardType,
  isCharacterCard,
  isClassification,
  isDreamborn,
  isDualInk,
  isFloodborn,
  isItemCard,
  isLocationCard,
  isStoryborn,
  isValidInkType,
  MAX_COPIES_PER_CARD,
  MAX_INK_TYPES,
  MIN_DECK_SIZE,
} from "@tcg/lorcana-types";
// Branded types (primary source for type-safe IDs)
export * from "./branded-types";
// Game state - exclude PlayerId/CardId/ZoneId (use branded-types)
export type {
  ActiveEffect,
  BagEntry,
  CardReadyState,
  LorcanaCardMeta,
  LorcanaExternalState,
  LorcanaGameState,
  StackPosition,
} from "./game-state";
export { createDefaultCardMeta, createInitialLorcanaState } from "./game-state";

// Move params - exclude LorcanaGameState to avoid conflict with game-state.ts
export type { LorcanaMoveParams, PlayCardCost } from "./move-params";
