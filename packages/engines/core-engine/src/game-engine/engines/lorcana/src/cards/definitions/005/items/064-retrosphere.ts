import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const retrosphere: LorcanaItemCardDefinition = {
  id: "i9p",
  name: "Retrosphere",
  characteristics: ["item"],
  text: "**EXTRACT OF AMETHYST** 2 {I}, Banish this item – Return chosen character, item, or location with cost 3 or less to their player’s hand.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "**EXTRACT OF AMETHYST**",
      text: "2 {I}, Banish this item – Return chosen character, item, or location with cost 3 or less to their player’s hand.",
      costs: [{ type: "ink", amount: 2 }, { type: "banish" }],
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 1,
            filters: [
              {
                filter: "attribute",
                value: "cost",
                comparison: { operator: "lte", value: 3 },
              },
              { filter: "type", value: ["character", "item", "location"] },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 1,
  illustrator: "Stefano Zanchi",
  number: 64,
  set: "SSK",
  rarity: "common",
};
