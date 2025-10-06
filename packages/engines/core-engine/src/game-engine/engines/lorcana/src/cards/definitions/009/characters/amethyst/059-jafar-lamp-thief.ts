import { jafarLampThief as jafarLampThiefAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jafarLampThief: LorcanaCharacterCardDefinition = {
  ...jafarLampThiefAsOrig,
  id: "rv8",
  reprints: [jafarLampThiefAsOrig.id],
  number: 59,
  set: "009",
};
