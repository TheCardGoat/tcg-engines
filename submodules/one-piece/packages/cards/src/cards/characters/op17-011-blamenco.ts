import type { CharacterCard } from "@tcg/op-types";
import { op17Blamenco011I18n } from "./op17-011-blamenco.i18n.ts";

export const op17Blamenco011: CharacterCard = {
  id: "OP17-011",
  canonicalId: "OP17-011",
  slug: "blamenco/op17-011",
  name: "Blamenco",
  printings: [
    {
      id: "OP17-011",
      artId: "OP17-011",
      setCode: "OP17",
      collectorNumber: "011",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-011_AwQEWhK.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP17",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "strike",
  effect:
    "[DON!! x2] [When Attacking] Give up to 1 of your opponent's Characters 4000 power during this turn.",
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
            value: 4000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op17Blamenco011I18n,
};
