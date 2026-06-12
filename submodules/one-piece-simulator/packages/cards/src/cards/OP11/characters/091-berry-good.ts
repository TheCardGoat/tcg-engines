import type { CharacterCard } from "@tcg/op-types";
import { op11BerryGood091I18n } from "./091-berry-good.i18n.ts";

export const op11BerryGood091: CharacterCard = {
  id: "OP11-091",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP11",
  cost: 4,
  power: 5000,
  counter: 2000,
  traits: ["Navy"],
  attribute: "special",
  effect:
    "[On Play] Your opponent places 3 Events from their trash at the bottom of their deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "opponent",
              zones: ["trash"],
              count: {
                amount: 3,
              },
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op11BerryGood091I18n,
};
