import type { CharacterCard } from "@tcg/op-types";
import { op02Magura016I18n } from "./016-magura.i18n.ts";

export const op02Magura016: CharacterCard = {
  id: "OP02-016",
  canonicalId: "OP02-016",
  slug: "magura",
  name: "Magura",
  printings: [
    {
      id: "OP02-016",
      artId: "OP02-016",
      setCode: "OP02",
      collectorNumber: "016",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-016.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP02",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Mountain Bandits"],
  attribute: "slash",
  effect:
    "[On Play] Up to 1 of your red Characters with a cost of 1 gains +3000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "color",
                  value: "red",
                },
                {
                  filter: "cost",
                  comparison: "eq",
                  value: 1,
                },
              ],
            },
            value: 3000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op02Magura016I18n,
};
