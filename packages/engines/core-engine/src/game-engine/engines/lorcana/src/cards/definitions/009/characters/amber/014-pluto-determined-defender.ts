import { plutoDeterminedDefender as ogPlutoDeterminedDefender } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const plutoDeterminedDefender: LorcanitoCharacterCardDefinition = {
  ...ogPlutoDeterminedDefender,
  id: "gnw",
  reprints: [ogPlutoDeterminedDefender.id],
  number: 14,
  set: "009",
};
