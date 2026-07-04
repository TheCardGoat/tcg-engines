import type { CharacterCard } from "@tcg/op-types";
import { op02Tashigi105I18n } from "./105-tashigi.i18n.ts";

export const op02Tashigi105: CharacterCard = {
  id: "OP02-105",
  canonicalId: "OP02-105",
  slug: "tashigi/op02-105",
  name: "Tashigi",
  printings: [
    {
      id: "OP02-105",
      artId: "OP02-105",
      setCode: "OP02",
      collectorNumber: "105",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-105.jpg",
    },
    {
      id: "OP02-105_p1",
      artId: "OP02-105_p1",
      setCode: "OP02",
      collectorNumber: "105",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-105_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP02",
  cost: 3,
  power: 5000,
  traits: ["Navy"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-105_p1.jpg",
      imageId: "OP02-105_p1",
    },
  ],
  effect:
    "[DON!! x1] [When Attacking] Give up to 1 of your opponent's Characters -3 cost during this turn.",
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
  i18n: op02Tashigi105I18n,
};
