import type { CharacterCard } from "@tcg/op-types";
import { op02Shishilian032I18n } from "./032-shishilian.i18n.ts";

export const op02Shishilian032: CharacterCard = {
  id: "OP02-032",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP02",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Minks"],
  attribute: "slash",
  effect:
    "[On Play] (2) (You may rest the specified number of DON!! cards in your cost area.): Set up to 1 of your [Minks] type Characters with a cost of 5 or less as active.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "restDon",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Minks",
                },
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
  i18n: op02Shishilian032I18n,
};
