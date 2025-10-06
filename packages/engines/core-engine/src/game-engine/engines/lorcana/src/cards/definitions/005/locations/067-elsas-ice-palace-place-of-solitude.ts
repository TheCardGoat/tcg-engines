import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
import { chosenExertedCharacterCantReadyWhileThisIsInPlace } from "~/game-engine/engines/lorcana/src/abilities";

export const elsasIcePalacePlaceOfSolitude: LorcanaLocationCardDefinition = {
  id: "f0m",
  missingTestCase: true,
  name: "Elsa's Ice Palace",
  title: "Place of Solitude",
  characteristics: ["location"],
  text: "**ETERNAL WINTER** When you play this location, choose an exerted character. While this location is in play, that character can't ready at the start of their turn.",
  type: "location",
  colors: ["amethyst"],
  cost: 3,
  willpower: 4,
  lore: 1,
  illustrator: "Wietse Treurniet",
  number: 67,
  set: "SSK",
  rarity: "rare",
  moveCost: 1,
  abilities: [
    {
      ...chosenExertedCharacterCantReadyWhileThisIsInPlace,
      name: "Eternal Winter",
      text: "When you play this location, choose an exerted character. While this location is in play, that character can't ready at the start of their turn.",
    },
  ],
};
