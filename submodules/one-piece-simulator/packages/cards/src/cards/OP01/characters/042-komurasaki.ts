import type { CharacterCard } from "@tcg/op-types";
import { op01Komurasaki042I18n } from "./042-komurasaki.i18n.ts";

export const op01Komurasaki042: CharacterCard = {
  id: "OP01-042",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP01",
  cost: 1,
  power: 0,
  counter: 1000,
  traits: ["Land of Wano Kouzuki Clan"],
  attribute: "wisdom",
  effect:
    '[On Play] (3) (You may rest the specified number of DON!! cards in your cost area): If your Leader is [Kouzuki Oden], set up to 1 of your "Land of Wano" type Character cards with a cost of 3 or less as active.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderName",
            name: "Kouzuki Oden",
          },
        ],
        costs: [
          {
            cost: "restDon",
            amount: 3,
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
                  value: "Land of Wano",
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
  i18n: op01Komurasaki042I18n,
};
