/**
 * Lorcana targeting runtime contract.
 *
 * Canonical TargetDSL ownership lives in @tcg/lorcana-types/targeting.
 */

export type { PlayerTargetDSL } from "@tcg/lorcana-types";
export type {
  LorcanaCardTarget,
  LorcanaCardType,
  LorcanaContext,
  LorcanaFilter,
  LorcanaTargetDSL,
} from "@tcg/lorcana-types/targeting";

export {
  ALL_TARGET_ENUMS,
  CHARACTER_TARGET_ENUMS,
  ITEM_TARGET_ENUMS,
  LOCATION_TARGET_ENUMS,
  expandCharacterTarget,
  expandItemTarget,
  expandLocationTarget,
  expandTarget,
  isCharacterEnum,
  isItemEnum,
  isLocationEnum,
  normalizeLorcanaTarget,
  normalizeLorcanaTargetOrThrow,
  normalizeLorcanaTargets,
} from "@tcg/lorcana-types/targeting";

export * from "./runtime";
export * from "./slotted-targets";
