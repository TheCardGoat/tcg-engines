import {
  revealTopOfDeckPutInHandOrDeck,
  youGainLore,
} from "@lorcanito/lorcana-engine/effects/effects";

import { atTheStartOfYourTurn } from "~/game-engine/engines/lorcana/src/abilities/atTheAbilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const queensSensorCoreItem: LorcanaItemCardDefinition = {
  id: "rj3",
  name: "Queen's Sensor Core",
  characteristics: ["item"],
  text: "**SYMBOL OF NOBILITY** At the start of your turn, if you have a Princess or Queen character in play, gain 1 lore.\n**ROYAL SEARCH** {E}, 2 {I} – Reveal the top card of your deck. If it’s a Princess or Queen character card, you may put it into your hand. Otherwise, put it on the top of your deck.",
  type: "item",
  abilities: [
    atTheStartOfYourTurn({
      name: "SYMBOL OF NOBILITY",
      text: "At the start of your turn, if you have a Princess or Queen character in play, gain 1 lore.",
      resolutionConditions: [
        {
          type: "filter",
          comparison: { operator: "gte", value: 1 },
          filters: [
            { filter: "type", value: "character" },
            { filter: "zone", value: "play" },
            { filter: "owner", value: "self" },
            {
              filter: "characteristics",
              conjunction: "or",
              value: ["princess", "queen"],
            },
          ],
        },
      ],
      effects: [youGainLore(1)],
    }),
    {
      type: "activated",
      costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
      name: "Royal Search",
      text: "{E}, 2 {I} – Reveal the top card of your deck. If it’s a Princess or Queen character card, you may put it into your hand. Otherwise, put it on the top of your deck.",
      effects: revealTopOfDeckPutInHandOrDeck({
        mode: "top",
        tutorFilters: [
          { filter: "type", value: "character" },
          { filter: "owner", value: "self" },
          {
            filter: "characteristics",
            conjunction: "or",
            value: ["princess", "queen"],
          },
        ],
      }),
    },
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  lore: 1,
  illustrator: "Juan Diego Leon",
  number: 31,
  set: "SSK",
  rarity: "rare",
};
