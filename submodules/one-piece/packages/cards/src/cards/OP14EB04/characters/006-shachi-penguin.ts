import type { CharacterCard } from "@tcg/op-types";
import { op14eb04ShachiPenguin006I18n } from "./006-shachi-penguin.i18n.ts";

export const op14eb04ShachiPenguin006: CharacterCard = {
  id: "OP14-006",
  canonicalId: "OP14-006",
  slug: "shachi-penguin/op14-006",
  name: "Shachi & Penguin",
  printings: [
    {
      id: "OP14-006",
      artId: "OP14-006",
      setCode: "OP14EB04",
      collectorNumber: "006",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-006_yPlWFhB.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Heart Pirates"],
  attribute: "ranged",
  effect:
    "[When Attacking] If this Character has 5000 power or more, give up to 1 of your opponent's Characters \u22122000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "cardState",
            target: "this",
            property: "power",
            comparison: "gte",
            value: 5000,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op14eb04ShachiPenguin006I18n,
};
