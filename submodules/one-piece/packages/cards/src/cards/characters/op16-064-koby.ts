import type { CharacterCard } from "@tcg/op-types";
import { op16Koby064I18n } from "./op16-064-koby.i18n.ts";

export const op16Koby064: CharacterCard = {
  id: "OP16-064",
  canonicalId: "OP16-064",
  slug: "koby/op16-064",
  name: "Koby",
  printings: [
    {
      id: "OP16-064",
      artId: "OP16-064",
      setCode: "OP16",
      collectorNumber: "064",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-064_sdV5K9v.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP16",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "strike",
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 {Navy} type card other than [Koby] and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
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
                value: "Koby",
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
  i18n: op16Koby064I18n,
};
