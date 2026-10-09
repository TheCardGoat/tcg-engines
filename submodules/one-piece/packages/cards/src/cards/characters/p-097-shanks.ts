import type { CharacterCard } from "@tcg/op-types";
import { pShanks097I18n } from "./p-097-shanks.i18n.ts";
export const pShanks097: CharacterCard = {
  id: "P-097",
  canonicalId: "P-097",
  slug: "shanks/p-097",
  name: "Shanks",
  printings: [
    {
      id: "P-097",
      artId: "P-097",
      setCode: "P",
      collectorNumber: "097",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-097.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "P",
  setId: "P",
  cost: 10,
  power: 12000,
  traits: ["The Four Emperors", "Red-Haired Pirates"],
  attribute: "slash",
  effect: "[On Play]/[When Attacking] Your opponent cannot activate [Blocker] during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "cannotActivate",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            keyword: "blocker",
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "cannotActivate",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            keyword: "blocker",
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: pShanks097I18n,
};
