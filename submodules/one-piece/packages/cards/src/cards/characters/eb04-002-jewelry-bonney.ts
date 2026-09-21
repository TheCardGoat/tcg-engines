import type { CharacterCard } from "@tcg/op-types";
import { eb04JewelryBonney002I18n } from "./eb04-002-jewelry-bonney.i18n.ts";

export const eb04JewelryBonney002: CharacterCard = {
  id: "EB04-002",
  canonicalId: "EB04-002",
  slug: "jewelry-bonney/eb04-002",
  name: "Jewelry Bonney",
  printings: [
    {
      id: "EB04-002",
      artId: "EB04-002",
      setCode: "EB04",
      collectorNumber: "002",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-002_RN47PrV.jpg",
      label: "Jewelry Bonney (EB04-002)",
    },
    {
      id: "EB04-002_p1",
      artId: "EB04-002_p1",
      setCode: "EB04",
      collectorNumber: "002",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-002_p1_8j7Zw4U.jpg",
      label: "Jewelry Bonney (EB04-002) (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "EB04",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Bonney Pirates Egghead"],
  attribute: "special",
  effect:
    "[On Play] Look at 4 cards from the top of your deck; reveal up to 1 {Egghead} or {Straw Hat Crew} type card other than [Jewelry Bonney] and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
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
                value: "Jewelry Bonney",
              },
              {
                filter: "anyOf",
                filters: [
                  {
                    filter: "trait",
                    value: "Egghead",
                    match: "includes",
                  },
                  {
                    filter: "trait",
                    value: "Straw Hat Crew",
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
  i18n: eb04JewelryBonney002I18n,
};
