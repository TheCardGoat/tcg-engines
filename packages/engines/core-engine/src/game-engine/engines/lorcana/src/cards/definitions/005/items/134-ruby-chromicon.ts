import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";

export const rubyChromicon: LorcanaItemCardDefinition = {
  id: "bzl",
  missingTestCase: true,
  name: "Ruby Chromicon",
  characteristics: ["item"],
  text: "**RUBY LIGHT** {E} − Chosen character gets +1 {S} this turn.",
  type: "item",
  abilities: [
    {
      type: "activated",
      costs: [{ type: "exert" }],
      text: "Ruby Light",
      name: "{E} − Chosen character gets +1 {S} this turn.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 1,
          modifier: "add",
          duration: "turn",
          target: chosenCharacter,
        },
      ],
    },
  ],
  flavour: "Leave fear behind.\n−Inscription",
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  illustrator: "Dustin Panzino",
  number: 134,
  set: "SSK",
  rarity: "uncommon",
};
