import { maleficentMonstrousDragon as ogMaleficentMonstrousDragon } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/113-maleficent-monstrous-dragon";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const maleficentMonstrousDragon: LorcanaCharacterCardDefinition = {
  ...ogMaleficentMonstrousDragon,
  id: "c6o",
  reprints: [ogMaleficentMonstrousDragon.id],
  number: 108,
  set: "009",
};
