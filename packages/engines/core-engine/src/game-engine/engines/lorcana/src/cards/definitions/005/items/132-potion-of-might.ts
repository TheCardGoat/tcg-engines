import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const targetConditional = {
  type: "target-conditional",
  target: {
    type: "card",
    value: 1,
    filters: [
      { filter: "type", value: "character" },
      { filter: "zone", value: "play" },
      { filter: "characteristics", value: ["villain"] },
    ],
  },
  effects: [
    {
      type: "attribute",
      attribute: "strength",
      amount: 4,
      modifier: "add",
      duration: "turn",
      target: {
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
          { filter: "characteristics", value: ["villain"] },
        ],
      },
    },
  ],
  fallback: [
    {
      type: "attribute",
      attribute: "strength",
      amount: 3,
      modifier: "add",
      duration: "turn",
      target: {
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
        ],
      },
    },
  ],
};

export const potionOfMight: LorcanaItemCardDefinition = {
  id: "a59",
  missingTestCase: true,
  name: "Potion of Might",
  characteristics: ["item"],
  text: "**VILE CONCOCTION** 1 {I} Banish this item – Chosen character gets +3 {S} this turn. If a Villain character is chosen, they get +4 {S} instead.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "VILE CONCOCTION",
      text: "1 {I} Banish this item – Chosen character gets +3 {S} this turn. If a Villain character is chosen, they get +4 {S} instead.",
      costs: [{ type: "ink", amount: 1 }, { type: "banish" }],
      effects: [targetConditional],
    },
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  illustrator: "Kendall Hale",
  number: 132,
  set: "SSK",
  rarity: "common",
};
