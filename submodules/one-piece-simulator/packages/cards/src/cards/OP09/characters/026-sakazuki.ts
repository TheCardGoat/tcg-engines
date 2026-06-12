import type { CharacterCard } from "@tcg/op-types";
import { op09Sakazuki026I18n } from "./026-sakazuki.i18n.ts";

export const op09Sakazuki026: CharacterCard = {
  id: "OP09-026",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP09",
  cost: 6,
  power: 7000,
  traits: ["Navy ODYSSEY"],
  attribute: "special",
  effect:
    "[On Play] If you have 2 or more rested Characters, K.O. up to 1 of your opponent's Characters with a cost of 5 or less.",
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
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op09Sakazuki026I18n,
};
