import { belleInventive as belleInventiveEngineerAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const belleInventiveEngineer: LorcanaCharacterCardDefinition = {
  ...belleInventiveEngineerAsOrig,
  id: "siv",
  reprints: [belleInventiveEngineerAsOrig.id],
  number: 156,
  set: "009",
};
