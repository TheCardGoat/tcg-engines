import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { self } from "@lorcanito/lorcana-engine/abilities/targets";

export const basilsMagnifyingGlass: LorcanaItemCardDefinition = {
  id: "q09",
  missingTestCase: true,
  name: "Basil's Magnifying Glass",
  characteristics: [],
  text: "**FIND WHAT’S HIDDEN** {E}, 2 {I} - Look at the top 3 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "FIND WHAT’S HIDDEN",
      text: "{E}, 2 {I} - Look at the top 3 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
      effects: [
        {
          type: "scry",
          amount: 3,
          mode: "bottom",
          shouldRevealTutored: true,
          target: self,
          limits: {
            bottom: 3,
            inkwell: 0,
            top: 0,
            hand: 1,
          },
          tutorFilters: [
            { filter: "owner", value: "self" },
            { filter: "zone", value: "deck" },
            { filter: "type", value: "item" },
          ],
        },
      ],
    },
  ],
  flavour: '"I say, a piece of the Hexwell Crown!" -Basil',
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  illustrator: "McKay Anderson",
  number: 166,
  set: "SSK",
  rarity: "rare",
};
