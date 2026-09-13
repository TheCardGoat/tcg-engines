/**
 * Catalog and deck-construction DTOs for browser and host consumers.
 *
 * This entrypoint deliberately exposes immutable definitions and pregame
 * selection only. It does not expose a match runtime, rules state, or test
 * fixture helpers.
 */
export {
  toFabCardDefinition,
  registerFabCardDefinition,
  normalizeBaseObjectProperties,
  basePropertiesOf,
  baseHasDefense,
  baseHasKeyword,
  baseKeywordNames,
  basePitchValue,
  baseCardCost,
  baseCardPower,
  baseCardDefense,
  DEFAULT_HERO_INTELLECT,
  type FabCardDefinitionInput,
  type FabRegisteredCardDefinition,
  type FabKeywordRef,
} from "./cards.ts";

export {
  createDefaultFabPregameSelection,
  FAB_FORMAT_RULES,
  fabEquipmentSlotForDefinition,
  fabEquipmentSlotsForDefinition,
  isFabEquipmentSelectionLegal,
  proposeFabEquipmentSelection,
  resolveFabEquipmentSelection,
  fabHeroDeckbuildingAccess,
  fabRequiredDeckCount,
  isFabArenaCardDefinition,
  reconcileFabPregameSelection,
  validateFabPregameSelection,
  type FabCardPoolEntry,
  type FabCardPoolSource,
  type FabFormatRules,
  type FabHeroAge,
  type FabHeroDeckbuildingAccess,
  type FabPregameFormat,
  type FabDeckSelectionEntry,
  type FabEquipmentSlot,
  type FabPregameCardPool,
  type FabPregameIssue,
  type FabPregameSelection,
  type FabPregameValidation,
} from "./pregame.ts";
