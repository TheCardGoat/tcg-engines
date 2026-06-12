import type { CharacterCard } from "@tcg/op-types";
import { op04Giolla025I18n } from "./025-giolla.i18n.ts";

export const op04Giolla025: CharacterCard = {
  id: "OP04-025",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP04",
  cost: 4,
  power: 4000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  effect:
    "[On Your Opponent's Attack] (2) (You may rest the specified number of DON!! cards in your cost area.): Rest up to 1 of your opponent's Characters with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "onOpponentAttack",
        costs: [
          {
            cost: "restDon",
            amount: 2,
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
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op04Giolla025I18n,
};
