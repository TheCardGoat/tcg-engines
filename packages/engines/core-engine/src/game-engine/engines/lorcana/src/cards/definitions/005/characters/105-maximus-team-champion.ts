import { atTheEndOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
import { chosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const maximusTeamChampion: LorcanaCharacterCardDefinition = {
  id: "cw2",
  name: "Maximus",
  title: "Team Champion",
  characteristics: ["storyborn", "ally"],
  text: "**A REWARD WORTHY OF A KING** At the end of your turn, if you have a character in play with 5 {S} or more, gain 2 lore. If that character has 10 {S} or more, gain 5 lore instead.",
  type: "character",
  abilities: [
    atTheEndOfYourTurn({
      name: "A Reward Worthy of a King",
      text: "At the end of your turn, if you have a character in play with 5 {S} or more, gain 2 lore. If that character has 10 {S} or more, gain 5 lore instead.",
      conditions: [
        {
          type: "filter",
          comparison: { operator: "gte", value: 1 },
          filters: [
            ...chosenCharacterOfYours.filters,
            {
              filter: "attribute",
              value: "strength",
              comparison: { operator: "gte", value: 5 },
            },
          ],
        },
      ],
      effects: [youGainLore(2)],
    }),
    atTheEndOfYourTurn({
      name: "A Reward Worthy of a King",
      text: "At the end of your turn, if you have a character in play with 5 {S} or more, gain 2 lore. If that character has 10 {S} or more, gain 5 lore instead.",
      conditions: [
        {
          type: "filter",
          comparison: { operator: "gte", value: 1 },
          filters: [
            ...chosenCharacterOfYours.filters,
            {
              filter: "attribute",
              value: "strength",
              comparison: { operator: "gte", value: 10 },
            },
          ],
        },
      ],
      effects: [youGainLore(3)],
    }),
  ],
  flavour: "It's easy to get carried away when it comes to tug of war.",
  inkwell: true,
  colors: ["ruby"],
  cost: 6,
  strength: 3,
  willpower: 5,
  lore: 2,
  illustrator: "Federico Maria Cugiari",
  number: 105,
  set: "SSK",
  rarity: "super_rare",
};
