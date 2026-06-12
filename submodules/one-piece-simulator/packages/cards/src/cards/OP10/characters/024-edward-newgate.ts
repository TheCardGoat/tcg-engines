import type { CharacterCard } from "@tcg/op-types";
import { op10EdwardNewgate024I18n } from "./024-edward-newgate.i18n.ts";

export const op10EdwardNewgate024: CharacterCard = {
  id: "OP10-024",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP10",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["The Four Emperors Whitebeard Pirates ODYSSEY"],
  attribute: "special",
  effect:
    "[On Play] If you have 2 or more rested Characters, rest up to 1 of your opponent's Characters with a cost of 5 or less. Then, K.O. up to 1 of your opponent's rested Characters with a cost of 3 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "gte",
            value: 2,
            filters: [
              {
                filter: "state",
                value: "rested",
              },
            ],
          },
        ],
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
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
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
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op10EdwardNewgate024I18n,
};
