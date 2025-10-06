import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
import { moveDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
import { atTheStartOfYourTurn } from "~/game-engine/engines/lorcana/src/abilities/atTheAbilities";
import {
  chosenCharacter,
  chosenOpposingCharacter,
} from "~/game-engine/engines/lorcana/src/abilities/targets";

export const mysticalTreeMamaOdiesHome: LorcanaLocationCardDefinition = {
  id: "ghp",
  missingTestCase: true,
  name: "Mystical Tree",
  title: "Mama Odie's Home",
  characteristics: [],
  text: "NOT BAD At the start of your turn, you may move 1 damage counter from chosen character here to chosen opposing character.\n\nHARD-EARNED WISDOM At the start of your turn, if you have a character named Mama Odie here, gain 1 lore.",
  type: "location",
  abilities: [
    atTheStartOfYourTurn({
      name: "Not Bad",
      text: "At the start of your turn, you may move 1 damage counter from chosen character here to chosen opposing character.",
      conditions: [
        {
          type: "chars-at-location",
          comparison: { operator: "gte", value: 1 },
        },
      ],
      effects: [
        moveDamageEffect({
          amount: 1,
          from: chosenCharacter,
          to: chosenOpposingCharacter,
        }),
      ],
    }),
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  moveCost: 1,
  willpower: 7,
  illustrator: "Roberto Gatto",
  number: 69,
  set: "006",
  rarity: "rare",
};
