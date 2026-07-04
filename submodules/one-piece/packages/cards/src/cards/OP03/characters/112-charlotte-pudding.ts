import type { CharacterCard } from "@tcg/op-types";
import { op03CharlottePudding112I18n } from "./112-charlotte-pudding.i18n.ts";

export const op03CharlottePudding112: CharacterCard = {
  id: "OP03-112",
  canonicalId: "OP03-112",
  slug: "charlotte-pudding/op03-112",
  name: "Charlotte Pudding",
  printings: [
    {
      id: "OP03-112",
      artId: "OP03-112",
      setCode: "OP03",
      collectorNumber: "112",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-112.jpg",
    },
    {
      id: "OP03-112_p1",
      artId: "OP03-112_p1",
      setCode: "OP03",
      collectorNumber: "112",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-112_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP03",
  cost: 1,
  power: 2000,
  counter: 2000,
  traits: ["Big Mom Pirates"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-112_p1.jpg",
      imageId: "OP03-112_p1",
    },
  ],
  effect:
    "[On Play] Look at 4 cards from the top of your deck; reveal up to 1 [Sanji] or [Big Mom Pirates] type card other than [Charlotte Pudding] and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                filter: "excludeName",
                value: "Charlotte Pudding",
              },
              {
                filter: "trait",
                value: "Sanji",
              },
              {
                filter: "trait",
                value: "Big Mom Pirates",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op03CharlottePudding112I18n,
};
