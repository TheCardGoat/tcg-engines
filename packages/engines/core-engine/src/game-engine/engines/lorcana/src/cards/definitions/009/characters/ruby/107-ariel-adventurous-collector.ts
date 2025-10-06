import { arielAdventurousCollector as arielAdventurousCollectorAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const arielAdventurousCollector: LorcanaCharacterCardDefinition = {
  ...arielAdventurousCollectorAsOrig,
  id: "uny",
  reprints: [arielAdventurousCollectorAsOrig.id],
  number: 107,
  set: "009",
};
