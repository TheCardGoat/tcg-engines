import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/target";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const simbaAdventurousSuccessor: LorcanaCharacterCardDefinition = {
  id: "y3p",
  missingTestCase: true,
  name: "Simba",
  title: "Adventurous Successor",
  characteristics: ["hero", "storyborn", "prince"],
  text: "**I LAUGH IN THE FACE OF DANGER** When you play this character, chosen character gets +2 {S} this turn.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "I LAUGH IN THE FACE OF DANGER",
      text: "When you play this character, chosen character gets +2 {S} this turn.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 2,
          modifier: "add",
          target: chosenCharacter,
        },
      ],
    },
  ],
  colors: ["ruby"],
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  illustrator: "Valentin Palombo",
  number: 125,
  set: "SSK",
  rarity: "common",
};
