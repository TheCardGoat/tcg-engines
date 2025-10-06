import { viranaFangChief as ogViranaFangChief } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/095-virana-fang-chief";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const viranaFangChief: LorcanitoCharacterCardDefinition = {
  ...ogViranaFangChief,
  id: "q5j",
  reprints: ["ryo"],
  number: 82,
  set: "009",
};
