/**
 * Backward-compatible re-export of canonical target normalization helpers.
 *
 * Canonical ownership is @tcg/lorcana-types/targeting.
 */

export {
  ALL_TARGET_ENUMS,
  CHARACTER_TARGET_ENUMS,
  expandCharacterTarget,
  expandItemTarget,
  expandLocationTarget,
  expandTarget,
  isCharacterEnum,
  isItemEnum,
  isLocationEnum,
  ITEM_TARGET_ENUMS,
  LOCATION_TARGET_ENUMS,
  normalizeLorcanaTarget,
  normalizeLorcanaTargetOrThrow,
  normalizeLorcanaTargets,
} from "@tcg/lorcana-types/targeting";
