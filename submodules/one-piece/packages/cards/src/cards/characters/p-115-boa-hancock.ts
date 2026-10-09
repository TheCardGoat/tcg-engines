import type { CharacterCard } from "@tcg/op-types";
import { pBoaHancock115I18n } from "./p-115-boa-hancock.i18n.ts";
export const pBoaHancock115: CharacterCard = {
  id: "P-115",
  canonicalId: "P-115",
  slug: "boa-hancock/p-115",
  name: "Boa Hancock",
  printings: [
    {
      id: "P-115",
      artId: "P-115",
      setCode: "P",
      collectorNumber: "115",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-115.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "P",
  setId: "P",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["The Seven Warlords of the Sea", "Kuja Pirates"],
  attribute: "special",
  effect: "[On Play] Give up to 1 rested DON!! card to your Leader or 1 of your Characters.",
  trigger:
    "Play up to 1 yellow Character card with 5000 power or less and a [Trigger] from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
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
        ],
      },
      {
        trigger: "trigger",
        actions: [
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
                filter: "hasTrigger",
                value: true,
              },
              {
                filter: "power",
                comparison: "lte",
                value: 5000,
              },
              {
                filter: "color",
                value: "yellow",
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
  i18n: pBoaHancock115I18n,
};
