import type { CharacterCard } from "@tcg/op-types";
import { op09Mohji053I18n } from "./053-mohji.i18n.ts";

export const op09Mohji053: CharacterCard = {
  id: "OP09-053",
  canonicalId: "OP09-053",
  slug: "mohji/op09-053",
  name: "Mohji",
  printings: [
    {
      id: "OP09-053",
      artId: "OP09-053",
      setCode: "OP09",
      collectorNumber: "053",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-053.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP09",
  cost: 5,
  power: 5000,
  counter: 2000,
  traits: ["Cross Guild"],
  attribute: "wisdom",
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 [Richie] and add it to your hand. Then, place the rest at the bottom of your deck in any order and play up to 1 [Richie] from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 5,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "name",
                value: "Richie",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "name",
                value: "Richie",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op09Mohji053I18n,
};
