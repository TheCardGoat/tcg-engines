import type { CharacterCard } from "@tcg/op-types";
import { op08CharlotteOpera102I18n } from "./102-charlotte-opera.i18n.ts";

export const op08CharlotteOpera102: CharacterCard = {
  id: "OP08-102",
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP08",
  cost: 6,
  power: 6000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "special",
  effect:
    "[On Play] You may trash 1 card from your hand: K.O. up to 1 of your opponent's Characters with a cost equal to or less than your number of Life cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                  source: "selfLifeCount",
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op08CharlotteOpera102I18n,
};
