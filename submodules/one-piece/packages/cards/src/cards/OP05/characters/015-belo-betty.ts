import type { CharacterCard } from "@tcg/op-types";
import { op05BeloBetty015I18n } from "./015-belo-betty.i18n.ts";

export const op05BeloBetty015: CharacterCard = {
  id: "OP05-015",
  canonicalId: "OP05-015",
  slug: "belo-betty/op05-015",
  name: "Belo Betty",
  printings: [
    {
      id: "OP05-015",
      artId: "OP05-015",
      setCode: "OP05",
      collectorNumber: "015",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-015.jpg",
    },
    {
      id: "OP05-015_p1",
      artId: "OP05-015_p1",
      setCode: "OP05",
      collectorNumber: "015",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-015_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP05",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Revolutionary Army"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-015_p1.jpg",
      imageId: "OP05-015_p1",
    },
  ],
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 [Revolutionary Army] type card other than [Belo Betty] and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
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
                value: "Belo Betty",
              },
              {
                filter: "trait",
                value: "Revolutionary Army",
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
  i18n: op05BeloBetty015I18n,
};
