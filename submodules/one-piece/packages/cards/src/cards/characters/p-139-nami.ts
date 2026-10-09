import type { CharacterCard } from "@tcg/op-types";
import { pNami139I18n } from "./p-139-nami.i18n.ts";
export const pNami139: CharacterCard = {
  id: "P-139",
  canonicalId: "P-139",
  slug: "nami/p-139",
  name: "Nami",
  printings: [
    {
      id: "P-139",
      artId: "P-139",
      setCode: "P",
      collectorNumber: "139",
      rarity: "P",
      imageUrl: "https://asia-en.onepiece-cardgame.com/images/cardlist/card/P-139.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "P",
  setId: "P",
  cost: 5,
  power: 6000,
  counter: 1000,
  attribute: "wisdom",
  traits: ["Straw Hat Crew"],
  effect:
    "[On Play] Give up to 1 rested DON!! card to your Leader or 1 of your Characters. [DON!! x1] [When Attacking] Draw 1 card.",
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
        trigger: "whenAttacking",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: pNami139I18n,
};
