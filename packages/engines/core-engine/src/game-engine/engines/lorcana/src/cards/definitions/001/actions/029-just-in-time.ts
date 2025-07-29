import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const justInTime: LorcanaActionCardDefinition = {
  id: "gir",
  name: "Just in Time",
  characteristics: ["action"],
  text: "You may play a character with cost 5 or less for free.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      optional: true,
      effects: [
        {
          type: "play",
          forFree: true,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "zone", value: "hand" },
              { filter: "type", value: "character" },
              {
                filter: "attribute",
                value: "cost",
                comparison: { operator: "lte", value: 5 },
              },
            ],
          },
        },
      ],
    },
  ],
  flavour:
    "The best heroes always arrive at the perfect moment− \rwhether they know it or not.",
  colors: ["amber"],
  cost: 3,
  illustrator: "Leonardo Giammichele",
  number: 29,
  set: "TFC",
  rarity: "rare",
};
