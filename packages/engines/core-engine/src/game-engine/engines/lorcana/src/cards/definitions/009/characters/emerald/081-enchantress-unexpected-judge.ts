import { enchantressUnexpectedJudge as enchantressUnexpectedJudgeAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/080-enchantress-unexpected-judge";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const enchantressUnexpectedJudge: LorcanaCharacterCardDefinition = {
  ...enchantressUnexpectedJudgeAsOrig,
  id: "b7r",
  reprints: [enchantressUnexpectedJudgeAsOrig.id],
  number: 81,
  set: "009",
};
