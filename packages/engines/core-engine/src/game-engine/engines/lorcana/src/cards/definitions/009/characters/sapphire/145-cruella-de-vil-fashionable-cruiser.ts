import { cruellaDeVilFashionableCruiser as cruellaDeVilFashionableCruiserAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/144-cruella-de-vil-fashionable-cruiser";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const cruellaDeVilFashionableCruiser: LorcanaCharacterCardDefinition = {
  ...cruellaDeVilFashionableCruiserAsOrig,
  id: "ej7",
  reprints: [cruellaDeVilFashionableCruiserAsOrig.id],
  number: 145,
  set: "009",
};
