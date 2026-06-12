import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Yosaku035I18n } from "./035-yosaku.i18n.ts";

export const op14eb04Yosaku035: CharacterCard = {
  id: "OP14-035",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["East Blue"],
  attribute: "slash",
  effect:
    "[Your Turn] When this Character becomes rested, up to 1 of your opponent's rested Characters with a cost of 4 or less will not become active in your opponent's next Refresh Phase.",
  effects: {
    effects: [
      {
        trigger: "whenBecomesRested",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "freeze",
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
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op14eb04Yosaku035I18n,
};
