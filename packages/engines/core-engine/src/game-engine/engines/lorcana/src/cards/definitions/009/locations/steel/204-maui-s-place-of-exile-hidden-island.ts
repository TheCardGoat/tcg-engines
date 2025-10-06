import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
import { mauisPlaceOfExileHiddenIsland as ogMauisPlaceOfExileHiddenIsland } from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations/202-mauis-place-of-exile-hidden-island";

export const mauisPlaceOfExileHiddenIsland: LorcanaLocationCardDefinition = {
  ...ogMauisPlaceOfExileHiddenIsland,
  id: "dk0",
  reprints: [ogMauisPlaceOfExileHiddenIsland.id],
  number: 204,
  set: "009",
};
