import { lefouInstigator as ogLefouInstigator } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/112-lefou-instigator";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const lefouInstigator: LorcanitoCharacterCardDefinition = {
  ...ogLefouInstigator,
  id: "bmd",
  reprints: [ogLefouInstigator.id],
  number: 103,
  set: "009",
};
