import type { CharacterCard } from "@tcg/op-types";
import { pJewelryBonney113I18n } from "./p-113-jewelry-bonney.i18n.ts";
export const pJewelryBonney113: CharacterCard = {
  id: "P-113",
  canonicalId: "P-113",
  slug: "jewelry-bonney/p-113",
  name: "Jewelry Bonney",
  printings: [
    {
      id: "P-113",
      artId: "P-113",
      setCode: "P",
      collectorNumber: "113",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-113.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "P",
  setId: "P",
  cost: 4,
  power: 4000,
  counter: 2000,
  traits: ["Bonney Pirates"],
  attribute: "special",
  effect: "[DON!! x2] [Opponent's Turn] This Character gains [Blocker] and +2000 power.",
  trigger: "K.O. up to 1 of your opponent's Characters with a cost of 3 or less.",
  effects: {
    effects: [
      {
        trigger: "trigger",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
          },
        ],
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
          },
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "blocker",
            duration: "permanent",
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 2000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: pJewelryBonney113I18n,
};
