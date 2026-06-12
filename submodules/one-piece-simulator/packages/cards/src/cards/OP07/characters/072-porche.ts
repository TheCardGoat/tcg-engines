import type { CharacterCard } from "@tcg/op-types";
import { op07Porche072I18n } from "./072-porche.i18n.ts";

export const op07Porche072: CharacterCard = {
  id: "OP07-072",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP07",
  cost: 3,
  power: 5000,
  traits: ["Foxy Pirates"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-072_p1.jpg",
      imageId: "OP07-072_p1",
    },
  ],
  effect:
    "[On Play] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Look at 5 cards from the top of your deck; reveal up to 1 [Foxy Pirates] type card and add it to your hand. Then, place the rest at the bottom of your deck in any order and play up to 1 purple Character card with 4000 power or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
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
                filter: "trait",
                value: "Foxy Pirates",
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
                filter: "power",
                comparison: "lte",
                value: 4000,
              },
              {
                filter: "color",
                value: "purple",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op07Porche072I18n,
};
