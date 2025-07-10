import { atTheEndOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
import { anotherChosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const kenaiProtectiveBrother: LorcanitoCharacterCard = {
  id: "kr8",
  name: "Kenai",
  title: "Protective Brother",
  characteristics: ["storyborn", "hero"],
  text: "HE NEEDS ME At the end of your turn, if this character is exerted, you may ready another chosen character of yours and remove all damage from them.",
  type: "character",
  abilities: [
    atTheEndOfYourTurn({
      name: "HE NEEDS ME",
      text: "At the end of your turn, if this character is exerted, you may ready another chosen character of yours and remove all damage from them.",
      conditions: [{ type: "exerted" }],
      optional: true,
      effects: [
        {
          type: "exert",
          exert: false,
          target: anotherChosenCharacterOfYours,
        },
        {
          type: "heal",
          amount: 99,
          target: {
            type: "card",
            value: "all",
            filters: [{ filter: "source", value: "target" }],
          },
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  strength: 2,
  willpower: 4,
  illustrator: "Julien Yavorskis",
  number: 30,
  set: "007",
  rarity: "rare",
  lore: 1,
};
