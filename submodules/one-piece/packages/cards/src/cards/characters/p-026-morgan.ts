import type { CharacterCard } from "@tcg/op-types";
import { pMorgan026I18n } from "./p-026-morgan.i18n.ts";
export const pMorgan026: CharacterCard = {
  id: "P-026",
  canonicalId: "P-026",
  slug: "morgan/p-026",
  name: "Morgan",
  printings: [
    {
      id: "P-026",
      artId: "P-026",
      setCode: "P",
      collectorNumber: "026",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-026.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "P",
  setId: "P",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "slash",
  effect: "[When Attacking] Give up to 1 of your opponent's Characters −3 cost during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -3,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: pMorgan026I18n,
};
