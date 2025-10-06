import { simbaScrappyCub as ogSimbaScrappyCub } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const simbaScrappyCub: LorcanaCharacterCardDefinition = {
  ...ogSimbaScrappyCub,
  id: "bt1",
  reprints: [ogSimbaScrappyCub.id],
  number: 105,
  set: "009",
};
