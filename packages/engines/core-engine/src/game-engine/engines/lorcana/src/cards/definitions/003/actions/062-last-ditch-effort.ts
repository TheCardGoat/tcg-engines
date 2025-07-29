import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import {
  chosenCharacterOfYours,
  chosenOpposingCharacter,
} from "@lorcanito/lorcana-engine/abilities/targets";

export const lastDitchEffort: LorcanitoActionCard = {
  id: "b2t",
  name: "Last-Ditch Effort",
  characteristics: ["action"],
  text: "Exert chosen opposing character. Then chosen character of yours gains **Challenger** +2 this turn. (They get +2 {S} while challenging.)",
  type: "action",
  abilities: [
    {
      type: "resolution",
      resolveEffectsIndividually: true,
      effects: [
        {
          type: "exert",
          exert: true,
          target: chosenOpposingCharacter,
        },
        {
          type: "ability",
          ability: "challenger",
          amount: 2,
          modifier: "add",
          duration: "turn",
          until: true,
          target: chosenCharacterOfYours,
        },
      ],
    },
  ],
  flavour: "I got your back",
  colors: ["amethyst"],
  cost: 3,
  illustrator: "Ian MacDonald",
  number: 62,
  set: "ITI",
  rarity: "uncommon",
};
