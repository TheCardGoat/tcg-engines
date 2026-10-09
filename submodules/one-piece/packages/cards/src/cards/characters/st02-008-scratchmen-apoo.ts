import type { CharacterCard } from "@tcg/op-types";
import { st02ScratchmenApoo008I18n } from "./st02-008-scratchmen-apoo.i18n.ts";
export const st02ScratchmenApoo008: CharacterCard = {
  id: "ST02-008",
  canonicalId: "ST02-008",
  slug: "scratchmen-apoo/st02-008",
  name: "Scratchmen Apoo",
  printings: [
    {
      id: "ST02-008",
      artId: "ST02-008",
      setCode: "ST02",
      collectorNumber: "008",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST02-008.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "ST02",
  cost: 2,
  power: 3000,
  counter: 2000,
  traits: ["Supernovas", "On-Air Pirates"],
  attribute: "ranged",
  effect: "[DON!! x1] [When Attacking] Rest up to 1 of your opponent's DON!! cards.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
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
  i18n: st02ScratchmenApoo008I18n,
};
