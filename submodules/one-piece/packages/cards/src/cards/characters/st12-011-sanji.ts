import type { CharacterCard } from "@tcg/op-types";
import { st12Sanji011I18n } from "./st12-011-sanji.i18n.ts";
export const st12Sanji011: CharacterCard = {
  id: "ST12-011",
  canonicalId: "ST12-011",
  slug: "sanji/st12-011",
  name: "Sanji",
  printings: [
    {
      id: "ST12-011",
      artId: "ST12-011",
      setCode: "ST12",
      collectorNumber: "011",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST12-011.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "ST12",
  cost: 2,
  traits: ["Straw Hat Crew"],
  power: 3000,
  attribute: "strike",
  effect:
    "[DON!! x1] [When Attacking] If you have 5 or less cards in your hand, this Character gains +2000 power until the start of your next turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "handCount",
            player: "self",
            comparison: "lte",
            value: 5,
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
  i18n: st12Sanji011I18n,
};
