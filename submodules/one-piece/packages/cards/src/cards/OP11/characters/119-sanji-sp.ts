import type { CharacterCard } from "@tcg/op-types";
import { op11SanjiSp119I18n } from "./119-sanji-sp.i18n.ts";

export const op11SanjiSp119: CharacterCard = {
  id: "OP06-119",
  canonicalId: "OP06-119",
  slug: "sanji-sp/op06-119",
  name: "Sanji (SP)",
  printings: [
    {
      id: "OP06-119",
      artId: "OP06-119",
      setCode: "OP11",
      collectorNumber: "119",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-119_p2.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "SEC",
  setId: "OP11",
  cost: 9,
  power: 9000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[On Play] Reveal 1 card from the top of your deck and play up to 1 Character with a cost of 9 or less other than [Sanji]. Then, place the rest at the bottom of your deck.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 1,
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
                value: "Sanji",
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 9,
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            revealDestination: "character",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op11SanjiSp119I18n,
};
