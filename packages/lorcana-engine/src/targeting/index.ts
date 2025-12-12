/**
 * Lorcana Targeting Module
 *
 * Provides Lorcana-specific targeting DSL and utilities.
 *
 * @module targeting
 */

// Re-export core types for convenience
export type {
  BaseContext,
  OwnerScope,
  PlayerTargetDSL,
  SelectorScope,
  TargetCount,
  TargetDSL,
  TargetingUIHint,
} from "@tcg/core";

// Enum expansion utilities
export {
  ALL_TARGET_ENUMS,
  CHARACTER_TARGET_ENUMS,
  expandCharacterTarget,
  expandItemTarget,
  expandLocationTarget,
  expandTarget,
  ITEM_TARGET_ENUMS,
  isCharacterEnum,
  isItemEnum,
  isLocationEnum,
  LOCATION_TARGET_ENUMS,
} from "./enum-expansion";
export {
  type FilterHandler,
  FilterRegistry,
  filterRegistry,
  registerDefaultFilters,
} from "./filter-registry";
// Filter matching logic
export {
  createTargetFiltersPredicate,
  createTargetFiltersPredicateWithDebug,
  type FilterDebugInfo,
  matchesLorcanaFilter,
  sortFilters,
  validateFilters,
} from "./filter-resolver";
// Lorcana Target DSL types
export {
  type AtLocationFilter,
  type CharacterTarget,
  type CharacterTargetEnum,
  type CostFilter,
  type DamagedFilter,
  type DryFilter,
  type ExertedFilter,
  type HasClassificationFilter,
  type HasKeywordFilter,
  type InkableFilter,
  type ItemTarget,
  type ItemTargetEnum,
  isDSLTarget,
  isNumericFilter,
  isStateFilter,
  type LocationTarget,
  type LocationTargetEnum,
  type LorcanaCardTarget,
  type LorcanaCardType,
  type LorcanaCharacterTarget,
  type LorcanaContext,
  type LorcanaFilter,
  type LorcanaItemTarget,
  type LorcanaLocationTarget,
  type LorcanaPlayerTarget,
  type LorcanaTarget,
  type LoreValueFilter,
  type MoveCostFilter,
  type NameFilter,
  type ReadyFilter,
  type StrengthFilter,
  type UndamagedFilter,
  type WillpowerFilter,
} from "./lorcana-target-dsl";

// UI utilities
export {
  generateTargetDescription,
  getTargetUIHints,
  type LorcanaTargetUIHint,
} from "./targeting-ui";
