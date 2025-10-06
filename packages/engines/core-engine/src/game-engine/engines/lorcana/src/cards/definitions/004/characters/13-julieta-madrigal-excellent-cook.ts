import {
  chosenCharacter,
  self,
} from "@lorcanito/lorcana-engine/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const julietaMadrigalExcellentCook: LorcanaCharacterCardDefinition = {
  id: "ig1",
  reprints: ["gxo"],
  missingTestCase: true,
  name: "Julieta Madrigal",
  title: "Excellent Cook",
  characteristics: ["storyborn", "mentor", "madrigal"],
  text: "**SIGNATURE RECIPE** When you play this character, you may remove up to 2 damage from chosen character. If you removed damage this way, you may draw a card.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "SIGNATURE RECIPE",
      text: "When you play this character, you may remove up to 2 damage from chosen character. If you removed damage this way, you may draw a card.",
      optional: true,
      effects: [
        {
          type: "heal",
          amount: 2,
          subEffect: {
            type: "draw",
            amount: 1,
            target: self,
          },
          target: chosenCharacter,
        },
      ],
    },
  ],
  flavour: '"Eat this, mi amor."',
  inkwell: true,
  colors: ["amber"],
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
  illustrator: "Cristian Romero",
  number: 13,
  set: "URR",
  rarity: "uncommon",
};
