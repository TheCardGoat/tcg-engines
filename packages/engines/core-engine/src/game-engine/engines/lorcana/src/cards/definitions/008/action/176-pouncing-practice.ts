import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import {
  chosenCharacter,
  chosenCharacterOfYours,
} from "@lorcanito/lorcana-engine/abilities/target";

export const pouncingPractice: LorcanitoActionCard = {
  id: "bxz",
  name: "Pouncing Practice",
  characteristics: ["action"],
  text: "Chosen character gets -2 {S} this turn. Chosen character of yours gains Evasive this turn.",
  type: "action",
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  illustrator: "Moniek Schilder",
  number: 176,
  set: "008",
  rarity: "uncommon",
  abilities: [
    {
      type: "resolution",
      text: "Chosen character of yours gains Evasive this turn.",
      effects: [
        {
          type: "ability",
          ability: "evasive",
          duration: "turn",
          modifier: "add",
          target: chosenCharacterOfYours,
        },
      ],
    },
    {
      type: "resolution",
      text: "Chosen character gets -2 {S} this turn.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 2,
          modifier: "subtract",
          duration: "turn",
          target: chosenCharacter,
        },
      ],
    },
  ],
};
