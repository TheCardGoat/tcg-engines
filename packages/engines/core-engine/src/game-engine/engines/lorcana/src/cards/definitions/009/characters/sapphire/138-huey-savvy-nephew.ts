import { hueySavvyNephew as hueySavvyNephewAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const hueySavvyNephew: LorcanaCharacterCardDefinition = {
  ...hueySavvyNephewAsOrig,
  id: "ksz",
  reprints: [hueySavvyNephewAsOrig.id],
  number: 138,
  set: "009",
};
