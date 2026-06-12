import type { CharacterCard } from "@tcg/op-types";
import { op05DonquixoteDoflamingo029I18n } from "./029-donquixote-doflamingo.i18n.ts";

export const op05DonquixoteDoflamingo029: CharacterCard = {
  id: "OP05-029",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP05",
  cost: 7,
  power: 8000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  effect:
    "[On Your Opponent's Attack][Once Per Turn] (1) (You may rest the specified number of DON!! cards in your cost area.): Rest up to 1 of your opponent's Characters with a cost of 6 or less.",
  effects: {
    effects: [
      {
        trigger: "onOpponentAttack",
        costs: [
          {
            cost: "restDon",
            amount: 1,
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
                  value: 6,
                },
              ],
            },
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op05DonquixoteDoflamingo029I18n,
};
