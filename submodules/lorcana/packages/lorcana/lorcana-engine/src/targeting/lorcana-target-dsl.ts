/**
 * Backward-compatible re-export of canonical Lorcana TargetDSL types.
 *
 * Canonical ownership is @tcg/lorcana-types/targeting.
 */

export type {
  LorcanaCardTarget,
  LorcanaCardType,
  LorcanaCharacterTarget,
  LorcanaContext,
  LorcanaFilter,
  LorcanaItemTarget,
  LorcanaLocationTarget,
  LorcanaPlayerTarget,
  LorcanaTarget,
  LorcanaTargetDSL,
} from "@tcg/lorcana-types/targeting";

export { isDSLTarget } from "@tcg/lorcana-types/targeting";
