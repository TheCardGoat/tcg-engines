import type { CharacterCard } from "@tcg/op-types";
import { op06Inuarashi100I18n } from "./100-inuarashi.i18n.ts";

export const op06Inuarashi100: CharacterCard = {
  id: "OP06-100",
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP06",
  cost: 4,
  power: 5000,
  counter: 1000,
  trigger: "If your opponent has 3 or less Life cards, play this card.",
  traits: ["Land of Wano Minks The Akazaya Nine"],
  attribute: "slash",
  effect:
    "[DON!! x2][When Attacking] You may trash 1 card from your hand: K.O. up to 1 of your opponent's Characters with a cost equal to or less than the number of your opponent's Life cards.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
          },
        ],
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
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
        optional: true,
      },
    ],
  },
  i18n: op06Inuarashi100I18n,
};
