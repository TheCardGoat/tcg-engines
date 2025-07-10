import {
  duringYourTurnThisCharacterGains,
  evasiveAbility,
} from "@lorcanito/lorcana-engine/abilities/abilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const ticktockRelentlessCrocodile: LorcanitoCharacterCard = {
  id: "ipe",
  name: "Tick-tock",
  title: "Relentless Crocodile",
  characteristics: ["storyborn"],
  text: "LOOKING FOR LUNCH During your turn, this character gains Evasive while a Pirate character is in play.",
  type: "character",
  inkwell: true,
  colors: ["steel"],
  cost: 5,
  strength: 5,
  willpower: 6,
  illustrator: "Rachel Elise",
  number: 191,
  set: "007",
  rarity: "common",
  lore: 1,
  abilities: [
    duringYourTurnThisCharacterGains({
      name: "Looking for Lunch",
      text: "During your turn, this character gains Evasive while a Pirate character is in play.",
      ability: evasiveAbility,
      conditions: [
        {
          type: "filter",
          comparison: { operator: "gte", value: 1 },
          filters: [
            {
              filter: "characteristics",
              value: ["pirate"],
            },
          ],
        },
      ],
    }),
  ],
};
