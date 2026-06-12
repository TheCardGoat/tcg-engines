import type { CharacterCard } from "@tcg/op-types";
import { op08Queen080I18n } from "./080-queen.i18n.ts";

export const op08Queen080: CharacterCard = {
  id: "OP08-080",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP08",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "strike",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-080_p1.jpg",
      imageId: "OP08-080_p1",
    },
  ],
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 {Animal Kingdom Pirates} type card other than [Queen] and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
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
                filter: "excludeName",
                value: "Queen",
              },
              {
                filter: "trait",
                value: "Animal Kingdom Pirates",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op08Queen080I18n,
};
