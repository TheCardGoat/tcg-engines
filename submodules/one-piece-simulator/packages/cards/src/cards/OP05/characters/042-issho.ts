import type { CharacterCard } from "@tcg/op-types";
import { op05Issho042I18n } from "./042-issho.i18n.ts";

export const op05Issho042: CharacterCard = {
  id: "OP05-042",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP05",
  cost: 6,
  power: 6000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "special",
  effect:
    "[On Play] Up to 1 of your opponent's Characters with a cost of 7 or less cannot attack until the start of your next turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "cannotAttack",
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
                  value: 7,
                },
              ],
            },
            duration: "untilStartOfNextTurn",
          },
        ],
      },
    ],
  },
  i18n: op05Issho042I18n,
};
