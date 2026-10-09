import type { CharacterCard } from "@tcg/op-types";
import { pTonyTonyChopper065I18n } from "./p-065-tony-tony-chopper.i18n.ts";
export const pTonyTonyChopper065: CharacterCard = {
  id: "P-065",
  canonicalId: "P-065",
  slug: "tony-tony-chopper/p-065",
  name: "Tony Tony.Chopper",
  printings: [
    {
      id: "P-065",
      artId: "P-065",
      setCode: "P",
      collectorNumber: "065",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-065.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "P",
  setId: "P",
  cost: 3,
  traits: ["Animal", "Straw Hat Crew"],
  power: 4000,
  attribute: "wisdom",
  counter: 1000,
  effect:
    "[When Attacking] If your opponent has a Character with a cost of 0, this Character gains +2000 power until the start of your next turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "hasCard",
            player: "opponent",
            zone: "character",
            filters: [
              {
                filter: "cost",
                comparison: "eq",
                value: 0,
              },
            ],
          },
        ],
        actions: [
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
            duration: "untilStartOfNextTurn",
          },
        ],
      },
    ],
  },
  i18n: pTonyTonyChopper065I18n,
};
