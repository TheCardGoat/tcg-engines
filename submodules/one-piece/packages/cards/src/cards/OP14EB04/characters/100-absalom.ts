import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Absalom100I18n } from "./100-absalom.i18n.ts";

export const op14eb04Absalom100: CharacterCard = {
  id: "OP14-100",
  canonicalId: "OP14-100",
  slug: "absalom/op14-100",
  name: "Absalom",
  printings: [
    {
      id: "OP14-100",
      artId: "OP14-100",
      setCode: "OP14EB04",
      collectorNumber: "100",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-100_hiDs0zU.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 3,
  power: 5000,
  trigger:
    "Play up to 1 {Thriller Bark Pirates} type Character card with a cost of 4 or less from your trash rested.",
  traits: ["Thriller Bark Pirates"],
  attribute: "ranged",
  effect:
    "[On K.O.] Look at 3 cards from the top of your deck; reveal up to 1 {Thriller Bark Pirates} type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "search",
            lookCount: 3,
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
                value: "Thriller Bark Pirates",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "trash",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "lte",
                value: 4,
              },
              {
                filter: "trait",
                value: "Thriller Bark Pirates",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            playState: "rested",
          },
        ],
      },
    ],
  },
  i18n: op14eb04Absalom100I18n,
};
