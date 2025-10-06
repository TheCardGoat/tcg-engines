import { mulanInjuredSoldier as mulanInjuredSoldierAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/116-mulan-injured-soldier";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mulanInjuredSoldier: LorcanaCharacterCardDefinition = {
  ...mulanInjuredSoldierAsOrig,
  id: "jmn",
  reprints: [mulanInjuredSoldierAsOrig.id],
  number: 125,
  set: "009",
};
