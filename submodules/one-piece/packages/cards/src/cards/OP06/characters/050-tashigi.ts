import type { CharacterCard } from "@tcg/op-types";
import { op06Tashigi050I18n } from "./050-tashigi.i18n.ts";

export const op06Tashigi050: CharacterCard = {
  id: "OP06-050",
  canonicalId: "OP06-050",
  slug: "tashigi/op06-050",
  name: "Tashigi",
  printings: [
    {
      id: "OP06-050",
      artId: "OP06-050",
      setCode: "OP06",
      collectorNumber: "050",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-050.jpg",
    },
    {
      id: "OP06-050_p1",
      artId: "OP06-050_p1",
      setCode: "OP06",
      collectorNumber: "050",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-050_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP06",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-050_p1.jpg",
      imageId: "OP06-050_p1",
    },
  ],
  effect:
    '[On Play] Look at 5 cards from the top of your deck; reveal up to 1 "Navy" type card other than [Tashigi] and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
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
                value: "Tashigi",
              },
              {
                filter: "trait",
                value: "Navy",
                match: "includes",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op06Tashigi050I18n,
};
