import { mauiWhale as ogMauiWhale } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mauiWhale: LorcanaCharacterCardDefinition = {
  ...ogMauiWhale,
  id: "daf",
  reprints: [ogMauiWhale.id],
  number: 106,
  set: "009",
};
