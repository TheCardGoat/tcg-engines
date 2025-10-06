import { theQueenRegalMonarch as ogTheQueenRegalMonarch } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/027-the-queen-regal-monarch";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theQueenRegalMonarch: LorcanitoCharacterCardDefinition = {
  ...ogTheQueenRegalMonarch,
  id: "ifu",
  reprints: [ogTheQueenRegalMonarch.id],
  number: 7,
  set: "009",
};
