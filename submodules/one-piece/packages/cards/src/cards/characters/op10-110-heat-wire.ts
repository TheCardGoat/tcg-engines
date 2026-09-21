import type { CharacterCard } from "@tcg/op-types";
import { op10HeatWire110I18n } from "./op10-110-heat-wire.i18n.ts";

export const op10HeatWire110: CharacterCard = {
  id: "OP10-110",
  canonicalId: "OP10-110",
  slug: "heat-wire/op10-110",
  name: "Heat & Wire",
  printings: [
    {
      id: "OP10-110",
      artId: "OP10-110",
      setCode: "OP10",
      collectorNumber: "110",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-110.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP10",
  cost: 3,
  power: 4000,
  counter: 1000,
  trigger: "If you have 2 or less Life cards, play this card.",
  traits: ["Kid Pirates"],
  attribute: ["slash", "special"],
  effect:
    "[On Play] Rest up to 1 of your opponent's Characters with a cost equal to or less than the number of your opponent's Life cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "dynamicCost",
                  comparison: "lte",
                  source: "opponentLifeCount",
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 2,
          },
        ],
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: op10HeatWire110I18n,
};
