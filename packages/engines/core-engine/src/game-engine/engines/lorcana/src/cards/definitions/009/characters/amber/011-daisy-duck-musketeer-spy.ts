import { daisyDuckMusketeerSpy as ogDaisyDuckMusketeerSpy } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/7-daisy-duck-musketeer-spy";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const daisyDuckMusketeerSpy: LorcanaCharacterCardDefinition = {
  ...ogDaisyDuckMusketeerSpy,
  id: "ex3",
  reprints: [ogDaisyDuckMusketeerSpy.id],
  number: 11,
  set: "009",
};
