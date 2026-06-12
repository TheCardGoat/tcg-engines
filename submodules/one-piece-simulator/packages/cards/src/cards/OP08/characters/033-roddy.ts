import type { CharacterCard } from "@tcg/op-types";
import { op08Roddy033I18n } from "./033-roddy.i18n.ts";

export const op08Roddy033: CharacterCard = {
  id: "OP08-033",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP08",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Minks"],
  attribute: "slash",
  effect:
    "[On Play] If your Leader has the [Minks] type and your opponent has 7 or more rested cards, K.O. up to 1 of your opponent's rested Characters with a cost of 2 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Minks",
              },
              {
                condition: "zoneCount",
                player: "opponent",
                zone: "field",
                comparison: "gte",
                value: 7,
                filters: [
                  {
                    filter: "state",
                    value: "rested",
                  },
                ],
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
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 2,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op08Roddy033I18n,
};
