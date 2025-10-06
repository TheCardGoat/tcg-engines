import { heiheiBumblingRooster as ogHeiheiBumblingRooster } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/075-heihei-bumbling-rooster";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const heiheiBumblingRooster: LorcanitoCharacterCardDefinition = {
  ...ogHeiheiBumblingRooster,
  id: "yeh",
  reprints: ["rmn"],
  number: 86,
  set: "009",
};
