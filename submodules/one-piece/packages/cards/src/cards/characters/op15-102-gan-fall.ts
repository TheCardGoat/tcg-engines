import type { CharacterCard } from "@tcg/op-types";
import { op15GanFall102I18n } from "./op15-102-gan-fall.i18n.ts";

export const op15GanFall102: CharacterCard = {
  id: "OP15-102",
  canonicalId: "OP15-102",
  slug: "gan-fall/op15-102",
  name: "Gan.Fall",
  printings: [
    {
      id: "OP15-102",
      artId: "OP15-102",
      setCode: "OP15",
      collectorNumber: "102",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-102_zQbPBzl.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP15",
  cost: 4,
  power: 4000,
  counter: 2000,
  traits: ["Sky Island"],
  attribute: "slash",
  effect:
    "If you have a {Sky Island} type Character with 7000 power or more, give this card in your hand -3 cost.\n[On Play] Rest up to 1 of your opponent's Characters with a cost equal to or less than the number of your opponent's Life cards.",
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
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "hasCard",
            player: "self",
            zone: "character",
            filters: [
              {
                filter: "trait",
                value: "Sky Island",
              },
              {
                filter: "power",
                comparison: "gte",
                value: 7000,
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: -3,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op15GanFall102I18n,
};
