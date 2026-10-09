import type { LeaderCard } from "@tcg/op-types";
import { pMonkeyDLuffy047I18n } from "./p-047-monkey-d-luffy.i18n.ts";
export const pMonkeyDLuffy047: LeaderCard = {
  id: "P-047",
  canonicalId: "P-047",
  slug: "monkey-d-luffy/p-047",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "P-047",
      artId: "P-047",
      setCode: "P",
      collectorNumber: "047",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-047.png",
    },
  ],
  cardType: "leader",
  color: ["blue"],
  rarity: "P",
  setId: "P",
  life: 5,
  traits: ["Straw Hat Crew"],
  power: 5000,
  attribute: "strike",
  effect: "[DON!! x1] [When Attacking] Draw 1 card if you have 3 or less cards in your hand.",
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
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
            condition: {
              condition: "handCount",
              player: "self",
              comparison: "lte",
              value: 3,
            },
          },
        ],
      },
    ],
  },
  i18n: pMonkeyDLuffy047I18n,
};
