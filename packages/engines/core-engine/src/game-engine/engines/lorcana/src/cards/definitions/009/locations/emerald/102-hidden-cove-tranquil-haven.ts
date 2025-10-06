import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
import { hiddenCoveTranquilHaven as ogHiddenCoveTranquilHaven } from "~/game-engine/engines/lorcana/src/cards/definitions/004/locations/101-hidden-cove-tranquil-haven";

export const hiddenCoveTranquilHaven: LorcanaLocationCardDefinition = {
  ...ogHiddenCoveTranquilHaven,
  id: "sxr",
  reprints: [ogHiddenCoveTranquilHaven.id],
  number: 102,
  set: "009",
};
