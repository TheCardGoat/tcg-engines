import type { CharacterCard } from "@tcg/op-types";
import { op08DrKureha015I18n } from "./015-dr-kureha.i18n.ts";

export const op08DrKureha015: CharacterCard = {
  id: "OP08-015",
  canonicalId: "OP08-015",
  slug: "dr-kureha",
  name: "Dr.Kureha",
  printings: [
    {
      id: "OP08-015",
      artId: "OP08-015",
      setCode: "OP08",
      collectorNumber: "015",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-015.jpg",
    },
    {
      id: "OP08-015_p1",
      artId: "OP08-015_p1",
      setCode: "OP08",
      collectorNumber: "015",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-015_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP08",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Drum Kingdom"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-015_p1.jpg",
      imageId: "OP08-015_p1",
    },
  ],
  effect:
    "[On Play] Look at 4 cards from the top of your deck; reveal up to 1 [Tony Tony.Chopper] or {Drum Kingdom} type card other than [Dr.Kureha] and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
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
                value: "Dr.Kureha",
              },
              {
                filter: "anyOf",
                filters: [
                  {
                    filter: "name",
                    value: "Tony Tony.Chopper",
                  },
                  {
                    filter: "trait",
                    value: "Drum Kingdom",
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
  i18n: op08DrKureha015I18n,
};
