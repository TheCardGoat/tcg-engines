import { donaldDuckSleepwalker as donaldDuckSleepwalkerAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/078-donald-duck-sleepwalker";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const donaldDuckSleepwalker: LorcanaCharacterCardDefinition = {
  ...donaldDuckSleepwalkerAsOrig,
  id: "w9x",
  reprints: [donaldDuckSleepwalkerAsOrig.id],
  number: 83,
  set: "009",
};
