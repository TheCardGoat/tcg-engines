import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
import { agrabahMarketplace as agrabahMarketplaceAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations/134-agrabah-marketplace";

export const agrabahMarketplace: LorcanaLocationCardDefinition = {
  ...agrabahMarketplaceAsOrig,
  id: "j5m",
  reprints: [agrabahMarketplaceAsOrig.id],
  number: 136,
  set: "009",
};
