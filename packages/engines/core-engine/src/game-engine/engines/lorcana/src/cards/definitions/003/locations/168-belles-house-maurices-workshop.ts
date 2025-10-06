import type { LorcanaLocationCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const bellesHouseMauricesWorkshop: LorcanaLocationCardDefinition = {
  id: "rnn",
  type: "location",
  name: "Belle's House",
  title: "Maurice's Workshop",
  characteristics: ["location"],
  text: "**LABORATORY** If you have a character here, you pay 1 {I} less to play items.",
  abilities: [
    {
      type: "static",
      ability: "effects",
      name: "LABORATORY",
      text: " If you have a character here, you pay 1 {I} less to play items.",
      conditions: [
        {
          type: "chars-at-location",
          comparison: { operator: "gte", value: 1 },
        },
      ],
      effects: [
        {
          type: "attribute",
          attribute: "cost",
          amount: 1,
          modifier: "subtract",
          duration: "static",
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "owner", value: "self" },
              { filter: "type", value: "item" },
              { filter: "zone", value: "hand" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "Some of the most important tools in Lorcana are crafted here.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 1,
  willpower: 6,
  lore: 0,
  moveCost: 2,
  illustrator: "Alex Shin",
  number: 168,
  set: "ITI",
  rarity: "rare",
};
