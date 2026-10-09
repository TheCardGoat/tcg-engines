import type { CharacterCard } from "@tcg/op-types";
import { st30Inazuma002I18n } from "./st30-002-inazuma.i18n.ts";
export const st30Inazuma002: CharacterCard = {
  id: "ST30-002",
  canonicalId: "ST30-002",
  slug: "inazuma/st30-002",
  name: "Inazuma",
  printings: [
    {
      id: "ST30-002",
      artId: "ST30-002",
      setCode: "ST30",
      collectorNumber: "002",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST30-002.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST30",
  cost: 1,
  traits: ["Impel Down", "Revolutionary Army"],
  power: 2000,
  attribute: "slash",
  counter: 1000,
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 Character card with 6000 power and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
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
                filter: "power",
                comparison: "eq",
                value: 6000,
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: st30Inazuma002I18n,
};
