import {
  duringYourTurnThisCharacterGains,
  evasiveAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ticktockRelentlessCrocodile: LorcanaCharacterCardDefinition = {
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
