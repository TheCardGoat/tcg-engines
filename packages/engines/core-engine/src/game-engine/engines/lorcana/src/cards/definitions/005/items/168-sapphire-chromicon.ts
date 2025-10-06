import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { chosenItemOfYours } from "@lorcanito/lorcana-engine/abilities/target";
import {
  entersPlayExerted,
  youGainLore,
} from "@lorcanito/lorcana-engine/effects/effects";

export const sapphireChromicon: LorcanaItemCardDefinition = {
  id: "f9o",
  missingTestCase: true,
  name: "Sapphire Chromicon",
  characteristics: ["item"],
  text: "**POWERING UP** This item enters play exerted.<br>**SAPPHIRE LIGHT** {E}, 2 {I}, Banish one of your items – Gain 2 lore.",
  type: "item",
  abilities: [
    entersPlayExerted({
      name: "Powering UP",
    }),
    {
      type: "activated",
      name: "Sapphire Light",
      text: "{E}, 2 {I}, Banish one of your items – Gain 2 lore.",
      costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
      effects: [
        {
          type: "banish",
          target: chosenItemOfYours,
        },
        youGainLore(2),
      ],
    },
  ],
  flavour: "Knowledge is eternal.\n–Inscription",
  colors: ["sapphire"],
  cost: 4,
  illustrator: "Dustin Panzino",
  number: 168,
  set: "SSK",
  rarity: "uncommon",
};
