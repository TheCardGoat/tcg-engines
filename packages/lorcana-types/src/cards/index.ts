/**
 * Lorcana Card Types
 *
 * Card definitions, ink types, and classifications.
 */

// Card Types
export type {
  // Ability definitions
  AbilityDefinition,
  ActionAbilityDefinition,
  ActionCard,
  ActionSubtype,
  ActivatedAbilityDefinition,
  BaseAbilityDefinition,
  // Base card properties
  BaseCardProperties,
  // Card type constants
  CardType,
  CharacterCard,
  ItemCard,
  KeywordAbilityDefinition,
  LocationCard,
  // Discriminated union card types
  LorcanaCard,
  // Unified card definition
  LorcanaCardDefinition,
  ReplacementAbilityDefinition,
  StaticAbilityDefinition,
  TriggeredAbilityDefinition,
} from "./card-types";

export {
  // Constants
  CARD_TYPES,
  // Utilities
  getFullName,
  getInkTypes,
  isActionCard,
  isCardType,
  // Type guards
  isCharacterCard,
  isDualInk,
  isItemCard,
  isLocationCard,
} from "./card-types";
// Classifications
export type { Classification } from "./classifications";
export {
  CLASSIFICATIONS,
  isClassification,
  isDreamborn,
  isFloodborn,
  isStoryborn,
} from "./classifications";
// Ink Types
export type { InkType } from "./ink-types";
export {
  getInkColor,
  INK_COLORS,
  INK_TYPES,
  isValidInkType,
} from "./ink-types";
