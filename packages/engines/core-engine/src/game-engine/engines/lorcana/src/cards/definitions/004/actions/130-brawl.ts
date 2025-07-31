import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const brawl: LorcanaActionCardDefinition = {
  id: "wsx",
  name: "Brawl",
  characteristics: ["action"],
  text: "Banish chosen character with 2 {S} or less.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Brawl",
      text: "Banish chosen character with 2 {S} or less.",
      effects: [
        {
          type: "banish",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "zone", value: "play" },
              { filter: "type", value: "character" },
              {
                filter: "attribute",
                value: "strength",
                comparison: { operator: "lte", value: 2 },
              },
            ],
          },
        },
      ],
    },
  ],
  flavour:
    "There are two ways to leave the Snuggly Duckling - the door or the window.",
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  illustrator: "R. la Barbera / L. Giammichele",
  number: 130,
  set: "URR",
  rarity: "common",
};
