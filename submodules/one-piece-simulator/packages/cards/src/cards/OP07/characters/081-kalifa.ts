import type { CharacterCard } from "@tcg/op-types";
import { op07Kalifa081I18n } from "./081-kalifa.i18n.ts";

export const op07Kalifa081: CharacterCard = {
  id: "OP07-081",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP07",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["CP0"],
  attribute: "special",
  effect: "[DON!! x1] [Your Turn] Give all of your opponent's Characters -1 cost.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            value: -1,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op07Kalifa081I18n,
};
