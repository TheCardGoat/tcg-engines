import { tinkerBellTinyTactician as tinkerBellTinyTacticianAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tinkerBellTinyTactician: LorcanaCharacterCardDefinition = {
  ...tinkerBellTinyTacticianAsOrig,
  id: "ahg",
  reprints: [tinkerBellTinyTacticianAsOrig.id],
  number: 189,
  set: "009",
};
