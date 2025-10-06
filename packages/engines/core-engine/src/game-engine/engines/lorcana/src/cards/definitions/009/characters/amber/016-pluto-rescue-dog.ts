import { plutoRescueDog as ogPlutoRescueDog } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/20-pluto-rescue-dog";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const plutoRescueDog: LorcanaCharacterCardDefinition = {
  ...ogPlutoRescueDog,
  id: "baa",
  reprints: [ogPlutoRescueDog.id],
  number: 16,
  set: "009",
};
