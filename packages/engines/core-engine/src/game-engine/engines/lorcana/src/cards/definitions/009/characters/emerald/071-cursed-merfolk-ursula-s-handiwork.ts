import { cursedMerfolkUrsulasHandiwork as cursedMerfolkUrsulasHandiworkAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const cursedMerfolkUrsulasHandiwork: LorcanaCharacterCardDefinition = {
  ...cursedMerfolkUrsulasHandiworkAsOrig,
  id: "uww",
  reprints: [cursedMerfolkUrsulasHandiworkAsOrig.id],
  number: 71,
  set: "009",
};
