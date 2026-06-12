import type { CharacterCard } from "@tcg/op-types";
import { op05DonquixoteDoflamingo028I18n } from "./028-donquixote-doflamingo.i18n.ts";

export const op05DonquixoteDoflamingo028: CharacterCard = {
  id: "OP05-028",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP05",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "ranged",
  effect:
    "[Activate:Main] You may trash this Character: K.O. up to 1 of your opponent's rested Characters with a cost of 2 or less.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashThisCard",
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
        optional: true,
      },
    ],
  },
  i18n: op05DonquixoteDoflamingo028I18n,
};
