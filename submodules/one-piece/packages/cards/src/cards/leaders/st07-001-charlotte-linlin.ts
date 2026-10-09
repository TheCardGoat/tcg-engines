import type { LeaderCard } from "@tcg/op-types";
import { st07CharlotteLinlin001I18n } from "./st07-001-charlotte-linlin.i18n.ts";
export const st07CharlotteLinlin001: LeaderCard = {
  id: "ST07-001",
  canonicalId: "ST07-001",
  slug: "charlotte-linlin/st07-001",
  name: "Charlotte Linlin",
  printings: [
    {
      id: "ST07-001",
      artId: "ST07-001",
      setCode: "ST07",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST07-001.png",
    },
  ],
  cardType: "leader",
  color: ["yellow"],
  rarity: "L",
  setId: "ST07",
  life: 5,
  traits: ["The Four Emperors", "Big Mom Pirates"],
  power: 5000,
  attribute: "special",
  effect:
    "[DON!! x2] [When Attacking] You may add 1 card from the top or bottom of your Life cards to your hand: If you have 2 or less Life cards, add up to 1 card from your hand to the top of your Life cards.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
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
            action: "addToLife",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "top",
            condition: {
              condition: "lifeCount",
              player: "self",
              comparison: "lte",
              value: 2,
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st07CharlotteLinlin001I18n,
};
