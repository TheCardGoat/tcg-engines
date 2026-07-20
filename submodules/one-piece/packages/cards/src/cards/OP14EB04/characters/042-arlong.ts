import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Arlong042I18n } from "./042-arlong.i18n.ts";

export const op14eb04Arlong042: CharacterCard = {
  id: "OP14-042",
  canonicalId: "OP14-042",
  slug: "arlong/op14-042",
  name: "Arlong",
  printings: [
    {
      id: "OP14-042",
      artId: "OP14-042",
      setCode: "OP14EB04",
      collectorNumber: "042",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-042_RAjDycK.jpg",
    },
    {
      id: "OP14-042_p1",
      artId: "OP14-042_p1",
      setCode: "OP14EB04",
      collectorNumber: "042",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-042_p1_390zyv0.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 1,
  power: 3000,
  traits: ["Fish-Man", "The Sun Pirates"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-042_p1_390zyv0.jpg",
      imageId: "OP14-042_p1",
    },
  ],
  effect:
    "[On Play] If your Leader has the {Fish-Man} type, look at 4 cards from the top of your deck; reveal up to 1 card with a cost of 2 or more and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Fish-Man",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "search",
            lookCount: 4,
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
                filter: "cost",
                comparison: "gte",
                value: 2,
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op14eb04Arlong042I18n,
};
