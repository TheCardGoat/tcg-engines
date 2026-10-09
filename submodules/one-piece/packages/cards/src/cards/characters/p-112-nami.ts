import type { CharacterCard } from "@tcg/op-types";
import { pNami112I18n } from "./p-112-nami.i18n.ts";
export const pNami112: CharacterCard = {
  id: "P-112",
  canonicalId: "P-112",
  slug: "nami/p-112",
  name: "Nami",
  printings: [
    {
      id: "P-112",
      artId: "P-112",
      setCode: "P",
      collectorNumber: "112",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-112.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "P",
  setId: "P",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "special",
  effect:
    "[On Play] If your Leader is [Nami], give up to 1 rested DON!! card to your Leader. Then, play up to 1 Character card with a cost of 2 or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderName",
            name: "Nami",
          },
        ],
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "lte",
                value: 2,
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: pNami112I18n,
};
