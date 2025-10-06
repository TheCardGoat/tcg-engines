import { hansNobleScoundrel as hansNobleScoundrelAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/146-hans-noble-scoundrel";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const hansNobleScoundrel: LorcanaCharacterCardDefinition = {
  ...hansNobleScoundrelAsOrig,
  id: "e93",
  reprints: [hansNobleScoundrelAsOrig.id],
  number: 148,
  set: "009",
};
