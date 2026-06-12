import type { CharacterCard } from "@tcg/op-types";
import { op03Buchi034I18n } from "./034-buchi.i18n.ts";

export const op03Buchi034: CharacterCard = {
  id: "OP03-034",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP03",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["East Blue Black Cat Pirates"],
  attribute: "slash",
  effect: "[On Play] K.O. up to 1 of your opponent's rested Characters with a cost of 2 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
      },
    ],
  },
  i18n: op03Buchi034I18n,
};
