import type { CharacterCard } from "@tcg/op-types";
import { op06Camie025I18n } from "./025-camie.i18n.ts";

export const op06Camie025: CharacterCard = {
  id: "OP06-025",
  canonicalId: "OP06-025",
  slug: "camie/op06-025",
  name: "Camie",
  printings: [
    {
      id: "OP06-025",
      artId: "OP06-025",
      setCode: "OP06",
      collectorNumber: "025",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-025.jpg",
    },
    {
      id: "OP06-025_p1",
      artId: "OP06-025_p1",
      setCode: "OP06",
      collectorNumber: "025",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-025_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP06",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Merfolk"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-025_p1.jpg",
      imageId: "OP06-025_p1",
    },
  ],
  effect:
    '[On Play] Look at 4 cards from the top of your deck; reveal up to 1 "Fish-Man" or "Merfolk" type card other than [Camie] and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
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
                value: "Camie",
              },
              {
                filter: "anyOf",
                filters: [
                  {
                    filter: "trait",
                    value: "Fish-Man",
                    match: "includes",
                  },
                  {
                    filter: "trait",
                    value: "Merfolk",
                    match: "includes",
                  },
                ],
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op06Camie025I18n,
};
