import type { CharacterCard } from "@tcg/op-types";
import { op02Buggy058I18n } from "./058-buggy.i18n.ts";

export const op02Buggy058: CharacterCard = {
  id: "OP02-058",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP02",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Buggy Pirates Impel Down"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-058_p1.jpg",
      imageId: "OP02-058_p1",
    },
  ],
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 blue [Impel Down] type card other than [Buggy] and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
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
                value: "Buggy",
              },
              {
                filter: "color",
                value: "blue",
              },
              {
                filter: "trait",
                value: "Impel Down",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op02Buggy058I18n,
};
