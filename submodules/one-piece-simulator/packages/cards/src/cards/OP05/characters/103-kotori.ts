import type { CharacterCard } from "@tcg/op-types";
import { op05Kotori103I18n } from "./103-kotori.i18n.ts";

export const op05Kotori103: CharacterCard = {
  id: "OP05-103",
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP05",
  cost: 3,
  power: 3000,
  counter: 1000,
  traits: ["Sky Island"],
  attribute: "special",
  effect:
    "[On Play] If you have [Hotori], K.O. up to 1 of your opponent's Characters with a cost equal to or less than the number of your opponent's Life cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "hasCard",
            player: "self",
            zone: "field",
            filters: [
              {
                filter: "name",
                value: "Hotori",
              },
            ],
          },
        ],
        actions: [
          {
            action: "ko",
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
  },
  i18n: op05Kotori103I18n,
};
