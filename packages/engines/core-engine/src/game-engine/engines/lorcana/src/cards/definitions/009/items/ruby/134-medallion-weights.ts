import { medallionWeights as ogMedallionWeights } from "~/game-engine/engines/lorcana/src/cards/definitions/004/items/132-medallion-weights";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const medallionWeights: LorcanaItemCardDefinition = {
  ...ogMedallionWeights,
  id: "c57",
  reprints: [ogMedallionWeights.id],
  number: 134,
  set: "009",
};
