import type { CharacterCard } from "@tcg/op-types";
import { op14eb04PeronaOp06093Sp093I18n } from "./093-perona-op06-093-sp.i18n.ts";

export const op14eb04PeronaOp06093Sp093: CharacterCard = {
  id: "OP06-093",
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP14EB04",
  cost: 4,
  power: 5000,
  counter: 2000,
  traits: ["Thriller Bark Pirates"],
  attribute: "special",
  effect:
    "[On Play] If your opponent has 5 or more cards in their hand, choose one:• Your opponent trashes 1 card from their hand.• Give up to 1 of your opponent's Characters 3 cost during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "handCount",
            player: "opponent",
            comparison: "gte",
            value: 5,
          },
        ],
        actions: [
          {
            action: "choice",
            options: [
              [
                {
                  action: "trashFromHand",
                  player: "opponent",
                  amount: 1,
                },
              ],
              [
                {
                  action: "modifyCost",
                  target: {
                    player: "opponent",
                    zones: ["character"],
                    count: {
                      amount: 1,
                      upTo: true,
                    },
                  },
                  value: 3,
                  duration: "thisTurn",
                },
              ],
            ],
          },
        ],
      },
    ],
  },
  i18n: op14eb04PeronaOp06093Sp093I18n,
};
