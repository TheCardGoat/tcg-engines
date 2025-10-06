import { ursulaVanessa as ogUrsulaVanessa } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/25-ursula-vanessa";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ursulaVanessa: LorcanitoCharacterCardDefinition = {
  ...ogUrsulaVanessa,
  id: "iye",
  reprints: [ogUrsulaVanessa.id],
  number: 22,
  set: "009",
};
