// TODO: Once the set is released, we organize the cards by set and type

import {
  chosenCharacter,
  chosenDamagedCharacter,
  chosenOpposingCharacter,
} from "@lorcanito/lorcana-engine/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jasmineRoyalSeafarer: LorcanaCharacterCardDefinition = {
  id: "k7b",
  missingTestCase: true,
  name: "Jasmine",
  title: "Royal Seafarer",
  characteristics: ["storyborn", "hero", "princess"],
  text: "BY ORDER OF THE PRINCESS When you play this character, choose one: \n* Exert chosen damaged character. \n* Chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "By Order of the Princess",
      text: "When you play this character, choose one: \n* Exert chosen damaged character. \n* Chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
      effects: [
        {
          type: "modal",
          // TODO: Get rid of target
          target: chosenCharacter,
          modes: [
            {
              id: "1",
              text: "Exert chosen damaged character.",
              effects: [
                {
                  type: "exert",
                  exert: true,
                  target: chosenDamagedCharacter,
                },
              ],
            },
            {
              id: "2",
              text: "Chosen opposing character gains Reckless during their next turn.",
              effects: [
                {
                  type: "ability",
                  ability: "reckless",
                  modifier: "add",
                  duration: "next_turn",
                  target: chosenOpposingCharacter,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Seda Coskun",
  number: 70,
  set: "006",
  rarity: "rare",
};
