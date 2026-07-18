import type { CharacterCard } from "@tcg/op-types";
import { op03Blamenco011I18n } from "./011-blamenco.i18n.ts";

export const op03Blamenco011: CharacterCard = {
  id: "OP03-011",
  canonicalId: "OP03-011",
  slug: "blamenco/op03-011",
  name: "Blamenco",
  printings: [
    {
      id: "OP03-011",
      artId: "OP03-011",
      setCode: "OP03",
      collectorNumber: "011",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-011.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP03",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "strike",
  effect:
    "[DON!! x1] [When Attacking] Give up to 1 of your opponent's Characters −2000 power during this turn.",
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
  i18n: op03Blamenco011I18n,
};
