import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const vitalisphere: LorcanaItemCardDefinition = {
  id: "x1o",
  name: "Vitalisphere",
  characteristics: ["item"],
  text: "**EXTRACT OF RUBY** 1 {I}, Banish this item - Chosen character gains **Rush** and gets +2 {S} this turn. _(They can challenge the turn they're played.)_",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Extract of Ruby",
      text: "1 {I}, Banish this item - Chosen character gains **Rush** and gets +2 {S} this turn. _(They can challenge the turn they're played.)_",
      costs: [{ type: "ink", amount: 1 }, { type: "banish" }],
      effects: [
        {
          type: "ability",
          ability: "rush",
          modifier: "add",
          duration: "turn",
          target: {
            type: "card",
            value: 1,
            filters: [
              {
                filter: "owner",
                value: "self",
              },
              {
                filter: "type",
                value: "character",
              },
              { filter: "zone", value: "play" },
            ],
          },
        } as AbilityEffect,
        {
          type: "attribute",
          modifier: "add",
          attribute: "strength",
          amount: 2,
          target: {
            type: "card",
            value: 1,
            filters: [
              {
                filter: "owner",
                value: "self",
              },
              {
                filter: "type",
                value: "character",
              },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  illustrator: "Sandara Tang",
  number: 134,
  set: "URR",
  rarity: "common",
};
