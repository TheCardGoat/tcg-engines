import {
  healEffect,
  youGainLore,
} from "@lorcanito/lorcana-engine/effects/effects";

import {
  chosenCharacterOfYours,
  chosenLocation,
} from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const miracleCandle: LorcanaItemCardDefinition = {
  id: "ohm",
  missingTestCase: true,
  name: "Miracle Candle",
  characteristics: ["item"],
  text: "**ABUELA'S GIFT** Banish this item − If you have 3 or more characters in play, gain 2 lore and remove up to 2 damage from chosen location.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Abuela's Gift",
      costs: [{ type: "banish" }],
      conditions: [
        {
          type: "filter",
          comparison: { operator: "gte", value: 3 },
          filters: chosenCharacterOfYours.filters,
        },
      ],
      text: "Banish this item − If you have 3 or more characters in play, gain 2 lore and remove up to 2 damage from chosen location.",
      effects: [youGainLore(2), healEffect(2, chosenLocation)],
    },
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  illustrator: "Kuya Jaypi",
  number: 31,
  set: "URR",
  rarity: "rare",
};
