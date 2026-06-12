import type { CharacterCard } from "@tcg/op-types";
import { op06VinsmokeNiji065I18n } from "./065-vinsmoke-niji.i18n.ts";

export const op06VinsmokeNiji065: CharacterCard = {
  id: "OP06-065",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP06",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["The Vinsmoke Family GERMA 66"],
  attribute: "special",
  effect:
    "[On Play] If the number of DON!! cards on your field is equal to or less than the number on your opponent's field, choose one:\n• K.O. up to 1 of your opponent's Characters with a cost of 2 or less.\n• Return up to 1 of your opponent's Characters with a cost of 4 or less to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "donFieldComparison",
            selfComparison: "lte",
          },
        ],
        actions: [
          {
            action: "choice",
            options: [
              [
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
                        value: 2,
                      },
                    ],
                  },
                },
              ],
              [
                {
                  action: "returnToHand",
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
            ],
          },
        ],
      },
    ],
  },
  i18n: op06VinsmokeNiji065I18n,
};
