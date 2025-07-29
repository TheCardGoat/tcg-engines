import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const befuddle: LorcanaActionCardDefinition = {
  id: "teb",
  name: "Befuddle",
  characteristics: ["action"],
  text: "Return a character or item with cost 2 or less to their player's hand.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Befuddle",
      text: "Return a character or item with cost 2 or less to their player's hand.",
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: ["character", "item"] },
              { filter: "zone", value: "play" },
              {
                filter: "attribute",
                value: "cost",
                comparison: { operator: "lte", value: 2 },
              },
            ],
          },
        },
      ],
    },
  ],
  flavour: "Never be afraid to have your mind boggled now and then.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 1,
  illustrator: "Kendall Hale",
  number: 62,
  set: "TFC",
  rarity: "uncommon",
};
