import type { CharacterCard } from "@tcg/op-types";
import { st09ShimotsukiUshimaru008I18n } from "./st09-008-shimotsuki-ushimaru.i18n.ts";
export const st09ShimotsukiUshimaru008: CharacterCard = {
  id: "ST09-008",
  canonicalId: "ST09-008",
  slug: "shimotsuki-ushimaru/st09-008",
  name: "Shimotsuki Ushimaru",
  printings: [
    {
      id: "ST09-008",
      artId: "ST09-008",
      setCode: "ST09",
      collectorNumber: "008",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST09-008.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "ST09",
  cost: 5,
  traits: ["Land of Wano"],
  power: 6000,
  attribute: "slash",
  effect:
    "[DON!! x1] [When Attacking] You may add 1 card from the top or bottom of your Life cards to your hand: Play up to 1 yellow {Land of Wano} type Character card with a cost of 4 or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        costs: [
          {
            cost: "addLifeToHand",
            amount: 1,
            position: "choice",
          },
        ],
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
                filter: "cost",
                comparison: "lte",
                value: 4,
              },
              {
                filter: "color",
                value: "yellow",
              },
              {
                filter: "trait",
                value: "Land of Wano",
                match: "exact",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st09ShimotsukiUshimaru008I18n,
};
