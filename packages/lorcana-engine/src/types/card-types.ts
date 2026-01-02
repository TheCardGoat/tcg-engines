/**
 * Card Types (Section 6)
 *
 * Re-exports card types from @tcg/lorcana-types for backwards compatibility.
 * This file maintains the existing API while delegating to the new types package.
 */

// Re-export all card types from @tcg/lorcana-types
export type {
  AbilityDefinition,
  ActionAbilityDefinition,
  ActionCard,
  ActionSubtype,
  ActivatedAbilityDefinition,
  BaseAbilityDefinition,
  BaseCardProperties,
  CardType,
  CharacterCard,
  ItemCard,
  KeywordAbilityDefinition,
  LocationCard,
  LorcanaCard,
  LorcanaCardDefinition,
  ReplacementAbilityDefinition,
  StaticAbilityDefinition,
  TriggeredAbilityDefinition,
} from "@tcg/lorcana-types";

export {
  CARD_TYPES,
  getFullName,
  getInkTypes,
  isActionCard,
  isCardType,
  isCharacterCard,
  isDualInk,
  isItemCard,
  isLocationCard,
} from "@tcg/lorcana-types";
