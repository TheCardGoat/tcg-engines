import { mufasaKingOfProudLands as mufasaKingOfThePrideLandsAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mufasaKingOfThePrideLands: LorcanaCharacterCardDefinition = {
  ...mufasaKingOfThePrideLandsAsOrig,
  id: "adw",
  reprints: [mufasaKingOfThePrideLandsAsOrig.id],
  number: 144,
  set: "009",
};
