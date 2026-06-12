import type { CharacterCard } from "@tcg/op-types";
import { op09Nami050I18n } from "./050-nami.i18n.ts";

export const op09Nami050: CharacterCard = {
  id: "OP09-050",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP09",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["East Blue"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-050_p1.jpg",
      imageId: "OP09-050_p1",
    },
  ],
  effect:
    "[When Attacking] Look at 5 cards from the top of your deck; reveal up to 1 blue Event and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
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
                filter: "color",
                value: "blue",
              },
              {
                filter: "cardCategory",
                value: "event",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op09Nami050I18n,
};
