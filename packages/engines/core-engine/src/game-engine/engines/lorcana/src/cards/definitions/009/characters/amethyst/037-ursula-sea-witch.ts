import { ursulaSeaWitch as ogUrsulaSeaWitch } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ursulaSeaWitch: LorcanaCharacterCardDefinition = {
  ...ogUrsulaSeaWitch,
  id: "i2h",
  reprints: [ogUrsulaSeaWitch.id],
  number: 37,
  set: "009",
};
