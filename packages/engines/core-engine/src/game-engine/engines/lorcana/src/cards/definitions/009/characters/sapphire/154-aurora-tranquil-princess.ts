import { auroraTranquilPrincess as auroraTranquilPrincessAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/141-aurora-tranquil-princess";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const auroraTranquilPrincess: LorcanitoCharacterCardDefinition = {
  ...auroraTranquilPrincessAsOrig,
  id: "u0u",
  reprints: [auroraTranquilPrincessAsOrig.id],
  number: 154,
  set: "009",
};
