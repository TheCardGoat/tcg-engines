import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const merryweatherGoodFairy: LorcanaCharacterCardDefinition = {
  id: "xjs",
  name: "Merryweather",
  title: "Good Fairy",
  characteristics: ["storyborn", "ally", "fairy"],
  text: "**RAY OF HOPE** When you play this character, you may pay 1 {I} to give chosen character +2 {S} this turn.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "RAY OF HOPE",
      text: "When you play this character, you may pay 1 {I} to give chosen character +2 {S} this turn.",
      costs: [{ type: "ink", amount: 1 }],
      optional: true,
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 2,
          modifier: "add",
          duration: "turn",
          target: chosenCharacter,
        },
      ],
    },
  ],
  flavour: "The most beautiful color is blue!",
  inkwell: true,
  colors: ["emerald"],
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  illustrator: "Eri Weli",
  number: 76,
  set: "SSK",
  rarity: "common",
};
